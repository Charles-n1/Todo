import { useState } from 'react';
import AppText from '../components/AppText';
import BackButton from '../components/BackButton';
import MainButton from '../components/MainButton';
import ScrollView from '../components/ScrollView';
import { useTheme } from '../themes';
import { WEEK, WORK_DAYS, WEEKEND, SHORT_NAMES } from '../logic/dates';
import { newId } from '../logic/tasks';
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

// Add a task (task = null), or edit / delete one.
// onSave(task): the new or changed task. onDelete(id). onBack: leave without saving.
export default function TaskPage({ task, onSave, onDelete, onBack }) {
  const theme = useTheme();
  const isNew = task === null;
  const [name, setName] = useState(isNew ? '' : task.name);
  const [days, setDays] = useState(isNew ? WEEK : task.days);
  const [sureToDelete, setSureToDelete] = useState(false); // delete = 2 taps (no task lost by mistake)
  const cleanName = name.trim();
  const canSave = cleanName.length > 0 && days.length > 0;

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

  function save() {
    onSave({ id: isNew ? newId() : task.id, name: cleanName, days: days });
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

        <AppText style={styles.section}>Repeat on</AppText>
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
                <span style={{ ...styles.dayText, color: on ? theme.buttonText : theme.text }}>{SHORT_NAMES[day]}</span>
              </button>
            );
          })}
        </div>
        <div style={styles.presets}>
          {PRESETS.map((preset) => {
            const on = sameDays(days, preset.days);
            return (
              <button
                key={preset.label}
                onClick={() => setDays(preset.days)}
                style={{ ...styles.preset, borderColor: theme.border, backgroundColor: on ? theme.border : 'transparent' }}
              >
                <span style={{ ...styles.presetText, color: on ? theme.card : theme.text }}>{preset.label}</span>
              </button>
            );
          })}
        </div>
        {days.length === 0 && <AppText style={styles.warning}>Choose at least one day.</AppText>}

        <MainButton label={isNew ? 'Add the task' : 'Save'} onPress={save} disabled={!canSave} style={styles.save} />

        {!isNew && (
          <button onClick={pressDelete} style={{ ...styles.delete, ...(sureToDelete && styles.deleteSure) }}>
            <span style={{ ...styles.deleteText, color: sureToDelete ? '#fff' : RED }}>
              {sureToDelete ? 'Tap again to delete' : 'Delete this task'}
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
    gap: 8,
    marginTop: 12,
  },
  preset: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 12,
    paddingRight: 12,
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
