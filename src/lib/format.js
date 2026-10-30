export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

export function scoreColor(score) {
  if (score >= 70) return "#b6f23a";
  if (score >= 50) return "#fbbf24";
  return "#ff7a59";
}

export function average(numbers) {
  if (!numbers.length) return 0;
  return Math.round(numbers.reduce((a, b) => a + b, 0) / numbers.length);
}

/** Plain-text report of a finished session, handy for copying or sharing. */
export function buildReport({ roleTitle, results }) {
  const avg = average(results.map((r) => r.score));
  const lines = [`AceIt practice session: ${roleTitle}`, `Average score: ${avg}/100`, ""];
  results.forEach((r, i) => {
    lines.push(`${i + 1}. ${r.question.text}`);
    lines.push(`   Score: ${r.score}/100 (${r.label})`);
  });
  return lines.join("\n");
}
