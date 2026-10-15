// 🔒 Everything read from the phone storage is checked here BEFORE the app uses it.
// A broken or modified save must never crash the app.
// Rule: we only keep what has EXACTLY the expected shape (a "whitelist"). The rest is thrown away.

// Limits, also used by the forms (so a user can't type absurd values either).
export const MAX_NAME = 40; // characters of a task name
const MAX_TASKS = 200;
const ID = /^[a-z0-9-]{1,40}$/; // "lq2x8k-4fj2a", "sport"
const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/; // "2026-10-15"

// ---------- Small checks ----------

function isNumber(value, min, max) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

// A real {...} object (not null, not a list).
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// [1, 3, 5]: at least one day, only 0 to 6, no duplicates.
function isDayList(days) {
  return (
    Array.isArray(days) &&
    days.length > 0 &&
    days.length <= 7 &&
    days.every((day) => Number.isInteger(day) && day >= 0 && day <= 6) &&
    new Set(days).size === days.length
  );
}

function isTask(task) {
  return (
    isObject(task) &&
    typeof task.id === 'string' &&
    ID.test(task.id) &&
    typeof task.name === 'string' &&
    task.name.trim().length > 0 &&
    task.name.length <= MAX_NAME &&
    isDayList(task.days)
  );
}

// ---------- One validator per saved thing ----------

// The list of tasks, or null (never saved = first launch, or not a list at all).
// A broken task is dropped, the others are kept.
export function validTasks(tasks) {
  if (!Array.isArray(tasks)) return null;
  const seen = new Set();
  const clean = [];
  for (const task of tasks.slice(0, MAX_TASKS)) {
    if (isTask(task) && !seen.has(task.id)) {
      seen.add(task.id);
      clean.push({ id: task.id, name: task.name, days: [...task.days] });
    }
  }
  return clean;
}

// { "2026-10-15": ["sport", ...], ... }. Always an object ({} = nothing checked yet).
export function validDone(done) {
  const clean = {};
  if (!isObject(done)) return clean;
  for (const [key, ids] of Object.entries(done)) {
    if (DAY_KEY.test(key) && Array.isArray(ids)) {
      const goodIds = ids.filter((id) => typeof id === 'string' && ID.test(id)).slice(0, MAX_TASKS);
      if (goodIds.length > 0) clean[key] = [...new Set(goodIds)];
    }
  }
  return clean;
}

// { themeName, musicName, musicVolume, soundVolume } or null.
export function validSettings(settings) {
  if (!isObject(settings)) return null;
  const { themeName, musicName, musicVolume, soundVolume } = settings;
  const ok =
    typeof themeName === 'string' &&
    typeof musicName === 'string' &&
    isNumber(musicVolume, 0, 1) &&
    isNumber(soundVolume, 0, 1);
  return ok ? { themeName, musicName, musicVolume, soundVolume } : null;
}
