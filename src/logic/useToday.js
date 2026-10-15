import { useState, useEffect } from 'react';
import { today, dateKey } from './dates';

function currentKey() {
  return dateKey(today());
}

// Today's key ("2026-10-15"). It changes by itself after midnight:
// when the app stays open, and when it comes back from the background.
export function useToday() {
  const [key, setKey] = useState(currentKey);

  // [] = start watching once, when the app opens.
  useEffect(watchTheClock, []);

  function watchTheClock() {
    function check() {
      setKey(currentKey()); // same day = same text: React does nothing
    }
    const timer = setInterval(check, 30000); // every 30 s
    document.addEventListener('visibilitychange', check);
    return function stopWatching() {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }

  return key;
}
