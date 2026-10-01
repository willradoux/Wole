// How she floats in each state. The loop eases between these numbers every frame,
// so a mood change never cuts the animation.
//   amp: bob height (px)   speed: bobs per second   tilt: degrees
//   offset: resting height (px)   tail / fins: swing in degrees
export const RHYTHMS = {
  sad:      { amp: 3,  speed: 0.2,  tilt: 2,   offset: 7,  tail: 3,   fins: 5 },
  calm:     { amp: 8,  speed: 0.33, tilt: 3,   offset: 0,  tail: 7,   fins: 12 },
  happy:    { amp: 10, speed: 0.45, tilt: 4,   offset: -2, tail: 9,   fins: 16 },
  ecstatic: { amp: 14, speed: 0.8,  tilt: 6,   offset: -4, tail: 13,  fins: 22 },
  asleep:   { amp: 2,  speed: 0.14, tilt: 1.5, offset: 8,  tail: 1.5, fins: 3 },
};

// One-shot reactions. They start and end at identity because they're layered
// on top of the float with `composite: "add"` — fast clicks stack instead of snapping.
export const REACTIONS = {
  jump: {
    duration: 850,
    keyframes: [
      { offset: 0,    transform: "translateY(0) scale(1, 1) rotate(0deg)", easing: "cubic-bezier(.3,0,.5,1)" },
      { offset: 0.14, transform: "translateY(5px) scale(1.08, .92) rotate(0deg)", easing: "cubic-bezier(.2,.9,.35,1)" },
      { offset: 0.45, transform: "translateY(-44px) scale(.96, 1.05) rotate(-5deg)", easing: "cubic-bezier(.55,0,.8,.45)" },
      { offset: 0.74, transform: "translateY(4px) scale(1.07, .93) rotate(2deg)", easing: "cubic-bezier(.25,1.4,.45,1)" },
      { offset: 1,    transform: "translateY(0) scale(1, 1) rotate(0deg)" },
    ],
  },
  squish: {
    duration: 1000,
    keyframes: [
      { offset: 0,    transform: "scale(1, 1) rotate(0deg)", easing: "cubic-bezier(.3,0,.5,1)" },
      { offset: 0.18, transform: "scale(1.1, .9) rotate(0deg)", easing: "ease-in-out" },
      { offset: 0.38, transform: "scale(.96, 1.05) rotate(-5deg)", easing: "ease-in-out" },
      { offset: 0.58, transform: "scale(1.03, .97) rotate(4deg)", easing: "ease-in-out" },
      { offset: 0.8,  transform: "scale(.99, 1.01) rotate(-1.5deg)", easing: "ease-out" },
      { offset: 1,    transform: "scale(1, 1) rotate(0deg)" },
    ],
  },
};

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Frame-rate independent easing: `rate` is how much of the gap is left after one second.
export const approach = (current, target, rate, dt) =>
  current + (target - current) * (1 - Math.pow(rate, dt));
