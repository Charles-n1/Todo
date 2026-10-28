import answerSuccessUrl from './assets/Sound/answer_success.mp3';
import victoryUrl from './assets/Sound/victory.mp3';
import backgroundMusicUrl from './assets/Music/background_music.mp3';
import backgroundMusic2Url from './assets/Music/background_music2.mp3';
import backgroundMusic3Url from './assets/Music/background_music3.mp3';
import tobuRootsUrl from './assets/Music/tobu_roots.mp3';

export const MUSICS = [
  { name: 'Background music', file: backgroundMusicUrl },
  { name: 'Background music 2', file: backgroundMusic2Url },
  { name: 'Background music 3', file: backgroundMusic3Url },
  { name: 'Tobu - Roots', file: tobuRootsUrl },
  { name: 'Off', file: null },
];

const SOUND_FILES = {
  success: answerSuccessUrl, // a task is checked
  victory: victoryUrl, // every task of the day is done
};

// The browser's sound mixer (Web Audio). Each volume is a "gain" knob.
// Why not audio.volume? The iPhone ignores it: the volume would always be 100%.
let context = null;
let soundGain = null;
let musicGain = null;
const soundBuffers = {}; // the sounds, already decoded: they play instantly
const musicElement = new Audio();
musicElement.loop = true; // restart at the end
let musicUrl = null; // the music file, as a local copy
let wanted = { music: MUSICS[0], musicVolume: 0.3, soundVolume: 1 };

// The events that count as a "real tap" for the browser (pointerdown does NOT, with a finger).
const TAP_EVENTS = ['pointerup', 'touchend', 'click', 'keydown'];

// Called once, when the app opens.
// Browsers block sound until a first tap. So: we download everything NOW,
// we try to play NOW (some browsers allow it), and every tap wakes the sound up.
export function startAudio(settings) {
  wanted = { music: settings.music, musicVolume: settings.musicVolume, soundVolume: settings.soundVolume };
  // iPhone: play even when the silent switch is on 🔕
  if (navigator.audioSession) navigator.audioSession.type = 'playback';

  context = new AudioContext(); // "asleep" (suspended) until the first tap on most browsers
  soundGain = context.createGain();
  soundGain.gain.value = wanted.soundVolume;
  soundGain.connect(context.destination);
  musicGain = context.createGain();
  musicGain.gain.value = wanted.musicVolume;
  musicGain.connect(context.destination);
  context.createMediaElementSource(musicElement).connect(musicGain);

  for (const [name, url] of Object.entries(SOUND_FILES)) {
    loadSound(name, url);
  }
  playMusic(wanted.music);

  for (const name of TAP_EVENTS) {
    window.addEventListener(name, wakeUpAudio);
  }
  document.addEventListener('visibilitychange', pauseWhenHidden);
}

// On each tap: if the sound is still asleep, wake it up. (Already awake: nothing happens.)
function wakeUpAudio() {
  if (context.state === 'suspended') context.resume();
  if (wanted.music.file && musicElement.src && musicElement.paused) {
    musicElement.play().catch(() => {});
  }
}

async function loadSound(name, url) {
  const response = await fetch(url);
  const data = await response.arrayBuffer();
  soundBuffers[name] = await context.decodeAudioData(data);
}

// The music stops when you leave the app, and comes back.
function pauseWhenHidden() {
  if (document.hidden) {
    musicElement.pause();
  } else if (wanted.music.file) {
    musicElement.play().catch(() => {});
  }
}

// volume: from 0 (mute) to 1 (max)
export function setMusicVolume(volume) {
  wanted.musicVolume = volume;
  if (musicGain) musicGain.gain.value = volume;
}

export function setSoundVolume(volume) {
  wanted.soundVolume = volume;
  if (soundGain) soundGain.gain.value = volume;
}

export async function playMusic(music) {
  wanted.music = music;
  if (!context) return; // startAudio() not called yet

  if (music.file === null) {
    musicElement.pause();
    return;
  }
  // We download the whole file first: the offline mode can then keep a copy of it.
  const response = await fetch(music.file);
  const blob = await response.blob();
  if (wanted.music !== music) return; // another music was chosen meanwhile
  if (musicUrl) URL.revokeObjectURL(musicUrl);
  musicUrl = URL.createObjectURL(blob);
  musicElement.src = musicUrl;
  musicElement.play().catch(() => {}); // refused before the first tap: wakeUpAudio() will retry
}

// name: 'success' | 'victory'
export function playSound(name) {
  if (!context || !soundBuffers[name]) return;
  const source = context.createBufferSource(); // a one-shot player
  source.buffer = soundBuffers[name];
  source.connect(soundGain);
  source.start();
}
