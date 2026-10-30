import { useEffect, useState } from "react";
import { useCountUp } from "../hooks/useCountUp.js";
import { scoreColor } from "../lib/format.js";

/** Three-quarter arc gauge with an animated sweep and count-up number. */
export default function ScoreGauge({ score, label, size = 190 }) {
  const shown = useCountUp(score, 1200);
  const [drawn, setDrawn] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDrawn(score), 80);
    return () => clearTimeout(timer);
  }, [score]);

  const r = 52;
  const c = 2 * Math.PI * r;
  const arc = c * 0.75;
  const color = scoreColor(score);

  return (
    <div className="gauge" style={{ width: size, height: size }} role="img" aria-label={`Score ${score} out of 100, ${label}`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="gauge-track" cx="60" cy="60" r={r} strokeDasharray={`${arc} ${c}`} transform="rotate(135 60 60)" />
        <circle
          className="gauge-bar"
          cx="60"
          cy="60"
          r={r}
          stroke={color}
          strokeDasharray={`${(arc * drawn) / 100} ${c}`}
          transform="rotate(135 60 60)"
          style={{ filter: `drop-shadow(0 0 7px ${color})` }}
        />
      </svg>
      <div className="gauge-label">
        <strong style={{ color }}>{shown}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}
