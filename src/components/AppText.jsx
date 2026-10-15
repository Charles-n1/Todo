import { useTheme } from '../themes';

// A text that takes the text color of the current theme. (React Native: <Text>)
// pre-wrap: keeps the line breaks of the text, like React Native does.
export default function AppText({ style, children }) {
  const theme = useTheme();
  return <span style={{ color: theme.text, whiteSpace: 'pre-wrap', ...style }}>{children}</span>;
}
