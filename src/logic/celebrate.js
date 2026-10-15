import { playSound } from '../sounds';
import { confettiBurst, confettiCannons } from './confetti';

// A task was just checked 🎉
// box: the checked box (the confetti fly out of it). lastOne: it was the last task of the day.
export function celebrate(box, lastOne) {
  const place = box.getBoundingClientRect();
  confettiBurst(place.left + place.width / 2, place.top + place.height / 2);
  playSound('success');
  if (navigator.vibrate) navigator.vibrate(15); // a tiny buzz (Android only: the iPhone doesn't allow it)
  if (lastOne) setTimeout(bigParty, 350); // just after the first burst
}

// Every task of the day is done: the cannons + the victory sound.
function bigParty() {
  confettiCannons();
  playSound('victory');
}
