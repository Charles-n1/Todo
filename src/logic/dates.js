// The days of the week are JS numbers (date.getDay()): 0 = Sunday, 1 = Monday ... 6 = Saturday.
export const WEEK = [1, 2, 3, 4, 5, 6, 0]; // in the order we show them: Monday first
export const WORK_DAYS = [1, 2, 3, 4, 5];
export const WEEKEND = [6, 0];
export const SHORT_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const FULL_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Today at midnight (so two dates of the same day are equal).
export function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// A day is saved by its "key": "2026-10-15" (the phone's local time).
// Bonus: the keys sort like the dates ("2026-10-16" > "2026-10-15").
export function dateKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return date.getFullYear() + '-' + month + '-' + day;
}

// The opposite: "2026-10-15" -> the Date of that day, at midnight.
export function fromKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// The 7 days of the week of this date, Monday first.
export function weekOf(date) {
  const sinceMonday = (date.getDay() + 6) % 7; // Monday = 0 ... Sunday = 6
  const monday = addDays(date, -sinceMonday);
  return [0, 1, 2, 3, 4, 5, 6].map((number) => addDays(monday, number));
}
