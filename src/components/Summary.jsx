import { useState } from "react";
import ScoreGauge from "./ScoreGauge.jsx";
import Confetti from "./Confetti.jsx";
import { average, buildReport, scoreColor } from "../lib/format.js";
import { verdict } from "../lib/analyze.js";

export default function Summary({ roleTitle, results, onAgain, onHome }) {
  const [copied, setCopied] = useState(false);
  const avg = average(results.map((r) => r.score));
  const v = verdict(avg);
  const best = results.reduce((a, b) => (b.score > a.score ? b : a), results[0]);
  const weakest = results.reduce((a, b) => (b.score < a.score ? b : a), results[0]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildReport({ roleTitle, results }));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      {avg >= 70 && <Confetti pieces={60} />}

      <section className="panel center">
        <span className="chip">{roleTitle}</span>
        <h2 className="big-title">Session complete</h2>
        <ScoreGauge score={avg} label={v.label} size={210} />
        <p className="summary">{v.line}</p>
      </section>

      {results.length > 1 && (
        <section className="split">
          <div className="panel mini good">
            <small>Strongest</small>
            <b>{best.score}</b>
            <span>{best.question.category}</span>
          </div>
          <div className="panel mini warn">
            <small>Practise next</small>
            <b>{weakest.score}</b>
            <span>{weakest.question.category}</span>
          </div>
        </section>
      )}

      <section className="panel">
        <h3>Your answers</h3>
        <ol className="review">
          {results.map((r) => (
            <li key={r.question.id}>
              <span className="review-q">{r.question.text}</span>
              <span className="review-score" style={{ color: scoreColor(r.score), borderColor: scoreColor(r.score) }}>
                {r.score}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="dock stack">
        <button className="btn btn-primary big" onClick={onAgain}>
          Practise again →
        </button>
        <div className="row">
          <button className="btn btn-ghost" onClick={copy}>
            {copied ? "✓ Copied" : "Copy summary"}
          </button>
          <button className="btn btn-ghost" onClick={onHome}>
            Home
          </button>
        </div>
      </div>
    </>
  );
}
