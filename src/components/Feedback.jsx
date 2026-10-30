import { useEffect, useState } from "react";
import ScoreGauge from "./ScoreGauge.jsx";
import Confetti from "./Confetti.jsx";
import { scoreColor } from "../lib/format.js";

const STAR_LABELS = [
  ["situation", "Situation"],
  ["task", "Task"],
  ["action", "Action"],
  ["result", "Result"],
];

export default function Feedback({ result, isLast, onNext }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(timer);
  }, []);

  const { question } = result;

  return (
    <>
      {result.score >= 85 && <Confetti />}

      <section className="panel center">
        <div className="chips">
          <span className="chip">{question.category}</span>
          <span className={`chip ${result.mode === "ai" ? "ai" : ""}`}>{result.mode === "ai" ? "✨ AI coach" : "Basic coach"}</span>
        </div>
        <ScoreGauge score={result.score} label={result.label} />
        <p className="summary">{result.summary}</p>
        {result.notice && <p className="notice">{result.notice}</p>}
        <ul className="stat-row">
          <li>
            <b>{result.stats.words}</b>
            <small>words</small>
          </li>
          <li>
            <b>{result.stats.fillers}</b>
            <small>fillers</small>
          </li>
          <li>
            <b>{result.stats.numbers}</b>
            <small>numbers</small>
          </li>
          <li>
            <b>{Math.max(1, Math.round(result.seconds / 60))}</b>
            <small>min</small>
          </li>
        </ul>
      </section>

      <section className="panel">
        <h3>Score breakdown</h3>
        <ul className="bars">
          {result.breakdown.map((part) => {
            const pct = Math.round((part.value / part.max) * 100);
            return (
              <li key={part.label}>
                <div className="bar-head">
                  <span>{part.label}</span>
                  <b>
                    {part.value}/{part.max}
                  </b>
                </div>
                <div className="bar">
                  <i style={{ width: ready ? `${pct}%` : "0%", background: scoreColor(pct) }} />
                </div>
              </li>
            );
          })}
        </ul>

        {result.star && (
          <div className="star-row" aria-label="STAR structure check">
            {STAR_LABELS.map(([key, label]) => (
              <span key={key} className={`star-chip ${result.star[key] ? "yes" : ""}`}>
                {result.star[key] ? "✓" : "○"} {label}
              </span>
            ))}
          </div>
        )}
      </section>

      {result.strengths.length > 0 && (
        <section className="panel good">
          <h3>What worked</h3>
          <ul className="list">
            {result.strengths.map((s) => (
              <li key={s}>
                <i>✓</i>
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      {result.improvements.length > 0 && (
        <section className="panel warn">
          <h3>Level it up</h3>
          <ul className="list">
            {result.improvements.map((s) => (
              <li key={s}>
                <i>→</i>
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="panel">
        <h3>{result.betterAnswer ? "A stronger version" : "How a strong answer sounds"}</h3>
        <p className="quote">{result.betterAnswer || question.tip}</p>
        <details>
          <summary>Your answer</summary>
          <p className="your-answer">{result.answer}</p>
        </details>
      </section>

      <div className="dock">
        <button className="btn btn-primary big" onClick={onNext}>
          {isLast ? "See my results →" : "Next question →"}
        </button>
      </div>
    </>
  );
}
