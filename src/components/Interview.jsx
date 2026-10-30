import { useCallback, useEffect, useState } from "react";
import { useSpeech } from "../hooks/useSpeech.js";
import { formatTime } from "../lib/format.js";

const TARGET_SECONDS = 120;

export default function Interview({ question, index, total, busy, onSubmit, onSkip, onQuit }) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const append = useCallback((text) => setAnswer((a) => (a ? `${a.trimEnd()} ` : "") + text.trim()), []);
  const speech = useSpeech(append);

  useEffect(() => {
    if (busy) return undefined;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [busy]);

  const words = answer.trim() ? answer.trim().split(/\s+/).length : 0;
  const pct = Math.min(1, seconds / TARGET_SECONDS);
  const overtime = seconds > TARGET_SECONDS;
  const canSubmit = words >= 3 && !busy;

  const submit = () => {
    if (!canSubmit) return;
    if (speech.listening) speech.stop();
    onSubmit(answer.trim(), seconds);
  };

  return (
    <>
      <div className="topbar">
        <button className="icon-btn" onClick={onQuit} aria-label="Quit interview">
          ✕
        </button>
        <div className="progress" aria-label={`Question ${index + 1} of ${total}`}>
          {Array.from({ length: total }, (_, i) => (
            <i key={i} className={i < index ? "done" : i === index ? "now" : ""} />
          ))}
        </div>
        <div className={`timer ${overtime ? "over" : ""}`} aria-label="Elapsed time">
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="15" className="t-track" />
            <circle
              cx="18"
              cy="18"
              r="15"
              className="t-bar"
              strokeDasharray={`${94.2 * pct} 94.2`}
              transform="rotate(-90 18 18)"
            />
          </svg>
          <span>{formatTime(seconds)}</span>
        </div>
      </div>

      <section className="qcard">
        <div className="qmeta">
          <span className="tag">{question.category}</span>
          <span className="count-label">
            Question {index + 1} of {total}
          </span>
        </div>
        <h2 className="qtext">{question.text}</h2>
        <button className="link-btn" onClick={() => setShowHint((v) => !v)} aria-expanded={showHint}>
          {showHint ? "Hide hint" : "💡 Need a hint?"}
        </button>
        {showHint && <p className="hint-box">{question.hint}</p>}
      </section>

      <section className="answer">
        <label htmlFor="answer" className="sr-only">
          Your answer
        </label>
        <textarea
          id="answer"
          value={answer}
          rows={8}
          disabled={busy}
          placeholder={speech.supported ? "Type your answer, or tap the mic and speak…" : "Type your answer here…"}
          onChange={(e) => setAnswer(e.target.value)}
        />
        {speech.interim && <p className="interim">{speech.interim}…</p>}
        {speech.error && <p className="error-text">{speech.error}</p>}

        <div className="answer-bar">
          <span className="wc">
            {words} {words === 1 ? "word" : "words"}
            <small> · aim for 60 to 200</small>
          </span>
          {speech.supported && (
            <button
              className={`mic ${speech.listening ? "live" : ""}`}
              onClick={speech.listening ? speech.stop : speech.start}
              aria-pressed={speech.listening}
              aria-label={speech.listening ? "Stop recording" : "Start speaking"}
              disabled={busy}
            >
              <span className="mic-ring" />
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 15a3.5 3.5 0 0 0 3.5-3.5v-6a3.5 3.5 0 1 0-7 0v6A3.5 3.5 0 0 0 12 15Zm6-3.5a1 1 0 1 0-2 0 4 4 0 0 1-8 0 1 1 0 1 0-2 0 6 6 0 0 0 5 5.9V20H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-2.6a6 6 0 0 0 5-5.9Z" />
              </svg>
            </button>
          )}
        </div>
      </section>

      <div className="dock two">
        <button className="btn btn-ghost" onClick={onSkip} disabled={busy}>
          Skip
        </button>
        <button className={`btn btn-primary big ${busy ? "loading" : ""}`} onClick={submit} disabled={!canSubmit}>
          {busy ? "Analysing…" : "Get feedback →"}
        </button>
      </div>
    </>
  );
}
