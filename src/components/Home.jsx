import { ROLES } from "../data/questions.js";

const COUNTS = [3, 5, 8];

export default function Home({ roleId, onRole, count, onCount, onStart, stats, aiOn, onSettings }) {
  return (
    <>
      <header className="hero">
        <div className="logo" aria-hidden="true">
          <span>A</span>
        </div>
        <h1>
          Ace<span className="grad">It</span>
        </h1>
        <p className="tagline">Practise out loud. Get better fast.</p>
        <ol className="steps">
          <li>
            <b>1</b> Pick a role
          </li>
          <li>
            <b>2</b> Type or speak
          </li>
          <li>
            <b>3</b> Get instant feedback
          </li>
        </ol>
      </header>

      <section className="panel" aria-labelledby="role-h">
        <h2 id="role-h">Choose your interview</h2>
        <div className="roles" role="radiogroup" aria-label="Interview role">
          {ROLES.map((role) => (
            <button
              key={role.id}
              role="radio"
              aria-checked={roleId === role.id}
              className={`role ${roleId === role.id ? "picked" : ""}`}
              style={{ "--accent": role.color }}
              onClick={() => onRole(role.id)}
            >
              <span className="role-emoji">{role.emoji}</span>
              <span className="role-text">
                <strong>{role.title}</strong>
                <small>{role.blurb}</small>
              </span>
              <span className="role-check" aria-hidden="true">
                ✓
              </span>
            </button>
          ))}
        </div>

        <h2 className="mt">How many questions?</h2>
        <div className="counts" role="radiogroup" aria-label="Number of questions">
          {COUNTS.map((n) => (
            <button
              key={n}
              role="radio"
              aria-checked={count === n}
              className={`count ${count === n ? "picked" : ""}`}
              onClick={() => onCount(n)}
            >
              <strong>{n}</strong>
              <small>about {n * 2} min</small>
            </button>
          ))}
        </div>
      </section>

      <section className="meta-row">
        <button className={`mode ${aiOn ? "on" : ""}`} onClick={onSettings}>
          <span className="dot" />
          {aiOn ? "AI coach on" : "Basic coach · works offline"}
          <small>Change</small>
        </button>
        <div className="mini-stats">
          <span>
            <b>{stats.sessions}</b> sessions
          </span>
          <span>
            <b>{stats.best}</b> best
          </span>
        </div>
      </section>

      <div className="dock">
        <button className="btn btn-primary big shine" onClick={onStart}>
          Start interview →
        </button>
      </div>
    </>
  );
}
