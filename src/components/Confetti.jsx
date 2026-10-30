import { useMemo } from "react";

const COLORS = ["#b6f23a", "#2dd4bf", "#ff7a59", "#38bdf8", "#fbbf24", "#f472b6"];

/** One-shot celebration burst. Pieces fall once and stay invisible afterwards. */
export default function Confetti({ pieces = 44 }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.2 + Math.random() * 1.8,
        size: 6 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
        drift: (Math.random() - 0.5) * 120,
      })),
    [pieces],
  );

  return (
    <div className="confetti" aria-hidden="true">
      {items.map((p) => (
        <i
          key={p.id}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.5,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--spin": `${p.spin}deg`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
