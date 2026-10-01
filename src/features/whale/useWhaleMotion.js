import { useEffect, useRef } from "react";
import { RHYTHMS, REACTIONS, approach, prefersReducedMotion } from "./motion";
import { useGaze } from "./useGaze";

const TAU = Math.PI * 2;
const RESTING = { x: 0, y: 0 };

/**
 * Drives the whale at 60fps: floating, ground shadow, tail, fins and eyes.
 * Writes straight to the DOM through refs so React never re-renders per frame.
 */
export function useWhaleMotion({ mood, asleep, reaction }) {
  const stageRef = useRef(null);
  const floatRef = useRef(null);
  const reactionRef = useRef(null);
  const shadowRef = useRef(null);

  const gaze = useGaze(stageRef);
  const state = useRef({ mood, asleep });
  state.current = { mood, asleep };

  useEffect(() => {
    const still = prefersReducedMotion() ? 0 : 1;
    const current = { ...RHYTHMS.sad };
    const eyes = { x: 0, y: 0 };
    let parts = null;
    let phase = 0;
    let tailPhase = 0;
    let last = performance.now();
    let frame;

    // The SVG keeps the same nodes across renders, so look them up once
    // and only again if React ever swaps them out.
    function getParts() {
      if (parts?.tail.isConnected) return parts;
      const svg = stageRef.current;
      if (!svg) return null;
      parts = {
        tail: svg.querySelector(".whale__tail"),
        finLeft: svg.querySelector(".whale__fin--left"),
        finRight: svg.querySelector(".whale__fin--right"),
        eyes: svg.querySelector(".whale__eyes"),
      };
      return parts.tail ? parts : null;
    }

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const { mood, asleep } = state.current;
      const target = RHYTHMS[asleep ? "asleep" : mood];
      for (const key in target) current[key] = approach(current[key], target[key], 0.15, dt);

      phase += dt * current.speed * TAU;
      tailPhase += dt * current.speed * 2.6 * TAU;

      const bob = Math.sin(phase) * current.amp * still;
      const y = current.offset - bob;
      const tilt = Math.sin(phase - 0.7) * current.tilt * still; // lagging = more organic
      const stretch = Math.cos(phase) * 0.012 * (current.amp / 8) * still;

      floatRef.current.style.transform =
        `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${tilt.toFixed(2)}deg) ` +
        `scale(${(1 - stretch).toFixed(4)}, ${(1 + stretch).toFixed(4)})`;

      const lift = bob / 40;
      shadowRef.current.style.transform = `scale(${(1 - lift * 0.6).toFixed(3)})`;
      shadowRef.current.style.opacity = (1 - lift * 0.8).toFixed(3);

      const p = getParts();
      if (p) {
        const swing = Math.sin(tailPhase) * current.tail * still;
        const paddle = Math.sin(tailPhase * 0.7) * current.fins * still;
        p.tail.style.transform = `rotate(${(1 + swing).toFixed(2)}deg)`;
        p.finLeft.style.transform = `rotate(${paddle.toFixed(2)}deg)`;
        p.finRight.style.transform = `rotate(${(-paddle).toFixed(2)}deg)`;

        const look = asleep ? RESTING : gaze.current;
        eyes.x = approach(eyes.x, look.x, 0.001, dt);
        eyes.y = approach(eyes.y, look.y, 0.001, dt);
        p.eyes.style.transform = `translate(${eyes.x.toFixed(2)}px, ${eyes.y.toFixed(2)}px)`;
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [gaze]);

  // Reactions play on their own layer so they add up with the float.
  useEffect(() => {
    const el = reactionRef.current;
    if (!reaction || !el?.animate || prefersReducedMotion()) return;
    const { keyframes, duration } = REACTIONS[reaction.type];
    el.animate(keyframes, { duration, composite: "add" });
  }, [reaction]);

  return { stageRef, floatRef, reactionRef, shadowRef };
}
