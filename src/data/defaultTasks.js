import { WEEK, WORK_DAYS } from '../logic/dates';

// The tasks of the very first launch. After that, the list is the user's (add, edit, delete).
export const DEFAULT_TASKS = [
  { id: 'etirement', name: 'étirement', days: WEEK },
  { id: 'stage', name: 'stage', days: WORK_DAYS },
  { id: 'anglais', name: 'anglais', days: WEEK },
  { id: 'sport', name: 'sport', days: [2, 4, 6] }, // Tuesday, Thursday, Saturday
  { id: 'project-perso', name: 'project perso', days: WEEK },
];
