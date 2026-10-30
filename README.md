# AceIt: your pocket interview coach

Practise real interview questions, answer by **typing or speaking**, and get an instant score with clear, specific tips. Built mobile-first, so you can rehearse on your phone anywhere.

## Highlights

- **Three interview tracks:** AI App Developer, Web Developer, and HR / Behavioural, with 25 curated questions.
- **Speak your answers.** One tap on the mic turns speech into text using the browser's built-in recogniser, with live interim text.
- **Instant offline scoring.** No account, no key, no server. A rule-based engine scores structure, relevance, length, specifics, ownership and delivery out of 100.
- **STAR checker** for behavioural questions: it detects Situation, Task, Action and Result in your story.
- **Optional AI coach.** Add your own API key in Settings for personalised feedback and a stronger model answer. If the AI call fails, AceIt falls back to offline feedback automatically.
- **Polished, animated UI.** Drifting aurora background, glass cards, animated score gauge with count-up, progress bars, a pulsing mic, and a confetti burst for great answers.
- **Private by design.** Everything, including your key and history, lives in your browser's `localStorage`.

## How scoring works

| Part | What it rewards |
| --- | --- |
| Structure | STAR coverage (behavioural) or clear connectors like "because" and "for example" (technical) |
| Relevance | Key ideas an interviewer expects for that exact question |
| Length | A focused 60 to 220 words |
| Specifics | Numbers and concrete examples |
| Ownership | Saying "I" rather than only "we" |
| Delivery | Few filler words ("um", "basically", ...) |

Each part has its own maximum, and the total is normalised to 100.

## Tech

React 19, Vite, plain CSS (custom properties, `color-mix`, `backdrop-filter`), SVG, the Web Speech API and Node's built-in test runner.

## Run locally

```bash
npm install
npm run dev      # start the dev server
npm test         # unit tests for scoring, AI parsing and data
npm run build    # production build in dist/
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` tests, builds and publishes on every push to `main`. One-time setup: **Settings → Pages → Source → GitHub Actions**.

## Project structure

```
src/
  components/   Home, Interview, Feedback, Summary, ScoreGauge, Confetti, SettingsSheet, Aurora
  hooks/        useSpeech (speech-to-text), useCountUp
  lib/          analyze (scoring), ai (optional AI call), storage, format + tests
  data/         question bank
  styles.css    theme, glass panels, animations, mobile layout
```

## Notes

- Speech input needs a browser with the Web Speech API (Chrome, Edge, Safari). Where it is unavailable the mic button is hidden and typing still works.
- Calling an AI provider straight from the browser exposes your key to that browser, so use a key with a low spending limit.

## License

MIT
