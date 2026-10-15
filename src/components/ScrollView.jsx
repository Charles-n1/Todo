// A zone that scrolls. (React Native: <ScrollView contentContainerStyle={...}>)
// ref (optional): to scroll it from the code -> ref.current.scrollTo({ top: 200, behavior: 'smooth' })
export default function ScrollView({ contentStyle, children, ref }) {
  return (
    <div ref={ref} style={styles.scroll}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}

const styles = {
  scroll: {
    flex: 1,
    minHeight: 0, // allowed to be smaller than its content -> it scrolls
    overflowY: 'auto',
  },
};
