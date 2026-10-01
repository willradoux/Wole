import { useCallback, useEffect, useRef, useState } from "react";

const WATER_PER_FEED = 10;
const DRAIN_STEP = 5;
const DRAIN_AFTER_SECONDS = 8;
const SLEEP_AFTER_SECONDS = 20;
const EXPRESSION_MS = 900;

export function getMood(water) {
  if (water === 0) return "sad";
  if (water < 50) return "calm";
  if (water < 100) return "happy";
  return "ecstatic";
}

// tudo que a Wole sente fica aqui, os componentes só leem e chamam as ações
export function usePet() {
  const [clicks, setClicks] = useState(0);
  const [water, setWater] = useState(0);
  const [expression, setExpression] = useState(null); // "excited" | "loved"
  const [asleep, setAsleep] = useState(false);
  const [reaction, setReaction] = useState(null); // { type, id } -> o id muda pra animação rodar de novo

  const lastInteraction = useRef(Date.now());
  const expressionTimer = useRef();

  const wake = useCallback(() => {
    lastInteraction.current = Date.now();
    setAsleep(false);
  }, []);

  const react = useCallback((nextExpression, type) => {
    setExpression(nextExpression);
    setReaction((prev) => ({ type, id: (prev?.id ?? 0) + 1 }));
    clearTimeout(expressionTimer.current);
    expressionTimer.current = setTimeout(() => setExpression(null), EXPRESSION_MS);
  }, []);

  const feed = useCallback(() => {
    wake();
    setClicks((c) => c + 1);
    setWater((w) => Math.min(w + WATER_PER_FEED, 100));
    react("excited", "jump");
  }, [wake, react]);

  const pet = useCallback(() => {
    wake();
    react("loved", "squish");
  }, [wake, react]);

  const greet = useCallback(() => {
    react("excited", "jump");
  }, [react]);

  const reset = useCallback(() => {
    wake();
    clearTimeout(expressionTimer.current);
    setExpression(null);
    setClicks(0);
    setWater(0);
  }, [wake]);

  // se ninguém mexer o mar vai secando e depois ela dorme
  useEffect(() => {
    const id = setInterval(() => {
      const idle = (Date.now() - lastInteraction.current) / 1000;
      if (idle >= SLEEP_AFTER_SECONDS) setAsleep(true);
      if (idle >= DRAIN_AFTER_SECONDS && Math.floor(idle) % 2 === 0) {
        setWater((w) => Math.max(w - DRAIN_STEP, 0));
      }
    }, 1000);

    return () => {
      clearInterval(id);
      clearTimeout(expressionTimer.current);
    };
  }, []);

  return {
    clicks,
    water,
    mood: getMood(water),
    expression: asleep ? "asleep" : expression,
    asleep,
    reaction,
    canReset: clicks > 0 || water > 0,
    feed,
    pet,
    greet,
    reset,
  };
}
