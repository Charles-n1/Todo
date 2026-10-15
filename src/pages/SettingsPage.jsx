import { useState } from 'react';
import AppText from '../components/AppText';
import AnswerButton from '../components/AnswerButton';
import BackButton from '../components/BackButton';
import MainButton from '../components/MainButton';
import PercentSlider from '../components/PercentSlider';
import ScrollView from '../components/ScrollView';
import TasksModal from '../components/TasksModal';
import { THEMES } from '../themes';
import { MUSICS, playMusic, playSound, setMusicVolume, setSoundVolume } from '../sounds';

const THEMES_SHOWN = 4; // themes visible before "see more theme"

export default function SettingsPage({ settings, changeSetting, tasks, onEditTask, onBack }) {
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const visibleThemes = showAllThemes ? THEMES : THEMES.slice(0, THEMES_SHOWN);

  function toggleThemes() {
    setShowAllThemes(!showAllThemes);
  }

  function chooseMusic(music) {
    playMusic(music);
    changeSetting('music', music);
  }

  function changeMusicVolume(volume) {
    setMusicVolume(volume);
    changeSetting('musicVolume', volume);
  }

  function changeSoundVolume(volume) {
    setSoundVolume(volume);
    changeSetting('soundVolume', volume);
  }

  function previewSound() {
    playSound('success');
  }

  return (
    <div style={styles.page}>
      <ScrollView contentStyle={styles.content}>
        <AppText style={styles.title}>Parameters</AppText>

        <AppText style={styles.section}>Tasks</AppText>
        <MainButton label="Manage my tasks" onPress={() => setTasksOpen(true)} style={styles.manage} />

        <AppText style={styles.section}>Music</AppText>
        <PercentSlider label="Volume" value={settings.musicVolume} onChange={changeMusicVolume} />
        {MUSICS.map((item) => (
          <AnswerButton
            key={item.name}
            label={item.name}
            look={item === settings.music ? 'selected' : 'normal'}
            onPress={() => chooseMusic(item)}
          />
        ))}

        <AppText style={styles.section}>Sounds</AppText>
        {/* When the finger is lifted, play a sound to hear the new volume */}
        <PercentSlider
          label="Volume"
          value={settings.soundVolume}
          onChange={changeSoundVolume}
          onRelease={previewSound}
        />

        <AppText style={styles.section}>Theme: {settings.theme.name}</AppText>
        {visibleThemes.map((item) => (
          <AnswerButton
            key={item.name}
            label={item.name}
            look={item === settings.theme ? 'selected' : 'normal'}
            onPress={() => changeSetting('theme', item)}
          />
        ))}
        <button onClick={toggleThemes}>
          <AppText style={styles.link}>{showAllThemes ? 'click to see less themes' : 'click to see more themes'}</AppText>
        </button>
      </ScrollView>

      <BackButton onPress={onBack} />

      {tasksOpen && <TasksModal tasks={tasks} onEdit={onEditTask} onClose={() => setTasksOpen(false)} />}
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    minHeight: 0, // allowed to be smaller than its content -> it scrolls (instead of the page growing)
  },
  content: {
    padding: 20,
    paddingBottom: 'calc(90px + env(safe-area-inset-bottom))', // room under the last button: the "<" doesn't hide it
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  manage: {
    marginTop: 0,
    borderRadius: 6,
  },
  link: {
    textDecoration: 'underline',
    marginTop: 4,
  },
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
  },
};
