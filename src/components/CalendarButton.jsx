import { useTheme } from '../themes';

// The small round calendar, just left of the "+".
// Put it OUTSIDE the ScrollView: it stays in the corner, even when we scroll.
export default function CalendarButton({ onPress }) {
  const theme = useTheme();

  return (
    <button
      onClick={onPress}
      aria-label="calendar"
      className="press"
      style={{ ...styles.button, borderColor: theme.border, backgroundColor: theme.card }}
    >
      {/* A little calendar drawn with borders: the page, its top band and 2 rings */}
      <div style={{ ...styles.page, borderColor: theme.text }}>
        <div style={{ ...styles.band, backgroundColor: theme.text }} />
      </div>
      <div style={{ ...styles.ring, left: 17, backgroundColor: theme.text }} />
      <div style={{ ...styles.ring, right: 17, backgroundColor: theme.text }} />
    </button>
  );
}

const styles = {
  button: {
    position: 'absolute', // placed on top of the page, not in the flow
    right: 20 + 62 + 12, // the "+" is 62px wide, 20px from the edge, then a 12px gap
    bottom: 'calc(25px + env(safe-area-inset-bottom))', // its middle is at the height of the middle of the "+"
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
  },
  page: {
    width: 22,
    height: 20,
    marginTop: 3,
    borderWidth: 2.5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  band: {
    height: 4,
  },
  ring: {
    position: 'absolute',
    top: 11,
    width: 3,
    height: 6,
    borderRadius: 2,
  },
};
