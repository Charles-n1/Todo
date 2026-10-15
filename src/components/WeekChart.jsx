import AppText from './AppText';
import { useTheme, DONE_GREEN } from '../themes';
import { SHORT_NAMES, FULL_NAMES, dateKey, fromKey, weekOf } from '../logic/dates';
import { tasksOn, isDone } from '../logic/tasks';

const BAR_AREA = 130; // the tallest bar, in pixels
const MAX_BLOCK = 24; // a block is never taller (with only 2 tasks, the bars don't become towers)

// For one day: how many tasks (= the height of the bar) and how many are done (= the green blocks).
function makeBar(date, tasks, done) {
  const key = dateKey(date);
  const dayTasks = tasksOn(tasks, date.getDay());
  return {
    key: key,
    label: SHORT_NAMES[date.getDay()],
    fullName: FULL_NAMES[date.getDay()],
    total: dayTasks.length,
    done: dayTasks.filter((task) => isDone(done, key, task.id)).length,
  };
}

function Bar({ bar, blockHeight, gap, isToday, isSelected, onSelect }) {
  const theme = useTheme();
  const complete = bar.total > 0 && bar.done === bar.total;

  function press() {
    onSelect(bar.key);
  }

  // One block per task, from the bottom: the done ones (green) first.
  const blocks = [];
  for (let index = 0; index < bar.total; index++) {
    const green = index < bar.done;
    blocks.push(
      <div
        // The key changes when the block turns green -> React makes a NEW block -> its "pop" animation plays.
        key={index + (green ? '-done' : '-todo')}
        className={green ? 'block block-done' : 'block'}
        style={{
          ...styles.block,
          height: blockHeight,
          backgroundColor: green ? DONE_GREEN : theme.border,
          opacity: green ? 1 : 0.28,
        }}
      />,
    );
  }

  return (
    <button onClick={press} style={styles.column} aria-label={bar.fullName + ': ' + bar.done + ' of ' + bar.total + ' done'}>
      {/* The bottom borders of the 7 columns touch each other: they make the line of the chart */}
      <div style={{ ...styles.area, borderColor: theme.border }}>
        <AppText style={{ ...styles.count, ...(complete && { color: DONE_GREEN }) }}>
          {bar.total > 0 ? bar.done + '/' + bar.total : ''}
        </AppText>
        <div style={{ ...styles.bar, gap: gap }}>{blocks}</div>
      </div>
      <span
        style={{
          ...styles.label,
          color: isSelected ? theme.buttonText : theme.text,
          backgroundColor: isSelected ? theme.button : 'transparent',
          fontWeight: isToday ? 'bold' : 'normal',
        }}
      >
        {bar.label}
      </span>
      {/* The little dot under today */}
      <div style={{ ...styles.todayDot, backgroundColor: isToday ? theme.text : 'transparent' }} />
    </button>
  );
}

// The 7 days of this week (Monday -> Sunday). A click on a day shows its tasks under the chart.
export default function WeekChart({ tasks, done, todayKey, selectedKey, onSelect }) {
  const bars = weekOf(fromKey(todayKey)).map((date) => makeBar(date, tasks, done));
  const biggest = Math.max(1, ...bars.map((bar) => bar.total));
  const gap = biggest > 12 ? 1 : 3; // lots of tasks: thinner gaps, so the blocks stay visible
  const blockHeight = Math.min(MAX_BLOCK, (BAR_AREA - gap * (biggest - 1)) / biggest);

  return (
    <div style={styles.chart}>
      {bars.map((bar) => (
        <Bar
          key={bar.key}
          bar={bar}
          blockHeight={blockHeight}
          gap={gap}
          isToday={bar.key === todayKey}
          isSelected={bar.key === selectedKey}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

const styles = {
  chart: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  area: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end', // the bars stand on the line
    height: BAR_AREA + 22, // + the room for the count above the tallest bar
    borderBottomWidth: 2,
  },
  count: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bar: {
    flexDirection: 'column-reverse', // the first block is at the bottom
  },
  block: {
    width: 26,
    borderRadius: 5,
  },
  label: {
    fontSize: 13,
    marginTop: 8,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 7,
    paddingRight: 7,
    borderRadius: 10,
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 3,
  },
};
