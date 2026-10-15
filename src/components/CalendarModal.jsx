import { useState } from 'react';

import AppText from './AppText';
import Modal from './Modal';
import { useTheme } from '../themes';
import { SHORT_NAMES, WEEK, dateKey, fromKey } from '../logic/dates';
import { tasksOn, isDone } from '../logic/tasks';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// The rainbow of a day: nothing done = no color, then red = 1 task done ... blue = everything done.
const RAINBOW = ['#e53935', '#fb8c00', '#fdd835', '#2e9e4f', '#007FFF'];

// "#fb8c00" -> [251, 140, 0]
function toRgb(hex) {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
}

// A color taken along the rainbow: 0 = red ... 1 = blue. Between two colors, they are mixed.
function rainbowColor(part) {
  const position = part * (RAINBOW.length - 1);
  const index = Math.min(Math.floor(position), RAINBOW.length - 2);
  const mix = position - index;
  const from = toRgb(RAINBOW[index]);
  const to = toRgb(RAINBOW[index + 1]);
  const rgb = from.map((value, channel) => Math.round(value + (to[channel] - value) * mix));
  return 'rgb(' + rgb.join(', ') + ')';
}

// The color of a day. Nothing done = transparent. Then 1 done = red ... all done = blue.
// A day with 5 tasks has 5 colors: 1/5 = red, 2/5 = orange, 3/5 = yellow, 4/5 = green, 5/5 = blue.
// With another number of tasks, the colors in between are mixed. Only 1 task: done = blue.
function dayColor(doneCount, total) {
  if (doneCount === 0) return 'transparent';
  if (total === 1) return rainbowColor(1);
  return rainbowColor((doneCount - 1) / (total - 1));
}

// The days to draw for a month: empty boxes before the 1st (so the 1st falls under its weekday), then every day.
function monthCells(year, month) {
  const first = new Date(year, month, 1);
  const before = (first.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6
  const count = new Date(year, month + 1, 0).getDate(); // day 0 of the next month = the last day of this one
  const cells = [];
  for (let index = 0; index < before; index++) cells.push(null);
  for (let day = 1; day <= count; day++) cells.push(new Date(year, month, day));
  return cells;
}

// The window with the calendar of a month. Each day: its number, then a box colored by the tasks done.
// A tap on a day shows its tasks (onSelect).
export default function CalendarModal({ tasks, done, todayKey, selectedKey, onSelect, onClose }) {
  const theme = useTheme();
  const start = fromKey(selectedKey);
  const [year, setYear] = useState(start.getFullYear());
  const [month, setMonth] = useState(start.getMonth()); // 0 = January

  // month -1 / +1. new Date() fixes "month 12" into January of the next year.
  function changeMonth(step) {
    const date = new Date(year, month + step, 1);
    setYear(date.getFullYear());
    setMonth(date.getMonth());
  }

  function renderDay(date, index) {
    if (!date) return <div key={'empty' + index} style={styles.cell} />;

    const key = dateKey(date);
    const dayTasks = tasksOn(tasks, date.getDay());
    const doneCount = dayTasks.filter((task) => isDone(done, key, task.id)).length;
    const isToday = key === todayKey;
    const future = key > todayKey;
    const colored = !future && dayTasks.length > 0; // no color: a day still to come, or a rest day

    return (
      <div key={key} style={styles.cell}>
        <button
          onClick={() => onSelect(key)}
          aria-label={date.getDate() + ' ' + MONTH_NAMES[month] + ': ' + doneCount + ' of ' + dayTasks.length + ' done'}
          className="press"
          style={styles.day}
        >
          <AppText style={{ ...styles.number, fontWeight: isToday || key === selectedKey ? 'bold' : 'normal' }}>
            {date.getDate()}
          </AppText>
          <div
            style={{
              ...styles.box,
              borderColor: isToday ? theme.text : theme.border,
              borderWidth: isToday ? 2.5 : 1,
              backgroundColor: colored ? dayColor(doneCount, dayTasks.length) : 'transparent',
              opacity: colored || isToday ? 1 : 0.35,
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <Modal onClose={onClose}>
      <div style={styles.header}>
        <button onClick={() => changeMonth(-1)} aria-label="previous month" className="press" style={styles.arrowButton}>
          <div style={{ ...styles.arrow, borderColor: theme.text, transform: 'rotate(45deg)', marginLeft: 5 }} />
        </button>
        <AppText style={styles.title}>{MONTH_NAMES[month] + ' ' + year}</AppText>
        <button onClick={() => changeMonth(1)} aria-label="next month" className="press" style={styles.arrowButton}>
          <div style={{ ...styles.arrow, borderColor: theme.text, transform: 'rotate(-135deg)', marginRight: 5 }} />
        </button>
      </div>

      <div style={styles.grid}>
        {WEEK.map((weekDay) => (
          <div key={weekDay} style={styles.cell}>
            <AppText style={styles.weekDay}>{SHORT_NAMES[weekDay]}</AppText>
          </div>
        ))}
        {monthCells(year, month).map(renderDay)}
      </div>

      {/* The legend: from nothing done to everything done */}
      <div style={styles.legend}>
        <AppText style={styles.legendText}>Nothing</AppText>
        <div style={{ ...styles.legendBox, borderColor: theme.border }} />
        {[0, 0.25, 0.5, 0.75, 1].map((part) => (
          <div key={part} style={{ ...styles.legendBox, borderColor: theme.border, backgroundColor: rainbowColor(part) }} />
        ))}
        <AppText style={styles.legendText}>All done</AppText>
      </div>
    </Modal>
  );
}

const styles = {
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrowButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    width: 12,
    height: 12,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: 'calc(100% / 7)', // 7 days per line
    padding: 3,
    alignItems: 'center',
  },
  weekDay: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  day: {
    width: '100%',
    alignItems: 'center',
  },
  number: {
    fontSize: 13,
    marginBottom: 3,
  },
  box: {
    width: '70%',
    maxWidth: 34,
    aspectRatio: '1', // a square, whatever the width of the screen
    borderRadius: 3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 12,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 12,
    marginLeft: 3,
    marginRight: 3,
  },
};
