import test from "node:test";
import assert from "node:assert/strict";
import { analyzeAnswer, verdict } from "./analyze.js";
import { QUESTIONS } from "../data/questions.js";

const behavioural = QUESTIONS.hr.find((q) => q.id === "hr-conflict");
const technical = QUESTIONS.ai.find((q) => q.id === "ai-rag");

const STRONG_STORY =
  "When I was in my final year, our team had to build a chatbot for the college library and I was responsible for the search backend. " +
  "I designed a retrieval pipeline, implemented caching and tested it with 50 sample questions. " +
  "As a result, response time dropped by 40% and I learned how to measure quality before launch. " +
  "I also listened to my teammates and we agreed on a goal to discuss trade-offs openly.";

test("empty answer scores zero", () => {
  const r = analyzeAnswer(behavioural, "   ");
  assert.equal(r.score, 0);
  assert.equal(r.stats.words, 0);
});

test("a structured, specific answer scores well", () => {
  const r = analyzeAnswer(behavioural, STRONG_STORY);
  assert.ok(r.score >= 65, `expected >= 65 but got ${r.score}`);
  assert.deepEqual(r.star, { situation: true, task: true, action: true, result: true });
  assert.ok(r.stats.numbers >= 2);
});

test("a vague answer scores low and gives advice", () => {
  const r = analyzeAnswer(behavioural, "um I don't know, like, it was fine, you know, basically okay");
  assert.ok(r.score < 35, `expected < 35 but got ${r.score}`);
  assert.ok(r.improvements.length >= 2);
  assert.ok(r.stats.fillers >= 3);
});

test("better answers always outscore vaguer ones", () => {
  const strong = analyzeAnswer(behavioural, STRONG_STORY).score;
  const weak = analyzeAnswer(behavioural, "It was fine, we talked about it.").score;
  assert.ok(strong > weak);
});

test("technical answers are scored on key ideas, not STAR", () => {
  const good = analyzeAnswer(
    technical,
    "RAG is like an open book exam. First the system does a search to retrieve the right documents, because the model alone may not know your data. " +
      "Then it adds that context to the prompt, for example a policy paragraph, so the model can answer from real knowledge.",
  );
  const poor = analyzeAnswer(technical, "It is a thing with AI that helps answer stuff.");
  assert.equal(good.star, null);
  assert.ok(good.score > poor.score + 20, `good ${good.score} vs poor ${poor.score}`);
  assert.ok(good.missingKeywords.length < technical.keywords.length);
});

test("breakdown values never exceed their maximum", () => {
  const r = analyzeAnswer(behavioural, STRONG_STORY);
  for (const part of r.breakdown) assert.ok(part.value >= 0 && part.value <= part.max, part.label);
  assert.ok(r.score >= 0 && r.score <= 100);
});

test("verdict thresholds", () => {
  assert.equal(verdict(90).label, "Outstanding");
  assert.equal(verdict(75).label, "Strong");
  assert.equal(verdict(55).label, "Getting there");
  assert.equal(verdict(10).label, "Needs work");
});
