import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../whale/motion";

const EYES_CLOSED_MS = 1000; // grande e de olho fechado
const EYES_OPEN_MS = 700; // abriu o olho, ainda grande
const SHRINK_MS = 700; // tempo de encolher antes do "oi"

// fases da intro: "sleeping" -> "awake" -> "done"
export function useIntro({ onGreet }) {
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? "done" : "sleeping"));

  useEffect(() => {
    if (phase === "done") return;
    const timers = [
      setTimeout(() => setPhase("awake"), EYES_CLOSED_MS),
      setTimeout(() => setPhase("done"), EYES_CLOSED_MS + EYES_OPEN_MS),
      setTimeout(onGreet, EYES_CLOSED_MS + EYES_OPEN_MS + SHRINK_MS),
    ];
    return () => timers.forEach(clearTimeout);
    // roda uma vez só, na entrada da página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase };
}
