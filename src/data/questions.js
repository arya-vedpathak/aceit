/**
 * Question bank. Each question has:
 *  - type: "behavioural" (scored on STAR structure) or "technical" (scored on clarity + key ideas)
 *  - keywords: ideas a strong answer usually touches
 *  - hint: a nudge shown on demand
 *  - tip: outline of a strong answer, shown in feedback
 */
export const ROLES = [
  { id: "ai", title: "AI App Developer", emoji: "🤖", blurb: "LLMs, RAG, evaluation and shipping AI features", color: "#b6f23a" },
  { id: "web", title: "Web Developer", emoji: "🌐", blurb: "React, JavaScript, performance and layout", color: "#38bdf8" },
  { id: "hr", title: "HR and Behavioural", emoji: "💬", blurb: "Introductions, strengths, teamwork and failure", color: "#ff7a59" },
];

const behavioural = (id, text, hint, keywords, tip, category = "Behavioural") => ({
  id,
  text,
  type: "behavioural",
  category,
  hint,
  keywords,
  tip,
});

const technical = (id, text, hint, keywords, tip, category = "Technical") => ({
  id,
  text,
  type: "technical",
  category,
  hint,
  keywords,
  tip,
});

const tellMe = behavioural(
  "hr-intro",
  "Tell me about yourself.",
  "Present, past, future: who you are now, what you have done, what you want next.",
  ["student", "project", "skills", "learn", "interested", "goal", "built", "team"],
  "Keep it to about a minute. Current role or study, one or two proud projects, then why this role excites you.",
  "Introduction",
);

const failure = behavioural(
  "hr-failure",
  "Tell me about a time you failed. What did you learn?",
  "Pick a real but recoverable failure. Spend most of your time on what you changed afterwards.",
  ["mistake", "failed", "learned", "changed", "fix", "next time", "feedback", "improve"],
  "Own the mistake in one sentence, explain the fix, and show a concrete habit you changed afterwards.",
);

const conflict = behavioural(
  "hr-conflict",
  "Describe a disagreement with a teammate and how you handled it.",
  "Show that you listened first and focused on the goal, not on winning.",
  ["listened", "understand", "goal", "agree", "discussed", "compromise", "team", "result"],
  "Describe the disagreement neutrally, how you listened, what you proposed, and the outcome for the team.",
);

const deadline = behavioural(
  "hr-deadline",
  "Tell me about a time you worked under a tight deadline.",
  "Mention how you prioritised and what you cut or delegated.",
  ["deadline", "prioritised", "plan", "scope", "time", "delivered", "tasks", "focus"],
  "Name the deadline, show how you prioritised, and finish with what you delivered and when.",
);

export const QUESTIONS = {
  ai: [
    technical(
      "ai-rag",
      "Explain Retrieval-Augmented Generation (RAG) to a non-technical person.",
      "Try an analogy such as an open-book exam.",
      ["documents", "search", "retrieve", "context", "answer", "knowledge", "model", "prompt"],
      "Open-book exam: first look up the right pages (retrieve), then answer using them (generate). Mention fresher knowledge and fewer made-up answers.",
      "LLMs",
    ),
    technical(
      "ai-halluc",
      "How would you reduce hallucinations in an LLM-powered app?",
      "Think about what you give the model, how you ask, and how you check the output.",
      ["context", "retrieval", "citations", "grounding", "prompt", "evaluate", "verify", "guardrails", "temperature"],
      "Ground answers in retrieved context, ask for citations and an 'I don't know' option, lower temperature, then verify and evaluate outputs.",
      "LLMs",
    ),
    technical(
      "ai-choose",
      "What is the difference between prompt engineering, RAG and fine-tuning? When would you pick each?",
      "Compare cost, freshness of knowledge and the kind of problem each one solves.",
      ["prompt", "rag", "fine-tuning", "data", "cost", "knowledge", "style", "latency"],
      "Prompting first (cheap, fast). RAG when knowledge changes or is private. Fine-tuning for consistent style or format at scale.",
      "LLMs",
    ),
    technical(
      "ai-eval",
      "How do you check that an AI feature actually works well?",
      "Think about test sets, metrics and real user feedback.",
      ["metrics", "test", "dataset", "accuracy", "feedback", "users", "evaluation", "baseline", "human"],
      "Build a small labelled test set, define metrics, compare against a baseline, add human review and watch real user feedback.",
      "Evaluation",
    ),
    technical(
      "ai-embed",
      "What are embeddings and how does vector search work?",
      "Explain in terms of meaning turned into numbers, and finding the closest ones.",
      ["vector", "similarity", "cosine", "meaning", "index", "nearest", "text", "dimensions"],
      "Embeddings map text to vectors where similar meaning is close together. Search finds the nearest vectors using cosine similarity, often with an index.",
      "Search",
    ),
    technical(
      "ai-cost",
      "Your LLM API calls are slow and expensive in production. What do you do?",
      "Think about fewer tokens, fewer calls and faster perceived speed.",
      ["cache", "batch", "stream", "smaller model", "tokens", "latency", "cost", "rate limit"],
      "Cache repeated calls, trim prompts, use a smaller model where possible, stream responses and handle rate limits with retries.",
      "Production",
    ),
    behavioural(
      "ai-project",
      "Tell me about a project you built end to end.",
      "Cover the problem, your part, a tricky moment and the result.",
      ["built", "project", "users", "challenge", "deployed", "result", "learned", "tested"],
      "Problem, your role, one hard decision, and a measurable result such as users, speed or accuracy.",
      "Projects",
    ),
    behavioural(
      "ai-debug",
      "Tell me about the hardest bug you ever debugged.",
      "Show a method: reproduce, narrow down, fix, prevent.",
      ["bug", "reproduce", "logs", "found", "fix", "root cause", "tested", "learned"],
      "Describe the symptom, how you narrowed it down, the root cause, the fix and how you prevented a repeat.",
      "Problem solving",
    ),
    behavioural(
      "ai-why",
      "Why do you want to work in AI?",
      "Be specific: a moment or project that pulled you in.",
      ["interested", "built", "learn", "impact", "problem", "future", "projects", "curious"],
      "Start with a real moment that sparked your interest, connect it to what you built, and end with what you want to build next.",
      "Motivation",
    ),
  ],
  web: [
    technical(
      "web-react",
      "Explain how React re-renders and how you would prevent unnecessary renders.",
      "Mention state and props changes, and tools like memoisation.",
      ["state", "props", "memo", "virtual dom", "key", "callback", "render", "effect"],
      "A component re-renders when its state or props change (or its parent does). Use memo, stable callbacks, proper keys and keep state close to where it is used.",
      "React",
    ),
    technical(
      "web-url",
      "What happens when you type a URL in the browser and press Enter?",
      "Walk through it in order, from name lookup to pixels on screen.",
      ["dns", "http", "server", "request", "html", "render", "tcp", "response", "cache"],
      "DNS lookup, TCP and TLS connection, HTTP request, server response, then the browser parses HTML, loads CSS and JS, and renders the page.",
      "Browser",
    ),
    technical(
      "web-fast",
      "How do you make a web page load fast?",
      "Think about what you send, how much, and how often.",
      ["lazy", "images", "bundle", "cache", "cdn", "lighthouse", "minify", "code splitting"],
      "Compress and lazy-load images, split and minify bundles, cache with a CDN, and measure with Lighthouse before and after.",
      "Performance",
    ),
    technical(
      "web-js",
      "Explain the difference between let, const and var, and what a closure is.",
      "Cover scope and hoisting, then give a small closure example.",
      ["scope", "hoisting", "closure", "function", "block", "reassign", "variable"],
      "var is function-scoped and hoisted, let and const are block-scoped. A closure is a function that remembers variables from where it was created.",
      "JavaScript",
    ),
    technical(
      "web-responsive",
      "How would you design a layout that works well on phones?",
      "Mention mobile-first CSS and flexible units.",
      ["mobile-first", "media", "flexbox", "grid", "breakpoints", "viewport", "touch", "relative units"],
      "Design mobile-first, use flexbox and grid with relative units, add breakpoints only where the layout breaks, and size tap targets for fingers.",
      "CSS",
    ),
    behavioural(
      "web-team",
      "Tell me about a time you worked with others on a project.",
      "Be clear about what you personally did.",
      ["team", "built", "role", "shared", "reviewed", "result", "communicated", "delivered"],
      "Describe the team and goal, your specific part, how you communicated and what you shipped together.",
      "Teamwork",
    ),
    deadline,
    behavioural(
      "web-why",
      "Why do you enjoy web development?",
      "Talk about something you built and what it felt like to see it live.",
      ["built", "users", "learn", "design", "live", "projects", "interested", "creative"],
      "Share a specific moment you shipped something, why it mattered and what you want to improve next.",
      "Motivation",
    ),
  ],
  hr: [tellMe, failure, conflict, deadline,
    behavioural(
      "hr-strength",
      "What is your greatest strength? Give an example.",
      "Choose a strength that fits the job and prove it with a story.",
      ["strength", "example", "helped", "team", "result", "skill", "learned", "project"],
      "State the strength, give one short story that proves it, and say how it helps in this role.",
      "Strengths",
    ),
    behavioural(
      "hr-weakness",
      "What is a weakness you are working to improve?",
      "Pick a real weakness and show the steps you are taking.",
      ["weakness", "improve", "working", "learned", "practice", "feedback", "better", "habit"],
      "Name a real, non-critical weakness, then show the specific steps you are taking and the progress so far.",
      "Self-awareness",
    ),
    behavioural(
      "hr-hire",
      "Why should we hire you?",
      "Connect your skills, your proof and your attitude to what they need.",
      ["skills", "learn", "project", "team", "contribute", "value", "passion", "results"],
      "Match two of your strongest skills to their needs, give proof from a project, and show eagerness to learn.",
      "Closing",
    ),
    behavioural(
      "hr-future",
      "Where do you see yourself in five years?",
      "Show ambition that fits growing inside the company.",
      ["goals", "learn", "grow", "contribute", "skills", "lead", "experience", "company"],
      "Aim to grow your skills, take on bigger responsibility and contribute to the team's goals.",
      "Goals",
    ),
  ],
};

/** Shuffle with Fisher-Yates and return the first `count` questions for a role. */
export function pickQuestions(roleId, count, random = Math.random) {
  const pool = [...(QUESTIONS[roleId] ?? [])];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}
