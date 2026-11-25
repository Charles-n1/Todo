import { fromKey } from './dates';

// A task: { id: "lq2x8k-4fj2a", name: "sport", days: [1, 3, 5] } (the days it repeats, see dates.js),
// or a one-time task: { id: "lq2x9a-8dk3e", name: "dentist", date: "2026-10-30" } (only that day).
// A repeating task can start on a day: addedFrom: "2026-11-25" -> not there on the days before.
// And be removed from a day on: removedFrom: "2026-11-23" -> gone from that day,
// but still there on the days before (with what was checked). Either way, the history stays true.
// done: { "2026-10-15": ["sport", "anglais"], ... } = the ids of the tasks checked, day by day.

// A new unique id: the time + a few random letters.
// (Not crypto.randomUUID(): it doesn't exist on http://, when testing on the phone from the PC.)
export function newId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// The tasks planned on that day ("2026-10-15"), in the list order.
export function tasksOn(tasks, dayKey) {
  const weekDay = fromKey(dayKey).getDay(); // 0 = Sunday ... 6 = Saturday
  return tasks.filter((task) => {
    if (task.date) return task.date === dayKey;
    if (task.addedFrom && dayKey < task.addedFrom) return false; // the keys sort like the dates
    if (task.removedFrom && dayKey >= task.removedFrom) return false;
    return task.days.includes(weekDay);
  });
}

// The task with one of its dates set or taken away: withDate(task, 'removedFrom', "2026-11-23"),
// withDate(task, 'addedFrom', null). field: 'addedFrom' | 'removedFrom'. No date ("" or null) = no limit.
export function withDate(task, field, dayKey) {
  const result = { ...task };
  if (dayKey) {
    result[field] = dayKey;
  } else {
    delete result[field];
  }
  return result;
}

export function isDone(done, dayKey, taskId) {
  return (done[dayKey] || []).includes(taskId);
}

// Checked -> unchecked, unchecked -> checked.
// Returns a NEW object: React only sees a change if it gets a new object.
export function toggleDone(done, dayKey, taskId) {
  const list = done[dayKey] || [];
  const newList = list.includes(taskId) ? list.filter((id) => id !== taskId) : [...list, taskId];
  const result = { ...done, [dayKey]: newList };
  if (newList.length === 0) delete result[dayKey]; // nothing checked that day: nothing to save
  return result;
}
