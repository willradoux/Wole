import { memo } from "react";
import "./Whale.css";

const BODY =
  "M120 36 C162 36 184 62 192 86 C210 92 224 112 222 136 C220 162 196 170 176 174 C156 178 140 180 120 180 C100 180 84 178 64 174 C44 170 20 162 18 136 C16 112 30 92 48 86 C56 62 78 36 120 36 Z";
const BELLY = "M0 144 C40 132 70 156 120 144 C170 132 200 156 240 144 L240 200 L0 200 Z";
const TAIL =
  "M158 86 C172 66 184 50 192 33 C181 27 171 16 174 3 C187 9 196 17 200 25 C205 15 215 6 230 7 C226 22 216 33 207 39 C201 58 194 78 186 98 Z";

const EYES = [
  { side: "left", cx: 94 },
  { side: "right", cx: 146 },
];
const EYE_Y = 102;

function OpenEyes() {
  return EYES.map(({ side, cx }) => (
    <g key={side} className={`whale__eye whale__eye--${side}`}>
      <ellipse className="whale__blink" cx={cx} cy={EYE_Y} rx="9.5" ry="15" fill="url(#whale-eye)" />
    </g>
  ));
}

function HappyEyes() {
  return EYES.map(({ side, cx }) => (
    <path
      key={side}
      className="whale__eye-happy"
      d={`M${cx - 11} ${EYE_Y + 5} Q${cx} ${EYE_Y - 12} ${cx + 11} ${EYE_Y + 5}`}
      fill="none"
      stroke="url(#whale-eye)"
      strokeWidth="7"
      strokeLinecap="round"
    />
  ));
}

/**
 * Pure drawing. Every expression lives in the eyes; movement is handled by useWhaleMotion.
 * Memoized so the per-second pet clock never repaints the SVG for nothing.
 */
export const Whale = memo(function Whale({ mood, expression }) {
  const asleep = expression === "asleep";
  const joyful = !asleep && (mood === "ecstatic" || expression === "excited" || expression === "loved");
  const eyeState = asleep ? "asleep" : mood === "sad" ? "sad" : "open";

  return (
    <svg className={`whale whale--${eyeState}`} viewBox="0 -40 240 220" aria-hidden="true">
      <defs>
        <clipPath id="whale-clip">
          <path d={BODY} />
        </clipPath>

        <linearGradient id="whale-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b6e1ff" />
          <stop offset="0.55" stopColor="#7cbcf5" />
          <stop offset="1" stopColor="#5a9fe6" />
        </linearGradient>

        {/* Darker rim = volume */}
        <radialGradient id="whale-depth" gradientUnits="userSpaceOnUse" cx="112" cy="92" r="125">
          <stop offset="0.5" stopColor="#1d3f7a" stopOpacity="0" />
          <stop offset="1" stopColor="#1d3f7a" stopOpacity="0.4" />
        </radialGradient>

        {/* Soft matte light. A gradient instead of an SVG blur filter: the blur
            was being recomputed every frame and was the main cause of jank. */}
        <radialGradient id="whale-light">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="whale-belly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf2" />
          <stop offset="1" stopColor="#e6d9c8" />
        </linearGradient>

        <linearGradient id="whale-tail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a2d6ff" />
          <stop offset="1" stopColor="#4f93dc" />
        </linearGradient>

        <linearGradient id="whale-eye" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1c1c24" />
          <stop offset="1" stopColor="#07070a" />
        </linearGradient>

        <linearGradient id="whale-spout" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#7cc4f8" />
          <stop offset="1" stopColor="#d4efff" />
        </linearGradient>
      </defs>

      {expression === "excited" && (
        <g className="whale__spout" stroke="url(#whale-spout)" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M120 42 Q114 14 94 -6" />
          <path d="M120 42 L120 -14" />
          <path d="M120 42 Q126 14 146 -6" />
          <circle cx="88" cy="-14" r="5" fill="#bfe6ff" stroke="none" />
          <circle cx="120" cy="-26" r="5.5" fill="#bfe6ff" stroke="none" />
          <circle cx="152" cy="-14" r="5" fill="#bfe6ff" stroke="none" />
        </g>
      )}

      <path className="whale__tail" d={TAIL} fill="url(#whale-tail)" />

      {/* The rotate stays on the ellipse; the animated transform goes on the <g>. */}
      <g className="whale__fin whale__fin--left">
        <ellipse cx="26" cy="146" rx="16" ry="8" fill="#5f9fe2" transform="rotate(-25 26 146)" />
      </g>
      <g className="whale__fin whale__fin--right">
        <ellipse cx="214" cy="146" rx="16" ry="8" fill="#5f9fe2" transform="rotate(25 214 146)" />
      </g>

      <path d={BODY} fill="url(#whale-body)" />

      <g clipPath="url(#whale-clip)">
        <path d={BELLY} fill="url(#whale-belly)" />
        <path d={BODY} fill="url(#whale-depth)" />
        <ellipse cx="100" cy="66" rx="70" ry="36" fill="url(#whale-light)" />
      </g>

      <g className="whale__eyes">{joyful ? <HappyEyes /> : <OpenEyes />}</g>
    </svg>
  );
});
