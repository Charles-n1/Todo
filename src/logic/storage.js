import { validTasks, validDone, validSettings } from './validate';

// Saved in the browser (localStorage): still there after closing the app.
// localStorage only stores text, so we convert with JSON.
// On the web, reading is instant (no "await"): the app reads everything when it opens.
const TASKS_KEY = 'tasks';
const DONE_KEY = 'done';
const SETTINGS_KEY = 'settings';

// 🔒 All the sites on charles-n1.github.io share ONE localStorage (same "origin").
// So our keys start with the app name: Prep my TOEIC (or another site) can't erase our tasks.
const PREFIX = 'todo:';

// 🔒 Broken text (corrupted, modified...) -> null ("no save") instead of crashing the app.
function readJson(key) {
  try {
    const text = localStorage.getItem(PREFIX + key);
    return text ? JSON.parse(text) : null;
  } catch (error) {
    return null;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (error) {
    // Storage full, or blocked (private browsing): the app keeps working, without saving.
  }
}

// ---------- Tasks ----------

// null = never saved (first launch): the app uses the example tasks.
export function loadTasks() {
  return validTasks(readJson(TASKS_KEY));
}

export function saveTasks(tasks) {
  writeJson(TASKS_KEY, tasks);
}

// ---------- Checked tasks, day by day ----------

export function loadDone() {
  return validDone(readJson(DONE_KEY));
}

export function saveDone(done) {
  writeJson(DONE_KEY, done);
}

// ---------- Settings: theme + music + volumes ----------

// The theme and the music are saved by their name ("Sky"): the rest is already in themes.js / sounds.js.
export function saveSettings(settings) {
  writeJson(SETTINGS_KEY, {
    themeName: settings.theme.name,
    musicName: settings.music.name,
    musicVolume: settings.musicVolume,
    soundVolume: settings.soundVolume,
  });
}

// Returns { themeName, musicName, musicVolume, soundVolume }, or null (first time, or not valid).
export function loadSettings() {
  return validSettings(readJson(SETTINGS_KEY));
}
