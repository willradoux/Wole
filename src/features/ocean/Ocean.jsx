import { memo } from "react";
import "./Ocean.css";

const WAVES = [
  { name: "back", crests: 6, height: 70, duration: 11, reverse: true },
  { name: "mid", crests: 4, height: 55, duration: 7 },
  { name: "front", crests: 8, height: 40, duration: 5 },
];

const BUBBLES = Array.from({ length: 12 }, (_, i) => ({
  left: (i * 37 + 5) % 100,
  size: 6 + ((i * 7) % 14),
  duration: 6 + ((i * 3) % 6),
  delay: (i * 0.7) % 6,
}));

// desenha duas metades iguais, aí é só andar -50% que o loop fica sem emenda
function wavePath(crests, height) {
  const width = 2400;
  const step = width / (crests * 2);
  const middle = height / 2;
  let d = `M0 ${middle}`;

  for (let i = 0; i < crests * 2; i++) {
    const peak = i % 2 === 0 ? 0 : height * 0.9;
    d += ` Q${step * i + step / 2} ${peak} ${step * (i + 1)} ${middle}`;
  }

  return `${d} V${height} H0 Z`;
}

export const Ocean = memo(function Ocean({ level }) {
  return (
    <div
      className="ocean"
      style={{ transform: `translateY(${100 - level}%)`, "--depth": level / 100 }}
      aria-hidden="true"
    >
      <div className="ocean__waves">
        {WAVES.map((wave) => (
          <svg
            key={wave.name}
            className={`ocean__wave ocean__wave--${wave.name}`}
            viewBox={`0 0 2400 ${wave.height}`}
            preserveAspectRatio="none"
            style={{
              height: wave.height,
              animationDuration: `${wave.duration}s`,
              animationDirection: wave.reverse ? "reverse" : "normal",
            }}
          >
            <path d={wavePath(wave.crests, wave.height)} />
          </svg>
        ))}
      </div>

      <div className="ocean__depths">
        {BUBBLES.map((bubble, i) => (
          <span
            key={i}
            className="ocean__bubble"
            style={{
              left: `${bubble.left}%`,
              width: bubble.size,
              height: bubble.size,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});
