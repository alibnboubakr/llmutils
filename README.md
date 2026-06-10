# PromptScore

**How good is your prompt?** Paste any ChatGPT / Claude / Gemini prompt and get an instant 0-100 score, a roast, a dimension-by-dimension breakdown, and a rebuilt version of your prompt — free, no signup, results in milliseconds.

## Why this drives traffic

1. **One-second value loop** — the score updates live as you type. No button, no waiting, nothing to learn.
2. **Shareable scorecards** — every result gets a share link (`/s/<code>`) with a dynamic OG image (big score + grade + roast) that unfurls beautifully on X, LinkedIn, and Discord. "I scored 84 — beat it" is the viral loop.
3. **Zero marginal cost** — the scoring engine is deterministic TypeScript that runs entirely in the visitor's browser. No LLM API, no rate limits, no bill when traffic spikes. Prompts never leave the user's device (a genuine privacy selling point).
4. **Retention through utility** — the "Your prompt, rebuilt" output gives people something to copy and use immediately, so they come back before every important prompt.
5. **SEO surface** — `/guide` targets "how to write better prompts" / "prompt engineering checklist" queries and funnels into the grader.

## How scoring works

`src/lib/engine.ts` grades 8 weighted dimensions of prompt engineering:

| Dimension | Weight |
|---|---|
| Task definition | 18% |
| Specificity | 15% |
| Context | 15% |
| Output format | 12% |
| Constraints | 12% |
| Clarity | 10% |
| Examples | 10% |
| Role / persona | 8% |

Plus length gates (a 5-word prompt can't score above 45) and a percentile curve. The "rebuilt" prompt is a structured template that wraps the user's original ask and adds sections only for what the analysis found missing — with `[bracketed]` placeholders, so we never invent facts on the user's behalf.

## Stack

- Next.js 15 (App Router) + React 19 + Tailwind CSS 4
- Zero runtime dependencies beyond Next/React — no database, no auth, no API keys
- Dynamic OG images via `next/og` (`src/app/s/[code]/opengraph-image.tsx`)

## Run it

```bash
npm install
npm run dev   # http://localhost:3000
npm run build # production build
```

Optional env: `NEXT_PUBLIC_APP_URL` (defaults to `https://llmutils.co`) — used for share links, sitemap, and OG metadata.

## Launch checklist

- [ ] Deploy to Vercel, point llmutils.co at it
- [ ] Post your own scorecard on X / LinkedIn / r/ChatGPT ("most prompts score under 50 — what's yours?")
- [ ] Submit to Product Hunt + Hacker News (Show HN: the privacy angle — "runs entirely in your browser" — lands well there)
- [ ] Add analytics (Vercel Analytics is a one-liner) to watch the share-link loop
