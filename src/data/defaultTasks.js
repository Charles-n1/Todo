// The tasks of the very first launch. After that, the list is the user's (add, edit, delete).
export const DEFAULT_TASKS = [
  { id: 'etirement', name: 'étirement', days: [2, 6] }, // Tuesday, Saturday
  { id: 'stage', name: 'stage', days: [1, 2, 3] }, // Monday, Tuesday, Wednesday
  { id: 'english', name: 'english', days: [1, 2, 4, 5] }, // Monday, Tuesday, Thursday, Friday
  { id: 'sport', name: 'sport', days: [3, 6] }, // Wednesday, Saturday
  { id: 'project-perso', name: 'project perso', days: [1, 2, 3, 0] }, // Monday, Tuesday, Wednesday, Sunday
  { id: 'seisei', name: 'seisei', days: [4, 5] }, // Thursday, Friday
  { id: 'cuisine', name: 'cuisine', days: [6] }, // Saturday
];
