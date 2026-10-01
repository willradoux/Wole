import { useLayoutEffect, useRef } from "react";

// rosto dentro do viewBox (0 -40 240 220)
const FACE = { x: 120, y: 102 };
const VIEWBOX = { width: 240, height: 220, top: -40 };
const EYE_HEIGHT = 30; // altura do olho em unidades do SVG
const EYES_SPAN = 72; // de uma ponta à outra dos dois olhos

const ZOOM_OUT = { duration: 1200, easing: "cubic-bezier(.65, 0, .25, 1)" };

// close no rosto: olho com ~20% da altura da tela (o fundo azul cobre o resto)
function closeUp(stage) {
  const box = stage.getBoundingClientRect();
  const unit = box.width / VIEWBOX.width; // px por unidade do SVG
  const faceX = box.left + FACE.x * unit;
  const faceY = box.top + (FACE.y - VIEWBOX.top) * unit;

  const halfW = window.innerWidth / 2;
  const halfH = window.innerHeight / 2;
  const scale = Math.min(
    (window.innerHeight * 0.2) / (EYE_HEIGHT * unit),
    (window.innerWidth * 0.6) / (EYES_SPAN * unit), // no celular não deixa os olhos saírem da tela
  );

  return {
    origin: `${(FACE.x / VIEWBOX.width) * 100}% ${((FACE.y - VIEWBOX.top) / VIEWBOX.height) * 100}%`,
    transform: `translate(${halfW - faceX}px, ${halfH - faceY}px) scale(${scale})`,
  };
}

// intro: começa colada no rosto dela e depois a "câmera" se afasta
export function useIntroZoom({ stageRef, layerRef, intro }) {
  const start = useRef(null);

  // antes do primeiro paint, pra não piscar a cena normal
  useLayoutEffect(() => {
    if (!intro) return;
    start.current = closeUp(stageRef.current);
    layerRef.current.style.transformOrigin = start.current.origin;
    layerRef.current.style.transform = start.current.transform;
    // só na montagem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const layer = layerRef.current;
    if (intro || !start.current) return;

    layer.style.transform = "";
    layer.animate([{ transform: start.current.transform }, { transform: "none" }], ZOOM_OUT);
    start.current = null;
  }, [intro, layerRef]);
}
