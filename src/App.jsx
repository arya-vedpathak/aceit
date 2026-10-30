import { useEffect, useState } from "react";
import Aurora from "./components/Aurora.jsx";
import Home from "./components/Home.jsx";
import Interview from "./components/Interview.jsx";
import Feedback from "./components/Feedback.jsx";
import Summary from "./components/Summary.jsx";
import SettingsSheet from "./components/SettingsSheet.jsx";
import { ROLES, pickQuestions } from "./data/questions.js";
import { analyzeAnswer } from "./lib/analyze.js";
import { fetchAiFeedback } from "./lib/ai.js";
import { average } from "./lib/format.js";
import { addHistory, historyStats, loadHistory, loadSettings, saveSettings } from "./lib/storage.js";

export default function App() {
  const [settings, setSettings] = useState(loadSettings);
  const [history, setHistory] = useState(loadHistory);
  const [roleId, setRoleId] = useState("ai");
  const [count, setCount] = useState(5);
  const [screen, setScreen] = useState("home");
  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [current, setCurrent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, index]);

  const activeRole = ROLES.find((r) => r.id === (session?.roleId ?? roleId));

  const start = () => {
    setSession({ roleId, questions: pickQuestions(roleId, count) });
    setIndex(0);
    setResults([]);
    setCurrent(null);
    setScreen("interview");
  };

  const finish = (finalResults) => {
    if (finalResults.length === 0) {
      setScreen("home");
      return;
    }
    setHistory(
      addHistory({
        date: Date.now(),
        role: session.roleId,
        avg: average(finalResults.map((r) => r.score)),
        count: finalResults.length,
      }),
    );
    setScreen("summary");
  };

  const next = (latest) => {
    if (index + 1 >= session.questions.length) finish(latest);
    else {
      setIndex((i) => i + 1);
      setScreen("interview");
    }
  };

  const submit = async (answer, seconds) => {
    const question = session.questions[index];
    const local = analyzeAnswer(question, answer);
    let result = local;
    setBusy(true);

    if (settings.apiKey) {
      try {
        const ai = await fetchAiFeedback({
          apiKey: settings.apiKey,
          model: settings.model,
          role: activeRole.title,
          question,
          answer,
        });
        result = { ...local, ...ai, mode: "ai", star: question.type === "behavioural" ? ai.star ?? local.star : null };
      } catch (error) {
        result = { ...local, notice: `AI coach unavailable (${error.message}). Showing basic feedback instead.` };
      }
    }

    const full = { ...result, question, answer, seconds };
    setBusy(false);
    setResults((r) => [...r, full]);
    setCurrent(full);
    setScreen("feedback");
  };

  const quit = () => {
    if (window.confirm("Leave this interview? Your progress in this session will be lost.")) setScreen("home");
  };

  const saveAndStore = (value) => {
    setSettings(value);
    saveSettings(value);
  };

  return (
    <>
      <Aurora />
      <div className="shell">
        <main className="screen" key={`${screen}-${index}`}>
          {screen === "home" && (
            <Home
              roleId={roleId}
              onRole={setRoleId}
              count={count}
              onCount={setCount}
              onStart={start}
              stats={historyStats(history)}
              aiOn={Boolean(settings.apiKey)}
              onSettings={() => setSheet(true)}
            />
          )}

          {screen === "interview" && session && (
            <Interview
              key={session.questions[index].id}
              question={session.questions[index]}
              index={index}
              total={session.questions.length}
              busy={busy}
              onSubmit={submit}
              onSkip={() => next(results)}
              onQuit={quit}
            />
          )}

          {screen === "feedback" && current && (
            <Feedback result={current} isLast={index + 1 >= session.questions.length} onNext={() => next(results)} />
          )}

          {screen === "summary" && (
            <Summary roleTitle={activeRole.title} results={results} onAgain={start} onHome={() => setScreen("home")} />
          )}
        </main>
      </div>

      {sheet && <SettingsSheet settings={settings} onSave={saveAndStore} onClose={() => setSheet(false)} />}
    </>
  );
}
