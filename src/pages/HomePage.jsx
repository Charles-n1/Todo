import { useState } from 'react';

import AppText from '../components/AppText';
import Icon from '../components/Icon';
import ScrollView from '../components/ScrollView';
import WeekChart from '../components/WeekChart';
import TaskRow from '../components/TaskRow';
import AddButton from '../components/AddButton';
import CalendarButton from '../components/CalendarButton';
import CalendarModal from '../components/CalendarModal';
import { useTheme, DONE_GREEN } from '../themes';
import { FULL_NAMES, addDays, dateKey, fromKey } from '../logic/dates';
import { tasksOn, isDone } from '../logic/tasks';
import { celebrate } from '../logic/celebrate';
import settingsIcon from '../assets/Logos/engrenage.png';

// "Today", "Yesterday", "Tomorrow", or the name of the day ("Saturday").
function dayTitle(dayKey, todayKey) {
  const todayDate = fromKey(todayKey);
  if (dayKey === todayKey) return 'Today';
  if (dayKey === dateKey(addDays(todayDate, -1))) return 'Yesterday';
  if (dayKey === dateKey(addDays(todayDate, 1))) return 'Tomorrow';
  return FULL_NAMES[fromKey(dayKey).getDay()];
}

// The main page: the title, the chart of the week, and the tasks of the selected day.
// selectedKey: the day shown in the list ("2026-10-15"). onToggle(dayKey, taskId): check / uncheck.
export default function HomePage({ tasks, done, todayKey, selectedKey, onSelectDay, onToggle, onAdd, onEdit, onOpenSettings }) {
  const theme = useTheme();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const weekDay = fromKey(selectedKey).getDay();
  const dayTasks = tasksOn(tasks, weekDay);
  const doneCount = dayTasks.filter((task) => isDone(done, selectedKey, task.id)).length;
  const allDone = dayTasks.length > 0 && doneCount === dayTasks.length;
  const future = selectedKey > todayKey; // the keys sort like the dates

  function toggle(task, box) {
    const checking = !isDone(done, selectedKey, task.id);
    onToggle(selectedKey, task.id);
    if (checking) celebrate(box, doneCount + 1 === dayTasks.length);
  }

  // A day tapped in the calendar: show its tasks, close the calendar.
  function selectFromCalendar(dayKey) {
    onSelectDay(dayKey);
    setCalendarOpen(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <AppText style={styles.title}>todo</AppText>
        <button onClick={onOpenSettings} aria-label="parameters" className="press" style={styles.settings}>
          <Icon src={settingsIcon} color={theme.text} size={34} />
        </button>
      </div>

      <div style={styles.chart}>
        <WeekChart tasks={tasks} done={done} todayKey={todayKey} selectedKey={selectedKey} onSelect={onSelectDay} />
      </div>

      <div style={styles.listHeader}>
        <AppText style={styles.day}>{dayTitle(selectedKey, todayKey)}</AppText>
        {dayTasks.length > 0 && (
          <AppText style={{ ...styles.progress, ...(allDone && { color: DONE_GREEN }) }}>
            {allDone ? 'All done! 🎉' : doneCount + ' / ' + dayTasks.length}
          </AppText>
        )}
      </div>

      <ScrollView contentStyle={styles.list}>
        {future && dayTasks.length > 0 && (
          <AppText style={styles.hint}>You can check these on {FULL_NAMES[weekDay]}.</AppText>
        )}
        {dayTasks.map((task) => (
          <TaskRow
            // Another day = new rows: the animation of one day never plays again on another day.
            key={selectedKey + task.id}
            task={task}
            checked={isDone(done, selectedKey, task.id)}
            locked={future}
            onToggle={(box) => toggle(task, box)}
            onEdit={() => onEdit(task)}
          />
        ))}
        {dayTasks.length === 0 && (
          <AppText style={styles.hint}>Nothing planned on {FULL_NAMES[weekDay]}. Rest day 😌</AppText>
        )}
      </ScrollView>

      <CalendarButton onPress={() => setCalendarOpen(true)} />
      <AddButton onPress={onAdd} />

      {calendarOpen && (
        <CalendarModal
          tasks={tasks}
          done={done}
          todayKey={todayKey}
          selectedKey={selectedKey}
          onSelect={selectFromCalendar}
          onClose={() => setCalendarOpen(false)}
        />
      )}
    </div>
  );
}

const styles = {
  page: {
    flex: 1,
    minHeight: 0, // allowed to be smaller than its content -> the list scrolls (instead of the page growing)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingLeft: 20,
    paddingRight: 10,
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    letterSpacing: -1,
  },
  settings: {
    padding: 10, // a bigger zone to tap than the icon
  },
  chart: {
    marginTop: 4, // no padding on the sides: each week of the chart has its own (see WeekChart)
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  day: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  progress: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 'calc(100px + env(safe-area-inset-bottom))', // room under the last task: the "+" doesn't hide it
  },
  hint: {
    opacity: 0.6,
    marginBottom: 12,
  },
};
