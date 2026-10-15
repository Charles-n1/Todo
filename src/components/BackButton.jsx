import { useTheme } from '../themes';

// The round "<" in the bottom-left corner.
// Put it OUTSIDE the ScrollView: it stays in the corner, even when we scroll.
export default function BackButton({ onPress }) {
  const theme = useTheme();

  return (
    <button
      onClick={onPress}
      aria-label="back"
      style={{ ...styles.back, borderColor: theme.border, backgroundColor: theme.card }}
    >
      {/* A "<" drawn with 2 borders of a rotated square: always perfectly centered */}
      <div style={{ ...styles.arrow, borderColor: theme.text }} />
    </button>
  );
}

const styles = {
  back: {
    position: 'absolute', // placed on top of the page, not in the flow
    left: 16,
    bottom: 'calc(16px + env(safe-area-inset-bottom))', // no footer here: stay above the iPhone's home bar
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 14,
    height: 14,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    marginLeft: 5, // the tip is on the left, so we push it a bit to look centered
    transform: 'rotate(45deg)',
  },
};
