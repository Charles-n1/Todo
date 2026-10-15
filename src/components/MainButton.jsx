import { useTheme } from '../themes';

// The big full-color button (Submit, Next, Start, Retrieve...).
// style (optional): extra style, to change the size or position.
export default function MainButton({ label, onPress, disabled, style }) {
  const theme = useTheme();

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{ ...styles.button, backgroundColor: theme.button, ...(disabled && styles.disabled), ...style }}
    >
      <span style={{ ...styles.text, color: theme.buttonText }}>{label}</span>
    </button>
  );
}

const styles = {
  button: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 16,
  },
  disabled: {
    opacity: 0.3,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
};
