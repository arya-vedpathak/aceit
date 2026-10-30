import test from "node:test";
import assert from "node:assert/strict";
import { extractJson, normalizeFeedback, buildPrompt } from "./ai.js";
import { formatTime, average, scoreColor, buildReport } from "./format.js";
import { historyStats } from "./storage.js";
import { QUESTIONS, ROLES, pickQuestions } from "../data/questions.js";

test("extractJson handles prose and code fences", () => {
  const reply = 'Sure! ```json\n{"score": 72, "summary": "Nice"}\n``` hope that helps';
  assert.deepEqual(extractJson(reply), { score: 72, summary: "Nice" });
  assert.throws(() => extractJson("no json here"));
});

test("normalizeFeedback clamps and sanitises untrusted data", () => {
  const f = normalizeFeedback({
    score: 250,
    strengths: ["a", 5, "", "b", "c", "d"],
    improvements: "not a list",
    star: { situation: 1, task: 0, action: "yes", result: null },
    betterAnswer: "  better  ",
  });
  assert.equal(f.score, 100);
  assert.deepEqual(f.strengths, ["a", "b", "c"]);
  assert.deepEqual(f.improvements, []);
  assert.deepEqual(f.star, { situation: true, task: false, action: true, result: false });
  assert.equal(f.betterAnswer, "better");
  assert.equal(normalizeFeedback({}).score, 0);
});

test("buildPrompt includes role, question and answer", () => {
  const p = buildPrompt({ role: "AI App Developer", question: { type: "technical", text: "What is RAG?" }, answer: "An answer" });
  assert.match(p, /AI App Developer/);
  assert.match(p, /What is RAG\?/);
  assert.match(p, /An answer/);
});

test("format helpers", () => {
  assert.equal(formatTime(75), "1:15");
  assert.equal(formatTime(-5), "0:00");
  assert.equal(average([80, 70, 90]), 80);
  assert.equal(average([]), 0);
  assert.equal(scoreColor(90), "#b6f23a");
  assert.equal(scoreColor(10), "#ff7a59");
  const report = buildReport({
    roleTitle: "Web Developer",
    results: [{ question: { text: "Q1" }, score: 80, label: "Strong" }],
  });
  assert.match(report, /Average score: 80\/100/);
});

test("historyStats", () => {
  assert.deepEqual(historyStats([]), { sessions: 0, best: 0 });
  assert.deepEqual(historyStats([{ avg: 40 }, { avg: 77 }]), { sessions: 2, best: 77 });
});

test("question bank is well formed", () => {
  for (const role of ROLES) {
    const list = QUESTIONS[role.id];
    assert.ok(list.length >= 8, `${role.id} needs at least 8 questions`);
    assert.equal(new Set(list.map((q) => q.id)).size, list.length, `${role.id} has duplicate ids`);
    for (const q of list) {
      assert.ok(["behavioural", "technical"].includes(q.type));
      assert.ok(q.text && q.hint && q.tip);
      assert.ok(q.keywords.length >= 3);
    }
  }
});

test("pickQuestions returns unique questions up to the pool size", () => {
  const picked = pickQuestions("ai", 5);
  assert.equal(picked.length, 5);
  assert.equal(new Set(picked.map((q) => q.id)).size, 5);
  assert.equal(pickQuestions("hr", 99).length, QUESTIONS.hr.length);
  assert.deepEqual(pickQuestions("nope", 3), []);
});
