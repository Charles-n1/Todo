import { fromKey } from './dates';

// A task: { id: "lq2x8k-4fj2a", name: "sport", days: [1, 3, 5] } (the days it repeats, see dates.js),
// or a one-time task: { id: "lq2x9a-8dk3e", name: "dentist", date: "2026-10-30" } (only that day).
// done: { "2026-10-15": ["sport", "anglais"], ... } = the ids of the tasks checked, day by day.

// A new unique id: the time + a few random letters.
// (Not crypto.randomUUID(): it doesn't exist on http://, when testing on the phone from the PC.)
export function newId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// The tasks planned on that day ("2026-10-15"), in the list order.
export function tasksOn(tasks, dayKey) {
  const weekDay = fromKey(dayKey).getDay(); // 0 = Sunday ... 6 = Saturday
  return tasks.filter((task) => (task.date ? task.date === dayKey : task.days.includes(weekDay)));
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
