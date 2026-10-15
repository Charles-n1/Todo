import { WORK_DAYS } from '../logic/dates';

// The tasks of the very first launch. After that, the list is the user's (add, edit, delete).
export const DEFAULT_TASKS = [
  { id: 'etirement', name: 'étirement', days: [2, 6] }, // Tuesday, Saturday
  { id: 'stage', name: 'stage', days: [1, 2, 4, 5] }, // Monday, Tuesday, Thursday, Friday
  { id: 'anglais', name: 'anglais', days: [1, 3, 5] }, // Monday, Wednesday, Friday
  { id: 'sport', name: 'sport', days: [3, 6] }, // Wednesday, Saturday
  { id: 'project-perso', name: 'project perso', days: WORK_DAYS },
];
