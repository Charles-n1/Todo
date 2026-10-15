import { useState, useEffect } from 'react';

import HomePage from './pages/HomePage';
import SettingsPage from './pages/SettingsPage';
import TaskPage from './pages/TaskPage';
import { THEMES, ThemeContext } from './themes';
import { MUSICS, startAudio } from './sounds';
import { MAX_APP_WIDTH } from './screen';
import { DEFAULT_TASKS } from './data/defaultTasks';
import { toggleDone } from './logic/tasks';
import { useToday } from './logic/useToday';
import { loadTasks, saveTasks, loadDone, saveDone, loadSettings, saveSettings } from './logic/storage';

const DEFAULT_SETTINGS = {
  theme: THEMES[0], // Old paper
  music: MUSICS[0],
  musicVolume: 0.3, // quieter, so we still hear the sounds
  soundVolume: 1,
};

// Reads every save, ONCE, when the app opens. (On the web, reading is instant.)
function loadEverything() {
  const settings = loadSettings(); // null the very first time

  return {
    tasks: loadTasks() || DEFAULT_TASKS, // null = first launch: the example tasks
    done: loadDone(),
    settings: settings
      ? {
          theme: THEMES.find((item) => item.name === settings.themeName) || THEMES[0],
          music: MUSICS.find((item) => item.name === settings.musicName) || MUSICS[0],
          musicVolume: settings.musicVolume,
          soundVolume: settings.soundVolume,
        }
      : DEFAULT_SETTINGS,
  };
}

export default function App() {
  // useState(function): the function runs only the first time -> we read the saves only once.
  const [saved] = useState(loadEverything);
  const [page, setPage] = useState('home'); // 'home' | 'settings' | 'task'
  const [slide, setSlide] = useState(''); // swipe direction: 'from-right' | 'from-left'
  const [tasks, setTasks] = useState(saved.tasks); // [{ id, name, days }, ...]
  const [done, setDone] = useState(saved.done); // { "2026-10-15": ["sport", ...], ... }
  const [settings, setSettings] = useState(saved.settings);
  const [editedTask, setEditedTask] = useState(null); // the task open in the task page (null = a new one)
  const [chosenDay, setChosenDay] = useState(null); // the day clicked on the chart. null = today
  const todayKey = useToday(); // "2026-10-15"
  const selectedKey = chosenDay || todayKey;
  const theme = settings.theme;

  // [] = run only once, when the app opens.
  useEffect(startApp, []);

  function startApp() {
    startAudio(saved.settings);
  }

  // Each time something changes: save it.
  useEffect(tasksChanged, [tasks]);
  useEffect(doneChanged, [done]);
  useEffect(settingsChanged, [settings]);

  function tasksChanged() {
    saveTasks(tasks);
  }

  function doneChanged() {
    saveDone(done);
  }

  function settingsChanged() {
    saveSettings(settings);
    // The color of the iPhone's top bar (and of the sides, on a computer) follows the theme.
    document.querySelector('meta[name=theme-color]').setAttribute('content', theme.background);
    document.documentElement.style.backgroundColor = theme.background;
  }

  // After midnight, the list goes back to today (the new today).
  useEffect(newDay, [todayKey]);

  function newDay() {
    setChosenDay(null);
  }

  function goTo(newPage) {
    if (newPage === page) return;
    // Opening a page -> it comes from the right. Back home -> from the left.
    setSlide(newPage === 'home' ? 'from-left' : 'from-right');
    setPage(newPage);
  }

  function goHome() {
    goTo('home');
  }

  function openSettings() {
    goTo('settings');
  }

  function openNewTask() {
    setEditedTask(null);
    goTo('task');
  }

  function openTask(task) {
    setEditedTask(task);
    goTo('task');
  }

  // A new task goes at the end of the list. A changed one stays at its place.
  function saveTask(task) {
    setTasks((list) =>
      list.some((item) => item.id === task.id) ? list.map((item) => (item.id === task.id ? task : item)) : [...list, task],
    );
    goHome();
  }

  function deleteTask(id) {
    setTasks((list) => list.filter((item) => item.id !== id));
    goHome();
  }

  function toggleTask(dayKey, taskId) {
    setDone((old) => toggleDone(old, dayKey, taskId));
  }

  // Change one setting, keep the others: changeSetting('theme', THEMES[1])
  function changeSetting(key, value) {
    setSettings((old) => ({ ...old, [key]: value }));
  }

  function renderPage() {
    if (page === 'settings') return (
        <SettingsPage settings={settings} changeSetting={changeSetting} tasks={tasks} onEditTask={openTask} onBack={goHome} />
      );
    if (page === 'task') return <TaskPage task={editedTask} onSave={saveTask} onDelete={deleteTask} onBack={goHome} />;
    return (
      <HomePage
        tasks={tasks}
        done={done}
        todayKey={todayKey}
        selectedKey={selectedKey}
        onSelectDay={setChosenDay}
        onToggle={toggleTask}
        onAdd={openNewTask}
        onEdit={openTask}
        onOpenSettings={openSettings}
      />
    );
  }

  return (
    // Every component inside can read the theme with useTheme()
    <ThemeContext value={theme}>
      <div style={{ ...styles.app, backgroundColor: theme.background }}>
        {/* The texture of the theme (the grain of the old paper), on top of the color */}
        {theme.texture && <div style={{ ...styles.texture, backgroundImage: theme.texture }} />}

        <div style={styles.content}>
          {/* key={page}: a new page = a new div -> the swipe animation plays again */}
          <div key={page} className={'page ' + slide}>
            {renderPage()}
          </div>
        </div>
      </div>
    </ThemeContext>
  );
}

const styles = {
  app: {
    width: '100%', // without it, "margin: auto" would shrink the app to the size of its content
    height: '100%',
    maxWidth: MAX_APP_WIDTH, // on a computer: phone-sized, in the middle
    margin: '0 auto',
    paddingTop: 'env(safe-area-inset-top)', // iPhone: under the notch
    overflow: 'hidden',
  },
  texture: {
    position: 'absolute',
    inset: 0,
    backgroundSize: '100% 100%, 240px 240px', // the darker edges: the whole screen. The grain: repeated tiles.
    pointerEvents: 'none',
  },
  content: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
};
