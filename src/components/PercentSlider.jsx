import AppText from './AppText';
import { useTheme } from '../themes';

// A bar with a point you drag. value: from 0 to 1, shown as a %. (React Native: <Slider>)
export default function PercentSlider({ label, value, onChange, onRelease }) {
  const theme = useTheme();

  function slide(event) {
    onChange(Number(event.target.value)); // the input gives text: "0.42" -> 0.42
  }

  return (
    <div style={styles.box}>
      <AppText style={styles.label}>
        {label}: {Math.round(value * 100)}%
      </AppText>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={slide} // while dragging
        onPointerUp={onRelease} // when the finger is lifted
        style={{ ...styles.slider, accentColor: theme.button }}
      />
    </div>
  );
}

const styles = {
  box: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
};
