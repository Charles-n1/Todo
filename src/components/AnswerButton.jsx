import { useTheme } from '../themes';

const GOOD = '#2e9e4f';
const BAD = '#d63031';

// look: 'normal' | 'selected' | 'good' | 'bad'
function colorsFor(look, theme) {
  if (look === 'selected') return { background: theme.button, border: theme.button, text: theme.buttonText };
  if (look === 'good') return { background: GOOD, border: GOOD, text: '#fff' };
  if (look === 'bad') return { background: BAD, border: BAD, text: '#fff' };
  return { background: theme.card, border: theme.border, text: theme.text };
}

export default function AnswerButton({ label, look, onPress, disabled }) {
  const theme = useTheme();
  const colors = colorsFor(look, theme);

  return (
    <button
      onClick={onPress}
      disabled={disabled}
      style={{ ...styles.button, backgroundColor: colors.background, borderColor: colors.border }}
    >
      <span style={{ ...styles.text, color: colors.text }}>{label}</span>
    </button>
  );
}

const styles = {
  button: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
  },
};
