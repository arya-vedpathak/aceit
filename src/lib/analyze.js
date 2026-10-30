/**
 * Offline answer analysis. No network, no key needed.
 * Scores an answer out of 100 from structure, relevance, length,
 * specifics, ownership and delivery, and explains what to improve.
 */

const FILLERS = ["um", "uh", "like", "you know", "basically", "actually", "literally", "kind of", "sort of", "i mean"];

const STAR = {
  situation:
    /\b(when|while|during|last (?:year|semester|month|summer)|in college|at (?:my|a|the) (?:college|company|internship|university)|our team|the project|one time)\b/i,
  task: /\b(responsible|goal|objective|needed to|had to|tasked|challenge|problem|requirement|deadline|my job|my role)\b/i,
  action:
    /\bI (?:built|created|designed|implemented|wrote|developed|led|decided|started|fixed|analy[sz]ed|organi[sz]ed|researched|tested|optimi[sz]ed|set up|learned|used|chose|worked|reached out|asked|talked|planned|divided|debugged|reviewed|focused|prioriti[sz]ed|proposed|listened)\b/i,
  result:
    /\b(?:result(?:ed|s)?|improv(?:ed|ement)|increas(?:ed|e)|reduc(?:ed|tion)|dropped|achiev(?:ed|ement)|saved|launched|delivered|outcome|success(?:ful(?:ly)?)?|faster|learned|ended up|finally)\b|%/i,
};

const CONNECTORS =
  /\b(because|for example|for instance|e\.g\.|first(?:ly)?|second(?:ly)?|then|finally|however|trade-?off|in practice|so that|which means|such as)\b/gi;
const EXAMPLES = /\b(for example|for instance|e\.g\.|such as)\b/gi;

const count = (text, regex) => (text.match(new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g")) || []).length;
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function verdict(score) {
  if (score >= 85) return { label: "Outstanding", line: "Interview-ready. Clear, specific and well structured." };
  if (score >= 70) return { label: "Strong", line: "A solid answer. A few refinements will make it shine." };
  if (score >= 50) return { label: "Getting there", line: "Good base. Add structure and concrete details." };
  return { label: "Needs work", line: "Let's build this up. Follow the tips below and try again." };
}

function fillerCount(lower) {
  return FILLERS.reduce((sum, filler) => {
    const pattern = new RegExp(`\\b${escapeRegex(filler).replace(/ /g, "\\s+")}\\b`, "g");
    return sum + (lower.match(pattern) || []).length;
  }, 0);
}

function lengthPoints(words) {
  if (words < 20) return 2;
  if (words < 40) return 6;
  if (words < 60) return 10;
  if (words <= 220) return 15;
  if (words <= 300) return 10;
  return 6;
}

export function analyzeAnswer(question, answer) {
  const text = (answer ?? "").trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const lower = text.toLowerCase();
  const behavioural = question.type === "behavioural";

  const fillers = fillerCount(lower);
  const numbers = count(text, /\b\d+(?:\.\d+)?%?|\b\d+x\b/g);
  const examples = count(text, EXAMPLES);

  const star = {
    situation: STAR.situation.test(text),
    task: STAR.task.test(text),
    action: STAR.action.test(text),
    result: STAR.result.test(text),
  };

  const matched = question.keywords.filter((k) => lower.includes(k.toLowerCase()));
  const missingKeywords = question.keywords.filter((k) => !lower.includes(k.toLowerCase()));
  const needed = Math.max(3, Math.ceil(question.keywords.length * 0.6));
  const relevanceRatio = Math.min(1, matched.length / needed);

  const parts = [];
  if (behavioural) {
    const starCount = Object.values(star).filter(Boolean).length;
    parts.push({ key: "structure", label: "Structure (STAR)", value: starCount * 8, max: 32 });
    parts.push({ key: "relevance", label: "Relevance", value: Math.round(relevanceRatio * 15), max: 15 });
  } else {
    const connectors = Math.min(3, new Set((text.match(CONNECTORS) || []).map((c) => c.toLowerCase())).size);
    parts.push({ key: "structure", label: "Clear explanation", value: Math.min(25, connectors * 9), max: 25 });
    parts.push({ key: "relevance", label: "Key ideas covered", value: Math.round(relevanceRatio * 30), max: 30 });
  }
  parts.push({ key: "length", label: "Length", value: wordCount ? lengthPoints(wordCount) : 0, max: 15 });
  parts.push({
    key: "specifics",
    label: "Specifics",
    value: Math.min(15, numbers * 7 + examples * 6),
    max: 15,
  });
  if (behavioural) {
    const iCount = count(text, /\bI\b/g);
    const weCount = count(text, /\b(?:we|our)\b/gi);
    const ratio = iCount + weCount === 0 ? 0.5 : iCount / (iCount + weCount);
    parts.push({ key: "ownership", label: "Ownership", value: wordCount ? Math.round(ratio * 8) : 0, max: 8 });
  }
  const fillerDensity = wordCount ? (fillers / wordCount) * 100 : 0;
  const delivery = !wordCount ? 0 : fillerDensity === 0 ? 10 : fillerDensity <= 2 ? 7 : fillerDensity <= 5 ? 4 : 1;
  parts.push({ key: "delivery", label: "Delivery", value: delivery, max: 10 });

  const total = parts.reduce((s, p) => s + p.value, 0);
  const maxTotal = parts.reduce((s, p) => s + p.max, 0);
  const score = wordCount === 0 ? 0 : Math.round((total / maxTotal) * 100);

  const strengths = [];
  const improvements = [];

  if (wordCount === 0) {
    improvements.push("Write or speak an answer first, then get your feedback.");
  } else {
    if (behavioural) {
      const missing = Object.entries(star)
        .filter(([, ok]) => !ok)
        .map(([name]) => name);
      if (missing.length === 0) strengths.push("You covered the full STAR story: situation, task, action and result.");
      const advice = {
        situation: "Set the scene briefly: where and when did this happen?",
        task: "State your responsibility or the goal you had to reach.",
        action: "Describe what YOU did, step by step, using 'I'.",
        result: "End with the result: what changed? A number makes it stronger.",
      };
      missing.forEach((m) => improvements.push(advice[m]));
    } else {
      if (parts[0].value >= 18) strengths.push("Your explanation flows logically, with clear connecting words.");
      else improvements.push("Structure the answer with connectors like 'first', 'because' and 'for example'.");
    }

    if (relevanceRatio >= 0.8) strengths.push("You touched most of the key ideas interviewers listen for.");
    else if (missingKeywords.length) {
      improvements.push(`Consider covering ideas like: ${missingKeywords.slice(0, 3).join(", ")}.`);
    }

    if (wordCount < 40) improvements.push("Say a bit more. Aim for roughly 60 to 200 words (40 to 90 seconds spoken).");
    else if (wordCount > 300) improvements.push("Tighten it. Over 300 words is long for an interview answer.");
    else if (wordCount >= 60) strengths.push("Good length: detailed without rambling.");

    if (numbers === 0 && examples === 0) improvements.push("Add one concrete detail, such as a number, a tool name or an example.");
    else strengths.push("You backed your answer with specifics.");

    if (behavioural && parts.find((p) => p.key === "ownership").value <= 4) {
      improvements.push("Use 'I' more than 'we'. Interviewers want to hear your own contribution.");
    }

    if (fillers >= 3) improvements.push(`Cut filler words (${fillers} found). A short pause sounds more confident.`);
    else if (fillers === 0) strengths.push("Clean delivery with no filler words.");
  }

  const v = verdict(score);
  return {
    mode: "basic",
    score,
    label: v.label,
    summary: wordCount === 0 ? "No answer yet." : v.line,
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 4),
    breakdown: parts.map(({ label, value, max }) => ({ label, value, max })),
    star: behavioural ? star : null,
    stats: { words: wordCount, fillers, numbers },
    missingKeywords,
  };
}
