import AppText from './AppText';
import Modal from './Modal';
import { useTheme } from '../themes';
import { SHORT_NAMES, WEEK } from '../logic/dates';

// The window with every task, and the days each one repeats. A tap on a task opens it, to change it (onEdit).
export default function TasksModal({ tasks, onEdit, onClose }) {
  const theme = useTheme();

  return (
    <Modal onClose={onClose}>
      <AppText style={styles.title}>{'My tasks (' + tasks.length + ')'}</AppText>

      <div style={styles.list}>
        {tasks.length === 0 && <AppText style={styles.hint}>No task yet. Add one with the "+".</AppText>}
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onEdit(task)}
            aria-label={'edit ' + task.name}
            className="press"
            style={{ ...styles.task, borderColor: theme.border }}
          >
            <AppText style={styles.name}>{task.name}</AppText>
            {/* The 7 days, Monday first: filled = the task repeats that day */}
            <div style={styles.days}>
              {WEEK.map((weekDay) => {
                const on = task.days.includes(weekDay);
                return (
                  <span
                    key={weekDay}
                    style={{
                      ...styles.day,
                      borderColor: theme.border,
                      backgroundColor: on ? theme.button : 'transparent',
                      color: on ? theme.buttonText : theme.text,
                      opacity: on ? 1 : 0.4,
                    }}
                  >
                    {SHORT_NAMES[weekDay][0]}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

const styles = {
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  list: {
    flexShrink: 1, // a long list gets smaller than its content...
    minHeight: 0,
    overflowY: 'auto', // ...and scrolls inside the window
    gap: 8,
  },
  hint: {
    opacity: 0.6,
    textAlign: 'center',
  },
  task: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  days: {
    flexDirection: 'row',
    gap: 4,
  },
  day: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 12,
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
