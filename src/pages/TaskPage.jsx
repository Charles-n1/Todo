import { useState } from 'react';
import AppText from '../components/AppText';
import BackButton from '../components/BackButton';
import MainButton from '../components/MainButton';
import ScrollView from '../components/ScrollView';
import { useTheme } from '../themes';
import { WEEK, WORK_DAYS, WEEKEND, SHORT_NAMES, shortDate } from '../logic/dates';
import { newId, withDate } from '../logic/tasks';
import { MAX_NAME } from '../logic/validate';

const RED = '#d63031';

// The quick choices under the days.
const PRESETS = [
  { label: 'Every day', days: WEEK },
  { label: 'Week days', days: WORK_DAYS },
  { label: 'Weekend', days: WEEKEND },
];

// Same days, in any order?
function sameDays(a, b) {
  return a.length === b.length && a.every((day) => b.includes(day));
}

// Add a task (task = null), or edit / remove / delete one.
// defaultDate: the day a one-time task starts on ("2026-10-15": the day shown on the home page).
// onSave(task): the new or changed task. onDelete(id). onBack: leave without saving.
export default function TaskPage({ task, todayKey, defaultDate, onSave, onDelete, onBack }) {
  const theme = useTheme();
  const isNew = task === null;
  const [name, setName] = useState(isNew ? '' : task.name);
  const [once, setOnce] = useState(!isNew && Boolean(task.date)); // true = a one-time task (a date, no days)
  const [days, setDays] = useState(isNew || task.date ? WEEK : task.days);
  const [date, setDate] = useState(isNew || !task.date ? defaultDate : task.date);
  // "Starts on": a new task starts today (the weeks before stay as they were). "" = on every day, the past too.
  const [startDate, setStartDate] = useState(isNew ? todayKey : task.addedFrom || '');
  const [removeDate, setRemoveDate] = useState(todayKey); // "remove from": today, unless another day is picked
  const [sureToDelete, setSureToDelete] = useState(false); // delete = 2 taps (no task lost by mistake)
  const canRemove = !isNew && !task.date; // only a repeating task (a one-time task is just deleted)
  const cleanName = name.trim();
  // Removed from a day: it must start before (or it would never be there).
  const startsTooLate = !once && !isNew && Boolean(task.removedFrom) && startDate >= task.removedFrom;
  const canSave = cleanName.length > 0 && (once ? date !== '' : days.length > 0 && !startsTooLate);

  function typeName(event) {
    setName(event.target.value);
  }

  // "Enter" on the keyboard = save.
  function pressKey(event) {
    if (event.key === 'Enter' && canSave) save();
  }

  // On -> off, off -> on. The days stay in the week order (Monday first).
  function toggleDay(day) {
    if (days.includes(day)) {
      setDays(days.filter((item) => item !== day));
    } else {
      setDays(WEEK.filter((item) => item === day || days.includes(item)));
    }
  }

  // The date field gives "" when it's emptied: then "save" is disabled.
  function pickDate(event) {
    setDate(event.target.value);
  }

  function choosePreset(presetDays) {
    setOnce(false);
    setDays(presetDays);
  }

  function save() {
    const id = isNew ? newId() : task.id;
    if (once) {
      onSave({ id: id, name: cleanName, date: date });
    } else {
      const repeating = withDate({ id: id, name: cleanName, days: days }, 'addedFrom', startDate);
      // Already removed from a day: it stays removed.
      onSave(withDate(repeating, 'removedFrom', isNew ? null : task.removedFrom));
    }
  }

  // Emptied ("") = no start: on every day, the past too.
  function pickStartDate(event) {
    setStartDate(event.target.value);
  }

  function pickRemoveDate(event) {
    setRemoveDate(event.target.value);
  }

  // Gone from that day on. The days before keep it, with what was checked: the history stays true.
  function removeFrom() {
    onSave(withDate(task, 'removedFrom', removeDate));
  }

  function bringBack() {
    onSave(withDate(task, 'removedFrom', null));
  }

  function pressDelete() {
    if (sureToDelete) {
      onDelete(task.id);
    } else {
      setSureToDelete(true);
    }
  }

  return (
    <div style={styles.page}>
      <ScrollView contentStyle={styles.content}>
        <AppText style={styles.title}>{isNew ? 'New task' : 'Edit task'}</AppText>

        <AppText style={styles.section}>Name</AppText>
        <input
          value={name}
          onChange={typeName}
          onKeyDown={pressKey}
          maxLength={MAX_NAME}
          placeholder="sport, anglais..."
          autoFocus={isNew}
          enterKeyHint="done"
          style={{ ...styles.input, backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
        />

        <AppText style={styles.section}>{once ? 'On' : 'Repeat on'}</AppText>
        {once && (
          <input
            type="date"
            value={date}
            onChange={pickDate}
            aria-label="date"
            style={{ ...styles.input, backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
          />
        )}
        {!once && (
          <div style={styles.days}>
            {WEEK.map((day) => {
              const on = days.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  aria-pressed={on}
                  style={{
                    ...styles.day,
                    borderColor: on ? theme.button : theme.border,
                    backgroundColor: on ? theme.button : theme.card,
                  }}
                >
                  <span style={{ ...styles.dayText, color: on ? theme.buttonText : theme.text }}>
                    {SHORT_NAMES[day]}
                  </span>
                </button>
              );
            })}
          </div>
        )}
        <div style={styles.presets}>
          {PRESETS.map((preset) => {
            const on = !once && sameDays(days, preset.days);
            return (
              <button
                key={preset.label}
                onClick={() => choosePreset(preset.days)}
                style={{
                  ...styles.preset,
                  borderColor: theme.border,
                  backgroundColor: on ? theme.border : 'transparent',
                }}
              >
                <span style={{ ...styles.presetText, color: on ? theme.card : theme.text }}>{preset.label}</span>
              </button>
            );
          })}
          {/* Only one day, no repeat */}
          <button
            onClick={() => setOnce(true)}
            style={{
              ...styles.preset,
              borderColor: theme.border,
              backgroundColor: once ? theme.border : 'transparent',
            }}
          >
            <span style={{ ...styles.presetText, color: once ? theme.card : theme.text }}>Once</span>
          </button>
        </div>
        {!once && days.length === 0 && <AppText style={styles.warning}>Choose at least one day.</AppText>}
        {once && date === '' && <AppText style={styles.warning}>Choose a date.</AppText>}

        {!once && (
          <>
            <AppText style={styles.section}>Starts on</AppText>
            <input
              type="date"
              value={startDate}
              onChange={pickStartDate}
              aria-label="starts on"
              style={{ ...styles.input, backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
            />
            <AppText style={styles.hint}>
              {startDate === ''
                ? 'No date: it is on the past days too.'
                : 'It appears from this day on. The days before stay as they were.'}
            </AppText>
            {startsTooLate && (
              <AppText style={styles.warning}>
                {'It is removed from ' + shortDate(task.removedFrom) + ': choose an earlier day.'}
              </AppText>
            )}
          </>
        )}

        <MainButton label={isNew ? 'Add the task' : 'Save'} onPress={save} disabled={!canSave} style={styles.save} />

        {canRemove && !task.removedFrom && (
          <>
            <AppText style={styles.section}>Remove from</AppText>
            <input
              type="date"
              value={removeDate}
              onChange={pickRemoveDate}
              aria-label="remove from"
              style={{ ...styles.input, backgroundColor: theme.card, borderColor: theme.border, color: theme.text }}
            />
            <AppText style={styles.hint}>
              It disappears from this day on. The days before keep it, with what you checked.
            </AppText>
            <button
              onClick={removeFrom}
              disabled={removeDate === ''}
              style={{ ...styles.remove, borderColor: theme.border, ...(removeDate === '' && styles.disabled) }}
            >
              <span style={{ ...styles.removeText, color: theme.text }}>
                {removeDate === '' ? 'Choose a date' : 'Remove from ' + shortDate(removeDate)}
              </span>
            </button>
          </>
        )}
        {canRemove && task.removedFrom && (
          <>
            <AppText style={styles.section}>Removed</AppText>
            <AppText style={styles.hint}>
              {'Gone since ' + shortDate(task.removedFrom) + '. The days before still have it.'}
            </AppText>
            <button onClick={bringBack} style={{ ...styles.remove, borderColor: theme.border }}>
              <span style={{ ...styles.removeText, color: theme.text }}>Bring it back</span>
            </button>
          </>
        )}

        {!isNew && (
          <button onClick={pressDelete} style={{ ...styles.delete, ...(sureToDelete && styles.deleteSure) }}>
            <span style={{ ...styles.deleteText, color: sureToDelete ? '#fff' : RED }}>
              {sureToDelete
                ? 'Tap again to delete'
                : canRemove
                  ? 'Delete everywhere (history too)'
                  : 'Delete this task'}
            </span>
          </button>
        )}
      </ScrollView>

      <BackButton onPress={onBack} />
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
  section: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 10,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 17, // 16px minimum: else the iPhone zooms in when typing
  },
  days: {
    flexDirection: 'row',
    gap: 5,
  },
  day: {
    flex: 1,
    height: 46,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap', // a small phone: the last chips go to the next line
    gap: 6,
    marginTop: 12,
  },
  preset: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 11,
    paddingRight: 11,
  },
  presetText: {
    fontSize: 14,
  },
  warning: {
    color: RED,
    marginTop: 10,
  },
  save: {
    marginTop: 32,
  },
  hint: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 8,
  },
  remove: {
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    marginTop: 12,
  },
  removeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.4,
  },
  delete: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: RED,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  deleteSure: {
    backgroundColor: RED,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
};
