import { useEffect } from 'react';

import { useTheme } from '../themes';

// A window on top of the page, on a dark veil, with a "Close" button at the bottom.
// A tap on the veil (outside the window) closes it. On a computer, Escape too.
export default function Modal({ onClose, children }) {
  const theme = useTheme();

  useEffect(listenEscape, [onClose]);

  function listenEscape() {
    function keyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', keyDown);
    return () => window.removeEventListener('keydown', keyDown);
  }

  return (
    // The window itself stops the tap (stopPropagation): only a tap on the veil closes.
    <div style={styles.veil} onClick={onClose}>
      <div style={{ ...styles.window, backgroundColor: theme.card, borderColor: theme.border }} onClick={(event) => event.stopPropagation()}>
        {children}

        <button onClick={onClose} className="press" style={{ ...styles.close, backgroundColor: theme.button }}>
          <span style={{ ...styles.closeText, color: theme.buttonText }}>Close</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  veil: {
    position: 'absolute',
    inset: 0,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  window: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '100%', // a long content scrolls inside, the window never leaves the screen
    borderRadius: 6,
    borderWidth: 2,
    padding: 16,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
  },
  close: {
    alignSelf: 'center',
    marginTop: 14,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 28,
    paddingRight: 28,
    borderRadius: 6,
  },
  closeText: {
    fontWeight: 'bold',
  },
};
