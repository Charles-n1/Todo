import { useState, useRef } from 'react';
import { useTheme, DONE_GREEN } from '../themes';

const CHECKED_FILL = 'rgba(46, 158, 79, 0.14)'; // a light green inside the checked box

// One task of the list: [ box ] name [ ... ]
// checked: done on the day shown. locked: a day in the future (it can't be checked yet).
// onToggle(box): the box or the name was clicked (box = the box element: the confetti start from it).
// onEdit: the "..." was clicked.
export default function TaskRow({ task, checked, locked, onToggle, onEdit }) {
  const theme = useTheme();
  const box = useRef(null);
  // true = the user JUST checked it: the animations play.
  // (Not when the page opens on a task that was already checked.)
  const [justChecked, setJustChecked] = useState(false);

  function toggle() {
    setJustChecked(!checked);
    onToggle(box.current);
  }

  return (
    <div style={{ ...styles.row, backgroundColor: theme.card, borderColor: theme.border }}>
      <button onClick={toggle} disabled={locked} role="checkbox" aria-checked={checked} style={styles.toggle}>
        <div
          ref={box}
          className={'todo-box' + (justChecked ? ' pop' : '')}
          style={{
            ...styles.box,
            borderColor: checked ? DONE_GREEN : theme.border,
            backgroundColor: checked ? CHECKED_FILL : 'transparent',
            opacity: locked ? 0.35 : 1,
          }}
        >
          {/* The green V, drawn as a line (it can "draw itself", see .check-mark in index.css) */}
          {checked && (
            <svg viewBox="0 0 24 24" style={styles.check}>
              <polyline className="check-mark" points="5 12.5 10 17.5 19 7" />
            </svg>
          )}
        </div>
        <span style={styles.nameBox}>
          <span style={{ ...styles.name, color: theme.text, opacity: checked ? 0.5 : 1 }}>
            {task.name}
            {checked && <span className={justChecked ? 'strike draw' : 'strike'} style={{ backgroundColor: theme.text }} />}
          </span>
        </span>
      </button>

      <button onClick={onEdit} aria-label={'edit ' + task.name} style={styles.edit}>
        <div style={styles.dots}>
          <div style={{ ...styles.dot, backgroundColor: theme.text }} />
          <div style={{ ...styles.dot, backgroundColor: theme.text }} />
          <div style={{ ...styles.dot, backgroundColor: theme.text }} />
        </div>
      </button>
    </div>
  );
}

const styles = {
  row: {
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 10,
  },
  toggle: {
    flex: 1,
    minWidth: 0, // a long name is cut with "...", it doesn't push the "..." button out
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 14,
  },
  box: {
    width: 30,
    height: 30,
    borderWidth: 2.5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  check: {
    width: 24,
    height: 24,
    overflow: 'visible',
  },
  nameBox: {
    display: 'flex',
    flex: 1,
    minWidth: 0,
  },
  name: {
    position: 'relative', // the strike line is placed on it
    maxWidth: '100%',
    fontSize: 17,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'opacity 0.3s',
  },
  edit: {
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 3,
    opacity: 0.6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
};
