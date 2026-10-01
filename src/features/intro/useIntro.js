import { useEffect, useState } from "react";
import { prefersReducedMotion } from "../whale/motion";

const EYES_CLOSED_MS = 1200; // tela toda azul, olho fechado
const EYES_OPEN_MS = 900; // abriu o olho, ainda de pertinho
const ZOOM_OUT_MS = 1200; // câmera se afastando até a cena normal

// fases da intro: "sleeping" -> "awake" -> "done"
export function useIntro({ onGreet }) {
  const [phase, setPhase] = useState(() => (prefersReducedMotion() ? "done" : "sleeping"));

  useEffect(() => {
    if (phase === "done") return;
    const timers = [
      setTimeout(() => setPhase("awake"), EYES_CLOSED_MS),
      setTimeout(() => setPhase("done"), EYES_CLOSED_MS + EYES_OPEN_MS),
      setTimeout(onGreet, EYES_CLOSED_MS + EYES_OPEN_MS + ZOOM_OUT_MS),
    ];
    return () => timers.forEach(clearTimeout);
    // roda uma vez só, na entrada da página
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { phase };
}
