import { useEffect, useRef } from "react";

// posição do rosto dentro do viewBox da baleia (0 -40 240 220)
const FACE = { x: 120 / 240, y: (102 + 40) / 220 };
const MAX_OFFSET = 6;
const REACH = 120;

// guarda pra onde os olhos devem olhar. é ref e não state de propósito:
// o loop lê isso todo frame e não precisa re-renderizar nada
export function useGaze(anchorRef) {
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function look(event) {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const box = anchor.getBoundingClientRect();
      const dx = event.clientX - (box.left + FACE.x * box.width);
      const dy = event.clientY - (box.top + FACE.y * box.height);
      const distance = Math.hypot(dx, dy) || 1;
      const strength = Math.min(distance / REACH, 1) * MAX_OFFSET;

      target.current = { x: (dx / distance) * strength, y: (dy / distance) * strength };
    }

    function lookAhead() {
      target.current = { x: 0, y: 0 };
    }

    window.addEventListener("pointermove", look, { passive: true });
    document.addEventListener("mouseleave", lookAhead);
    return () => {
      window.removeEventListener("pointermove", look);
      document.removeEventListener("mouseleave", lookAhead);
    };
  }, [anchorRef]);

  return target;
}
