# LLMUtils — YC-Level Transformation Roadmap

> **Pitch**: LLMUtils is the toolbar that lives inside ChatGPT, Claude, and Cursor —
> the way Grammarly lives inside your text fields.

---

## Diagnosis

| Problem | Evidence |
|---|---|
| Tools-graveyard (15 tools, weak PMF) | Low WAU/DAU ratio, churn after first visit |
| No moat | Every tool is one ChatGPT plugin away from obsolescence |
| Vapor features | "Pipeline Continuity" on pricing page doesn't exist |
| Wrong pricing wedge | $9/mo individual too cheap to signal enterprise, too expensive to be impulse |
| No distribution | Zero SEO, zero OSS flywheel, zero extension distribution |

---

## Strategic Bet (chosen path)

**Extension-first → SDK → PII Gateway**

1. Chrome extension lives inside ChatGPT/Claude/Cursor (Grammarly distribution play)
2. `npm i llmutils` CLI for AI engineers (OSS flywheel + GitHub stars)
3. `gateway.llmutils.co` PII-sanitizing OpenAI-compatible proxy (enterprise moat)

---

## Kill List (do this first)

| Item | Action |
|---|---|
| Transcribe | Hide from sidebar/dashboard |
| Image OCR | Hide from sidebar/dashboard |
| Un-Sanitizer | Hide from sidebar/dashboard |
| HTML to JSX | Hide from sidebar/dashboard |
| Code Minifier | Hide from sidebar/dashboard |
| CSV to JSON | Hide from sidebar/dashboard |
| Markdown Preview | Hide from sidebar/dashboard |
| "Pipeline Continuity" | Remove from pricing until built |
| $9/mo individual plan | Replace with $19 individual + $29/user/mo team |
| Generic hero copy | Replace with outcome statement + demo video |

---

## Core 7 Tools (keep, sharpen)

1. **Markdown** — Web to Markdown (LLM context prep)
2. **Sanitize** — PII remover before sending to AI
3. **Token Estimator** — Cost awareness, multi-model
4. **Diff (Prompt Compare)** — A/B prompt testing
5. **Chat Exporter** — Save AI conversations
6. **JSON** — Unstructured → JSON (schema hint)
7. **Regex** — English to Regex

---

## Phase 1 — Days 0–30: Web App Wedge

### Code tasks
- [x] Pro fine-tuning on all 15 tools (done in prior session)
- [ ] Slim sidebar/dashboard to 7 core tools
- [ ] Rewrite marketing hero: outcome statement + demo CTA
- [ ] Update pricing: Free / $19 individual / $29 user/mo team
- [ ] Remove "Pipeline Continuity" from pricing
- [ ] `saved_prompts` table (Supabase migration 0003)
- [ ] `/api/prompts` POST + GET routes
- [ ] "Save prompt" button on Markdown, Sanitize, Token Estimator, Regex, Diff
- [ ] `/prompts` library page (list, copy, delete, tag)
- [ ] Add Prompts Library to sidebar nav

### Distribution tasks (manual / external)
- [ ] Record 60-second demo screencast (Loom)
- [ ] Post to Product Hunt with screencast as first asset
- [ ] Post to HN Show HN + r/ChatGPT
- [ ] Set up Plausible/PostHog for WAU/MAU, D7 retention

### Success metrics (by day 30)
- 500 signed-up users
- D7 retention ≥ 20%
- 10+ saved prompts per active user

---

## Phase 2 — Days 31–60: OSS + Team

### Code tasks
- [ ] `npm i llmutils` CLI package (MIT, separate repo)
  - `llmutils sanitize -f prompt.txt`
  - `llmutils tokens --model gpt-4o`
  - `llmutils export-chat --format md`
- [ ] VS Code / Cursor extension skeleton
- [ ] Team plan in Stripe ($29/user/mo, seat-based)
- [ ] `team_members` table + email invite flow
- [ ] Shared prompt library (team-scoped saved_prompts)
- [ ] `/top-prompts` public SEO page (opt-in aggregated prompts)
- [ ] Gate Pro fine-tuning behind team plan (remove individual gate)

### Distribution tasks
- [ ] AI Engineering blog (2 posts/week on llmutils.co/blog)
  - "How to estimate GPT-4o costs before you send"
  - "PII in your prompts: what leaks and how to fix it"
- [ ] GitHub repo for CLI (target 500 stars by day 60)
- [ ] Cold email 50 AI-engineering leads with CLI

### Success metrics (by day 60)
- CLI: 1,000 npm downloads/week
- 5 team plan customers ($145+/mo MRR each)
- 40% of new signups from organic/OSS

---

## Phase 3 — Days 61–90: Enterprise Wedge + YC App

### Code tasks
- [ ] PII Gateway: `gateway.llmutils.co/v1/openai/...`
  - OpenAI-compatible reverse proxy
  - Sanitize outbound prompt (PII → tokens)
  - Re-hydrate inbound response (tokens → original)
  - Audit log per request
- [ ] Self-host option (Docker image + Helm chart)
- [ ] SOC 2 controls checklist (data retention, access logs, encryption at rest)

### Distribution tasks
- [ ] 30 customer dev calls (fintech/health-tech engineering leaders)
- [ ] YC application (demo video as first slide)
- [ ] Conference talk proposal: "PII-safe LLM engineering" at AI Engineer Summit

### Success metrics (by day 90)
- 3 enterprise pilot customers (gateway)
- $5K+ MRR
- 40%+ MRR from team/enterprise plans
- YC application submitted

---

## Metrics Dashboard (instrument now)

| Metric | Target | By |
|---|---|---|
| WAU/MAU ratio | ≥ 50% | Week 12 |
| D7 retention | ≥ 30% | Month 2 |
| Team plan % of MRR | ≥ 40% | Month 6 |
| NPS (paying users) | ≥ 50 | Month 3 |
| Organic traffic share | ≥ 60% | Month 6 |
| CLI npm downloads/week | ≥ 1,000 | Day 60 |

---

## Pricing (updated)

| Tier | Price | Limits | Target |
|---|---|---|---|
| Free | $0 | 10 uses/tool/day, no save | Acquisition |
| Individual Pro | $19/mo | Unlimited, Pro fine-tuning, 500 saved prompts | Solo AI engineers |
| Team | $29/user/mo | Everything + shared library, audit log, invite flow | Eng teams |
| Enterprise | Custom | Gateway, self-host, SOC 2, SSO | Fintech/health-tech |

---

## Chrome Extension (Phase 1 parallel track)

Extension injects into: ChatGPT, Claude, Gemini, Cursor, Perplexity

Features:
1. Live token meter (shows cost as you type)
2. "Sanitize before send" button (calls `/api/tools/sanitize`)
3. "Save this prompt" → syncs to /prompts library
4. "Export this chat" → md/PDF via chat-exporter logic

Auth: shared Supabase session (same domain cookies or API key)

---

## YC Pitch (1 sentence)

> "LLMUtils is the toolbar that lives inside ChatGPT, Claude, and Cursor —
> the way Grammarly lives inside your text fields."

**Problem**: Every developer using AI is leaking PII, burning tokens blindly, and losing their best prompts.
**Solution**: A browser-native layer that sanitizes, estimates, saves, and exports — without leaving the AI tab.
**Traction**: X users, Y saved prompts, Z teams on $29/seat.
**Ask**: $500K on $5M cap for 18 months of runway to hit enterprise.

---

*Last updated: 2026-05-09 | Branch: claude/fix-vercel-deployment-RKkDa*
