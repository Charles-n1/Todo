import { createContext, useContext } from 'react';

// The "Old paper" look: a fine grain (SVG noise) + edges darkened by time (a vignette).
// It is drawn on top of the background color, under everything else.
const PAPER_GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E" +
  "%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E" +
  "%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.28 0 0 0 0 0.1 0 0 0 0.6 -0.2'/%3E%3C/filter%3E" +
  "%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E\")";
const PAPER_EDGES =
  'radial-gradient(ellipse at 50% 40%, rgba(255, 249, 228, 0.55) 0%, rgba(255, 249, 228, 0) 55%, rgba(122, 78, 22, 0.28) 100%)';

// Every theme has the same keys, only the colors change.
export const THEMES = [
  {
    name: 'Old paper', // the default: a yellowed sheet, brown ink
    background: '#f4e4bc', // page
    card: '#fbf3dc', // tasks, inputs
    text: '#3e2c16',
    border: '#8a6a3b',
    button: '#6b4a24',
    buttonText: '#fbf3dc',
    texture: PAPER_EDGES + ', ' + PAPER_GRAIN, // drawn on top of the background (null = none)
    statusBar: 'dark',
    dark: false, // dark background?
  },
  {
    name: 'Light',
    background: '#ffffff',
    card: '#ffffff',
    text: '#000000',
    border: '#000000',
    button: '#000000',
    buttonText: '#ffffff',
    texture: null,
    statusBar: 'dark',
    dark: false,
  },
  {
    name: 'Dark',
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    border: '#ffffff',
    button: '#ffffff',
    buttonText: '#000000',
    texture: null,
    statusBar: 'light',
    dark: true,
  },
  {
    name: 'Neon',
    background: '#0d0221',
    card: '#1a0b3d',
    text: '#f5f5f5',
    border: '#ff2a6d',
    button: '#05d9e8',
    buttonText: '#0d0221',
    texture: null,
    statusBar: 'light',
    dark: true,
  },
  {
    name: 'Sakura',
    background: '#fff0f5',
    card: '#ffffff',
    text: '#4a2040',
    border: '#ff8fb8',
    button: '#ff6fa3',
    buttonText: '#ffffff',
    texture: null,
    statusBar: 'dark',
    dark: false,
  },
  {
    name: 'Sky', // like Sakura, but blue
    background: '#eaf4ff',
    card: '#ffffff',
    text: '#0a2a4a',
    border: '#7fbfff',
    button: '#007FFF',
    buttonText: '#ffffff',
    texture: null,
    statusBar: 'dark',
    dark: false,
  },
  {
    name: 'PS5', // black console, white text, PlayStation blue
    background: '#000000',
    card: '#141414',
    text: '#ffffff',
    border: '#ffffff',
    button: '#0070D1',
    buttonText: '#ffffff',
    texture: null,
    statusBar: 'light',
    dark: true,
  },
  {
    name: 'Game Boy', // the old green screen
    background: '#9bbc0f',
    card: '#8bac0f',
    text: '#0f380f',
    border: '#0f380f',
    button: '#306230',
    buttonText: '#9bbc0f',
    texture: null,
    statusBar: 'dark',
    dark: false,
  },
  {
    name: 'Switch', // the Joy-Con colors: neon red + neon blue
    background: '#f2f2f2',
    card: '#ffffff',
    text: '#2d2d2d',
    border: '#00C3E3',
    button: '#FF4554',
    buttonText: '#ffffff',
    texture: null,
    statusBar: 'dark',
    dark: false,
  },
];

// The green of "done": the V of a checked task, and the done blocks of the chart.
export const DONE_GREEN = '#2e9e4f';

// A "global variable" every component can read, without passing it as a prop.
export const ThemeContext = createContext(THEMES[0]);

export function useTheme() {
  return useContext(ThemeContext);
}
