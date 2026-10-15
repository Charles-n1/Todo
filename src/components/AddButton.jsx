import { useTheme } from '../themes';

// The round "+" in the bottom-right corner.
// Put it OUTSIDE the ScrollView: it stays in the corner, even when we scroll.
export default function AddButton({ onPress }) {
  const theme = useTheme();

  return (
    <button onClick={onPress} aria-label="add a task" className="press" style={{ ...styles.add, backgroundColor: theme.button }}>
      {/* A "+" made of 2 bars: always perfectly centered (a "+" letter isn't, in most fonts) */}
      <div style={{ ...styles.across, backgroundColor: theme.buttonText }} />
      <div style={{ ...styles.down, backgroundColor: theme.buttonText }} />
    </button>
  );
}

const styles = {
  add: {
    position: 'absolute', // placed on top of the page, not in the flow
    right: 20,
    bottom: 'calc(20px + env(safe-area-inset-bottom))', // iPhone: above the home bar
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
  },
  across: {
    position: 'absolute',
    width: 26,
    height: 4,
    borderRadius: 2,
  },
  down: {
    position: 'absolute',
    width: 4,
    height: 26,
    borderRadius: 2,
  },
};
