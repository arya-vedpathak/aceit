/**
 * Optional AI coaching. The user's own API key is used directly from the
 * browser and is only ever stored in this browser's localStorage.
 */
import { verdict } from "./analyze.js";

export const DEFAULT_MODEL = "claude-sonnet-5-5";
const ENDPOINT = "https://api.anthropic.com/v1/messages";

const SYSTEM = [
  "You are a warm but honest interview coach.",
  "You receive an interview question and a candidate's answer (it may come from speech-to-text, so ignore minor transcription slips).",
  "Reply with ONLY a JSON object, no markdown, using exactly these keys:",
  '{"score": number 0-100, "summary": one encouraging sentence,',
  '"strengths": [up to 3 short strings], "improvements": [up to 3 short, specific, actionable strings],',
  '"star": {"situation": bool, "task": bool, "action": bool, "result": bool},',
  '"betterAnswer": a concise stronger version of the answer in the first person, 60 to 120 words}.',
  "Be strict but fair. Score 85+ only for genuinely excellent answers.",
].join(" ");

export function buildPrompt({ role, question, answer }) {
  return `Role being interviewed for: ${role}\nQuestion type: ${question.type}\nQuestion: ${question.text}\n\nCandidate answer:\n${answer}`;
}

/** Pull the first JSON object out of a model reply, even if wrapped in prose or code fences. */
export function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("The AI reply did not contain feedback data.");
  return JSON.parse(text.slice(start, end + 1));
}

const asList = (value, max) =>
  Array.isArray(value) ? value.filter((v) => typeof v === "string" && v.trim()).slice(0, max) : [];

/** Make an untrusted model reply safe to render. */
export function normalizeFeedback(raw) {
  const score = Math.max(0, Math.min(100, Math.round(Number(raw?.score) || 0)));
  const star = raw?.star && typeof raw.star === "object"
    ? {
        situation: Boolean(raw.star.situation),
        task: Boolean(raw.star.task),
        action: Boolean(raw.star.action),
        result: Boolean(raw.star.result),
      }
    : null;
  return {
    score,
    label: verdict(score).label,
    summary: typeof raw?.summary === "string" && raw.summary.trim() ? raw.summary.trim() : verdict(score).line,
    strengths: asList(raw?.strengths, 3),
    improvements: asList(raw?.improvements, 3),
    star,
    betterAnswer: typeof raw?.betterAnswer === "string" ? raw.betterAnswer.trim() : "",
  };
}

export async function fetchAiFeedback({ apiKey, model = DEFAULT_MODEL, role, question, answer, signal }) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    signal,
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      max_tokens: 900,
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt({ role, question, answer }) }],
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.message || `AI request failed (${response.status})`);
  }
  const data = await response.json();
  const text = (data.content ?? []).map((block) => block.text ?? "").join("");
  return normalizeFeedback(extractJson(text));
}
