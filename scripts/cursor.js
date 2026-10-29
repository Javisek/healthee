// Disable custom cursor on touch devices (RUN FIRST)
if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
  document.body.style.cursor = "auto";
  const cursorEl = document.getElementById("cursor");
  if (cursorEl) cursorEl.remove();
  return; // stop execution cleanly
}

const cursor = document.getElementById("cursor");
const amount = 20;
const sineDots = Math.floor(amount * 0.3);
const width = 24;
const idleTimeout = 100;

let lastFrame = 0;
let mousePosition = { x: 0, y: 0 };
let dots = [];
let timeoutID;
let idle = false;

class Dot {
  constructor(index = 0) {
    this.index = index;
    this.anglespeed = 0.05;
    this.x = 0;
    this.y = 0;
    this.scale = 1 - 0.05 * index;
    this.range = width / 2 - (width / 2) * this.scale + 2;

    this.element = document.createElement("span");
    this.element.style.transform = `scale(${this.scale})`;
    cursor.appendChild(this.element);
  }

  lock() {
    this.lockX = this.x;
    this.lockY = this.y;
    this.angleX = Math.PI * 2 * Math.random();
    this.angleY = Math.PI * 2 * Math.random();
  }

  draw() {
    this.element.style.transform =
      `translate(${this.x}px, ${this.y}px) scale(${this.scale})`;
  }
}

function startIdleTimer() {
  timeoutID = setTimeout(() => {
    idle = true;
    dots.forEach(d => d.lock());
  }, idleTimeout);
}

function resetIdleTimer() {
  clearTimeout(timeoutID);
  idle = false;
  startIdleTimer();
}

function buildDots() {
  for (let i = 0; i < amount; i++) {
    dots.push(new Dot(i));
  }
}

function onMouseMove(e) {
  mousePosition.x = e.clientX - width / 2;
  mousePosition.y = e.clientY - width / 2;
  resetIdleTimer();
}

function positionCursor() {
  let x = mousePosition.x;
  let y = mousePosition.y;

  dots.forEach((dot, i) => {
    const next = dots[i + 1] || dots[0];
    dot.x = x;
    dot.y = y;
    dot.draw();

    if (!idle || i <= sineDots) {
      x += (next.x - dot.x) * 0.45;
      y += (next.y - dot.y) * 0.45;
    }
  });

  requestAnimationFrame(positionCursor);
}

function init() {
  window.addEventListener("mousemove", onMouseMove);
  startIdleTimer();
  buildDots();
  positionCursor();
}

init();
