# LLMUtils.co — Implementation Plan (Agency-Grade)

**Agency:** Senior Product-Led Growth (PLG) SaaS Implementation  
**Date:** May 2026  
**Tech Stack (Latest Stable):**

| Component | Original | Updated (Latest Stable) |
|-----------|----------|-------------------------|
| Framework | Next.js 14 | **Next.js 15.3** (App Router, Turbopack) |
| UI Library | shadcn/ui + Tailwind CSS | **shadcn/ui (v2) + Tailwind CSS 4.0** |
| Auth & DB | Supabase | **Supabase JS v2.49+** (latest) |
| Billing | Stripe Checkout | **Stripe Node v18+** + Stripe.js |
| Chrome Extension | Vanilla/CRX | **Plasmo v0.90** (React-based, Manifest V3) |
| State Management | — | **Zustand v5** (lightweight, TS-native) |
| Validation | — | **Zod v3** (schema validation) |
| Analytics | — | **Vercel Analytics** + **PostHog** (PLG metrics) |

---

## Phase 1: Architecture & Design System (Weeks 1-2)

### 1.1 Project Initialization
```bash
# Create Next.js 15 app with Turbopack
npx create-next-app@latest llmutils --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-turbopack

# Install core dependencies
cd llmutils
npm install @supabase/supabase-js @supabase/ssr zustand zod stripe
npm install -D @types/node
```

### 1.2 shadcn/ui + Tailwind CSS 4 Setup
```bash
npx shadcn@latest init
# Configure for dark mode default, neutral base color
# Install required components: button, input, textarea, card, dialog, dropdown-menu, command (for CMD+K), sidebar, badge, tooltip
```

### 1.3 Supabase Project Setup
- Create Supabase project at [supabase.com](https://supabase.com)
- Configure Auth providers: Google OAuth, GitHub OAuth
- Database schema (see Section 1.4)

### 1.4 Database Schema (Postgres via Supabase)
```sql
-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text default 'free' check (plan in ('free', 'pro', 'team')),
  stripe_customer_id text,
  daily_usage jsonb default '{}'::jsonb, -- { "markdown": 3, "sanitize": 5, ... }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tool usage tracking
create table public.tool_runs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  tool_slug text not null, -- 'markdown', 'sanitize', 'json', etc.
  input_preview text, -- first 100 chars
  output_preview text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Saved schemas (Pro feature)
create table public.saved_schemas (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  schema_json jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tool request/upvote (Community)
create table public.tool_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  upvotes integer default 0,
  status text default 'pending' check (status in ('pending', 'in-progress', 'shipped')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.tool_runs enable row level security;
alter table public.saved_schemas enable row level security;
alter table public.tool_requests enable row level security;

-- Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own tool runs" on public.tool_runs for select using (auth.uid() = user_id);
create policy "Users can insert own tool runs" on public.tool_runs for insert with check (auth.uid() = user_id);
create policy "Users can manage own schemas" on public.saved_schemas for all using (auth.uid() = user_id);
create policy "Anyone can view tool requests" on public.tool_requests for select using (true);
create policy "Authenticated users can create requests" on public.tool_requests for insert with check (auth.uid() = user_id);
```

### 1.5 Environment Configuration
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

NEXT_PUBLIC_APP_URL=https://llmutils.co
```

---

## Phase 2: The "Wedge" MVP Launch (Weeks 3-5)

### 2.1 MVP Tool Implementations

#### `/markdown` — Web to Markdown
- **Input:** URL input field
- **Processing:** Use `turndown` or `Jina AI Reader API` to convert HTML → Markdown
- **Output:** Rendered markdown preview + copy button
- **Free limit:** 5 uses/day

#### `/sanitize` — Context Sanitizer
- **Input:** Textarea for pasting LLM context
- **Processing:** Mask API keys (sk-..., pk-...), emails, phone numbers, custom PII patterns
- **Output:** Sanitized text with highlighted masked areas
- **Free limit:** 5 uses/day

#### `/json` — Unstructured to JSON
- **Input:** Textarea + optional JSON schema definition (Zod or JSON Schema)
- **Processing:** Use AI (OpenAI/Anthropic API) or regex-based parser to structure text
- **Output:** Formatted JSON with validation errors
- **Pro feature:** Save custom schemas
- **Free limit:** 5 uses/day, blur output after 3 lines

### 2.2 Landing Page (`/`)
- Hero section with value proposition
- Tool preview cards (3 MVP tools)
- Social proof section (waitlist counter or "Trusted by X developers")
- Pricing cards (Free vs Pro with value anchoring)
- Footer with links

### 2.3 CMD+K Command Bar
- Use `cmdk` (shadcn command component)
- Keyboard shortcut: `CMD+K` (or `CTRL+K` on Windows)
- Search tools by name/slug
- Navigate to tool page on select

---

## Phase 3: Conversion Engine (Monetization UX)

### 3.1 Stripe Integration
```typescript
// app/api/stripe/checkout/route.ts
// Create Stripe Checkout Session for Pro plan ($9/mo or $69/yr)
// Redirect to Stripe hosted checkout
// Webhook handler for subscription events
```

### 3.2 Paywall Components

#### Blur Technique (JSON output)
```tsx
// components/paywall/BlurOutput.tsx
// Show first 3 lines, blur rest with PRO badge overlay
```

#### Copy Limit Modal
```tsx
// components/paywall/CopyLimitModal.tsx
// Trigger on 6th copy attempt per day
// "You've hit your daily limit. Upgrade to Pro for unlimited copies."
```

#### History Tease
```tsx
// components/paywall/HistoryTease.tsx
// Show last 5 runs, lock older ones behind Pro modal
```

### 3.3 Pipeline Continuity (Pro Killer Feature)
- "Send output to [Tool]" buttons between tools
- Maintains context/state across tool transitions
- Only available for Pro users (check `profile.plan === 'pro'`)

---

## Phase 4: Chrome Extension — The Trojan Horse (Week 6)

### 4.1 Plasmo Extension Setup
```bash
# Create Plasmo extension
pnpm create plasmo
cd llmutils-extension
pnpm install
```

### 4.2 Extension Features

#### Context Menu Actions
- Highlight text → Right-click → "LLMUtils: Sanitize & Copy"
- Highlight text → Right-click → "LLMUtils: Convert to Markdown"
- Calls `llmutils.co/api/extension/*` endpoints

#### ChatGPT/Claude Token Counter
- Content script detects `chat.openai.com` or `claude.ai`
- Injects floating widget showing token count as user types
- Pro-only feature (requires login check)

#### Extension Login Flow
- Extension opens `llmutils.co/api/auth/extension` for OAuth
- Stores JWT in `chrome.storage`
- Free users: 3 right-click actions/day

---

## Phase 5: Expansion Flywheel (Months 2-4)

### 5.1 Batch 2 Tools (Data Formatters)
4. `/csv-to-json` — Upload CSV → Get JSON
5. `/regex` — English to Regex (use AI or regex generation lib)
6. `/diff` — Compare Prompt V1 vs V2 (text diff with highlighting)

### 5.2 Batch 3 Tools (Media & Output)
7. `/transcribe` — YouTube URL → Text (use `youtube-transcript` or Whisper API)
8. `/markdown-preview` — Render LLM markdown output
9. `/html-to-jsx` — HTML → JSX for React devs

### 5.3 Community Growth Hack
- `/request` page with form + upvote buttons
- Admin page to view/top-voted requests
- Email upvoters when their requested tool ships

---

## KPIs & Analytics Setup

### PostHog Events to Track
```typescript
// PLG Metrics
posthog.capture('tool_used', { tool: 'markdown', user_id, is_pro })
posthog.capture('signup_completed', { method: 'google' | 'github' })
posthog.capture('paywall_hit', { type: 'copy_limit' | 'blur' | 'history' })
posthog.capture('upgrade_completed', { plan: 'pro', billing: 'monthly' | 'yearly' })
```

### Dashboard Targets
1. **Activation Rate:** >40% (visitors who use a tool)
2. **Account Creation Rate:** >15% (activated → signup)
3. **Free-to-Pro Conversion:** 3-5%
4. **Expansion MRR:** Track team plan upgrades

---

## File Structure
```
llmutils/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Sidebar layout
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── markdown/page.tsx
│   │   │   ├── sanitize/page.tsx
│   │   │   ├── json/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── request/page.tsx    # Community requests
│   │   ├── (marketing)/
│   │   │   └── page.tsx            # Landing page
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── callback/route.ts
│   │   │   │   └── extension/route.ts
│   │   │   ├── tools/
│   │   │   │   ├── markdown/route.ts
│   │   │   │   ├── sanitize/route.ts
│   │   │   │   └── json/route.ts
│   │   │   └── stripe/
│   │   │       ├── checkout/route.ts
│   │   │       └── webhook/route.ts
│   │   ├── layout.tsx              # Root layout (CMD+K provider)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # shadcn components
│   │   ├── cmd-k.tsx               # Command bar
│   │   ├── sidebar.tsx             # Persistent sidebar
│   │   ├── paywall/
│   │   │   ├── blur-output.tsx
│   │   │   ├── copy-limit-modal.tsx
│   │   │   └── history-tease.tsx
│   │   └── tools/
│   │       ├── markdown-tool.tsx
│   │       ├── sanitize-tool.tsx
│   │       └── json-tool.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── stripe.ts
│   │   ├── paywall.ts              # Usage limit logic
│   │   └── utils.ts
│   └── store/
│       └── use-tool-store.ts       # Zustand store
├── public/
├── .env.local
├── next.config.ts
├── tailwind.config.ts
└── package.json

llmutils-extension/                 # Plasmo extension
├── src/
│   ├── background/
│   │   └── index.ts                # Context menu setup
│   ├── content/
│   │   ├── token-counter.ts        # ChatGPT/Claude widget
│   │   └── style.css
│   ├── popup/
│   │   └── index.tsx               # Extension popup
│   └── options/
│       └── index.tsx               # Options page
├── package.json
└── manifest.json (generated by Plasmo)
```

---

## Next Steps
1. Initialize Next.js 15 project
2. Set up Supabase project and database
3. Configure shadcn/ui + Tailwind CSS 4
4. Build CMD+K, Sidebar, Dark Mode
5. Implement MVP tools
6. Add Stripe billing
7. Build Chrome Extension
8. Launch and iterate based on PLG metrics
