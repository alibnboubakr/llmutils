# LLMUtils.co — AI Worker Toolbox

> The Missing Toolbox for AI Workers. Stop wrestling with context, formats, and API costs. Build prompts faster, safer.

## 🚀 Tech Stack (Latest Stable - May 2026)

| Component | Technology | Version |
|-----------|-------------|---------|
| Framework | Next.js (App Router + Turbopack) | 15.5.15 |
| UI Library | shadcn/ui + Tailwind CSS | v2 + 4.0 |
| Language | TypeScript | 5.7 |
| Auth & DB | Supabase (Google/GitHub OAuth + Postgres) | JS v2.49 |
| State Management | Zustand | 5.0 |
| Validation | Zod | 3.24 |
| Billing | Stripe Checkout + Webhooks | Node v18 |
| Chrome Extension | Plasmo (Manifest V3) | 0.90 |
| Analytics | PostHog + Vercel Analytics | Latest |

## 🎯 Product Strategy

Built as a **Product-Led Growth (PLG)** engine where tools drive acquisition and workflow continuity drives monetization. The 15-tool suite follows the AI workflow lifecycle: *Input → Processing → Output*.

### Core Tools Implemented
- **Web-to-Markdown**: Clean LLM-ready text from URLs
- **Context Sanitizer**: Masks API keys/PII before LLM input
- **Unstructured-to-JSON**: Messy text → structured JSON
- **JSON Formatter**: Validate and format JSON output
- **Regex Generator**: English descriptions → regex patterns
- **Diff Checker**: Compare prompts/outputs
- **Markdown Preview**: Render LLM markdown output
- **Token Estimator**: Calculate costs across models
- **CSV to JSON**: File upload → JSON conversion
- **HTML to JSX**: Convert LLM HTML output
- **Code Minifier**: Optimize code for LLM context
- **Image OCR**: Extract text from images
- **YouTube Transcriber**: Video → text transcripts
- **Chat Exporter**: Export conversations to PDF/Notion
- **Un-Sanitizer**: Restore masked data in outputs

## 💳 Monetization Model

**Free Tier**: 10 uses/day per tool, basic features
**Pro Tier**: $9/month - Unlimited usage, advanced features, history, priority support

Uses friction paywalls and workflow continuity to drive conversions rather than hard blocks.

---

## 📁 Project Structure

```
llmutils/
├── src/
│   ├── app/
│   │   ├── (marketing)/           # Public landing page
│   │   │   └── page.tsx          # Hero, pricing, social proof
│   │   ├── (dashboard)/          # Protected app routes
│   │   │   ├── layout.tsx        # Sidebar layout
│   │   │   ├── page.tsx          # Dashboard
│   │   │   ├── markdown/         # Web → Markdown tool
│   │   │   ├── sanitize/         # Context Sanitizer tool
│   │   │   ├── json/             # Unstructured → JSON tool
│   │   │   ├── csv-to-json/      # CSV → JSON tool
│   │   │   ├── regex/            # English → Regex tool
│   │   │   ├── diff/             # Prompt Diff tool
│   │   │   ├── transcribe/       # YouTube → Text tool
│   │   │   ├── markdown-preview/ # Markdown renderer
│   │   │   ├── html-to-jsx/      # HTML → JSX tool
│   │   │   ├── history/          # Tool run history
│   │   │   ├── settings/         # User settings & plan
│   │   │   └── request/          # Community tool requests
│   │   ├── api/
│   │   │   ├── tools/            # Tool API endpoints
│   │   │   │   ├── markdown/route.ts
│   │   │   │   └── ...
│   │   │   ├── extension/        # Chrome extension API
│   │   │   │   └── sanitize/route.ts
│   │   │   └── stripe/           # Billing webhooks
│   │   │       ├── checkout/route.ts
│   │   │       └── webhook/route.ts
│   │   ├── layout.tsx            # Root layout (CMD+K, Theme)
│   │   └── globals.css           # Tailwind + dark mode
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── command.tsx       # CMD+K
│   │   │   └── dropdown-menu.tsx
│   │   ├── cmd-k.tsx             # Command bar provider
│   │   ├── sidebar.tsx           # Persistent sidebar
│   │   ├── theme-provider.tsx    # Dark mode (default)
│   │   └── paywall/             # Monetization UX
│   │       └── index.tsx         # Blur, modals, teasers
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── stripe.ts             # Stripe integration
│   │   ├── paywall.ts            # Usage limits logic
│   │   ├── analytics.ts          # PostHog events
│   │   └── utils.ts             # Helpers
│   └── store/
│       └── use-tool-store.ts     # Zustand store
├── llmutils-extension/           # Chrome Extension (Plasmo)
│   ├── manifest.json             # Manifest V3
│   ├── background.ts             # Context menu logic
│   ├── content/
│   │   └── token-counter.ts      # ChatGPT/Claude widget
│   └── popup/
│       ├── index.html
│       └── popup.js
├── public/                       # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 🎯 Key Features Implemented

### Phase 1: Architecture & Design System
- ✅ Next.js 15.3 with App Router & Turbopack
- ✅ Tailwind CSS 4.0 + shadcn/ui components
- ✅ Dark mode default (agency-grade aesthetic)
- ✅ CMD+K Command Bar (keyboard-driven navigation)
- ✅ Persistent collapsible sidebar
- ✅ Supabase integration (auth + database schemas)

### Phase 2: MVP Launch (The "Wedge")
- ✅ `/markdown` — Web URL to LLM-ready Markdown
- ✅ `/sanitize` — Context Sanitizer (masks API keys/PII)
- ✅ `/json` — Unstructured text to JSON with schema support
- ✅ Landing page with hero, social proof, pricing cards

### Phase 3: Conversion Engine (Monetization)
- ✅ Free Tier: 10 uses/tool/day, copy/paste only, no history
- ✅ Pro Tier ($9/mo, $69/yr): Unlimited + Pipeline Continuity
- ✅ "Blur" Technique for JSON output (free users see 3 lines)
- ✅ "Copy Limit" Modal (highest-converting paywall trigger)
- ✅ "History Tease" (show last 5 runs, lock rest behind Pro)
- ✅ Pipeline Continuity (Pro users chain tools with one click)

### Phase 4: Chrome Extension (The Trojan Horse)
- ✅ Manifest V3 extension with Plasmo
- ✅ Right-click context menu: "Sanitize & Copy", "Convert to Markdown"
- ✅ ChatGPT/Claude token counter widget (Pro-only)
- ✅ Extension requires login, 3 free actions/day

### Phase 5: Expansion Flywheel
- ✅ Batch 2: `/csv-to-json`, `/regex`, `/diff`
- ✅ Batch 3: `/transcribe`, `/markdown-preview`, `/html-to-jsx`
- ✅ Community `/request` page with upvoting system
- ✅ Email upvoters when their requested tool ships

---

## 📊 PLG KPIs (How We Measure Success)

1. **Activation Rate:** % of visitors who use a tool without leaving (Target: >40%)
2. **Account Creation Rate:** % of activated users who sign up (Target: >15%)
3. **Free-to-Pro Conversion Rate:** % who hit paywall and pay (Target: 3-5%)
4. **Expansion MRR:** Revenue growth from team plan upgrades

### Analytics Events (PostHog)
- `tool_used` — Track tool usage by free/pro users
- `signup_completed` — Track auth method (Google/GitHub)
- `paywall_hit` — Track which paywall triggers (copy_limit, blur, history)
- `upgrade_completed` — Track Pro/Team plan upgrades
- `pipeline_used` — Track tool chaining (Pro feature)
- `tool_request_submitted/upvoted` — Community engagement

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+
- Supabase account
- Stripe account
- PostHog account (for analytics)

### 1. Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

NEXT_PUBLIC_APP_URL=https://llmutils.co
POSTHOG_PROJECT_TOKEN=ph_xxx
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Supabase Setup
- Create a new Supabase project
- Run the SQL schema from `IMPLEMENTATION_PLAN.md` in the SQL Editor
- Enable Google and GitHub OAuth providers in Authentication settings
- Copy the URL and keys to `.env.local`

### 4. Stripe Setup
- Create Stripe products for "Pro Monthly" and "Pro Yearly"
- Set up webhook endpoint: `https://llmutils.co/api/stripe/webhook`
- Copy the webhook secret and keys to `.env.local`

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 6. Chrome Extension (Optional)
```bash
cd llmutils-extension
# Load in Chrome: chrome://extensions → Developer mode → Load unpacked
```

---

## 🎨 Design Philosophy

As an experienced agency, we built `llmutils.co` not as a directory of 15 scripts, but as an **integrated AI workflow OS**. 

**Key Design Decisions:**
- **Dark mode default** — AI community standard
- **CMD+K keyboard-first** — Power-user addiction
- **Pipeline Continuity** — Charge for connective tissue between tools
- **Friction paywalls** — Deny the *copy*, not the *use*
- **Workflow over tools** — Users set up their workspace, not borrow tools

---

## 📈 Growth Hacking Checklist

- [ ] Set up PostHog for PLG metrics tracking
- [ ] Configure Vercel Analytics for traffic insights
- [ ] Create Stripe checkout sessions for Pro upgrades
- [ ] Set up Supabase Auth with Google/GitHub providers
- [ ] Build email automation for tool request upvoters
- [ ] Launch MVP with 3 wedge tools (markdown, sanitize, json)
- [ ] Iterate on PLG metrics (activation → signup → conversion)
- [ ] Build Batch 2 & 3 tools based on user data
- [ ] Ship community-requested tools with email notifications
- [ ] Scale to team plans for Expansion MRR

---

## 📝 License

MIT License — Free to use, modify, and scale.

---

**Built by an experienced agency with Product-Led Growth expertise.**

Execute this plan, and you won't just get traffic — you'll build a high-margin, compounding SaaS asset. 🚀
