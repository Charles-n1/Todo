// 🎉 Confetti, drawn on a see-through sheet (a <canvas>) on top of the whole app.
// No library: each piece of paper is a small object that we move a little bit, 60 times per second.

const COLORS = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ff924c', '#ff70a6', '#00c2a8'];
const GRAVITY = 0.16; // how fast they fall
const AIR = 0.955; // the air slows them down: they lose 4.5% of their speed each frame
const FRAME = 1000 / 60; // the movements are written for 60 frames per second

let canvas = null; // created the first time it's needed
let pen = null; // what draws on the canvas
let pieces = [];
let lastTime = 0;
let running = false;

function random(min, max) {
  return min + Math.random() * (max - min);
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Fewer pieces if the phone asks for less motion (an accessibility setting).
function scaled(amount) {
  const lessMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return lessMotion ? Math.round(amount / 4) : amount;
}

function setUp() {
  canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  document.body.appendChild(canvas);
  pen = canvas.getContext('2d');
  fitScreen();
  window.addEventListener('resize', fitScreen);
}

// Sharp on Retina screens: the canvas gets 2 or 3 real pixels per CSS pixel.
function fitScreen() {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  pen.setTransform(ratio, 0, 0, ratio, 0, 0);
}

// One piece, thrown from (x, y) in the direction "angle" (in radians: -π/2 = straight up).
function throwPiece(x, y, angle, speed) {
  pieces.push({
    x: x,
    y: y,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    width: random(6, 11),
    height: random(4, 7),
    round: Math.random() < 0.25, // a few little circles among the rectangles
    color: pick(COLORS),
    turn: random(0, Math.PI * 2),
    turnSpeed: random(-0.25, 0.25),
    flip: random(0, Math.PI * 2), // it turns over in the air: we see its thin side, then its face
    flipSpeed: random(0.08, 0.22),
    sway: random(0, Math.PI * 2), // left, right, left... like a falling leaf
    age: 0,
    life: random(110, 170), // frames before it disappears (~2-3 s)
  });
}

function start() {
  if (!canvas) setUp();
  if (running) return; // already moving: the new pieces join the others
  running = true;
  lastTime = performance.now();
  requestAnimationFrame(frame);
}

function frame(time) {
  // k = how many "60 fps frames" passed since the last one.
  // (A 120 Hz iPhone draws twice as often: each step is half as big. Same speed everywhere.)
  const k = Math.min(3, (time - lastTime) / FRAME);
  lastTime = time;
  pen.clearRect(0, 0, window.innerWidth, window.innerHeight);
  pieces = pieces.filter((piece) => piece.age < piece.life && piece.y < window.innerHeight + 30);
  for (const piece of pieces) {
    move(piece, k);
    draw(piece);
  }
  if (pieces.length > 0) {
    requestAnimationFrame(frame);
  } else {
    running = false; // nothing left: we stop drawing (no battery wasted)
  }
}

function move(piece, k) {
  const air = Math.pow(AIR, k);
  piece.speedX *= air;
  piece.speedY = piece.speedY * air + GRAVITY * k;
  piece.sway += 0.1 * k;
  piece.x += (piece.speedX + Math.sin(piece.sway) * 0.8) * k;
  piece.y += piece.speedY * k;
  piece.turn += piece.turnSpeed * k;
  piece.flip += piece.flipSpeed * k;
  piece.age += k;
}

function draw(piece) {
  const fadeFrom = piece.life * 0.7; // the last 30% of its life: it fades away
  pen.save();
  pen.globalAlpha = piece.age < fadeFrom ? 1 : Math.max(0, 1 - (piece.age - fadeFrom) / (piece.life - fadeFrom));
  pen.translate(piece.x, piece.y);
  pen.rotate(piece.turn);
  pen.scale(1, Math.cos(piece.flip));
  pen.fillStyle = piece.color;
  if (piece.round) {
    pen.beginPath();
    pen.arc(0, 0, piece.height / 2 + 1, 0, Math.PI * 2);
    pen.fill();
  } else {
    pen.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
  }
  pen.restore();
}

// A burst from one point (the box that was just checked), mostly upwards.
export function confettiBurst(x, y) {
  const amount = scaled(80);
  for (let i = 0; i < amount; i++) {
    throwPiece(x, y, -Math.PI / 2 + random(-1.3, 1.3), random(5, 15));
  }
  start();
}

// The big party: two cannons in the bottom corners, shooting up towards the middle.
export function confettiCannons() {
  const amount = scaled(110); // per cannon
  const bottom = window.innerHeight;
  for (let i = 0; i < amount; i++) {
    throwPiece(0, bottom, random(-1.35, -0.75), random(20, 36)); // left: up and to the right
    throwPiece(window.innerWidth, bottom, random(-2.39, -1.79), random(20, 36)); // right: up and to the left
  }
  start();
}
