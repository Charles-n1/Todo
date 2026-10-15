import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// 🔒 Anti "clickjacking": another site could show our app in an invisible frame, on top of its own buttons,
// and make you click in it without knowing (delete a task...). GitHub Pages can't send the header that forbids it
// (X-Frame-Options), and a CSP in a <meta> ignores "frame-ancestors". So: inside a frame, the app doesn't start.
if (window.self === window.top) {
  createRoot(document.getElementById('root')).render(<App />);
}

// Offline mode: only on the real site (not while developing on the PC).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}
