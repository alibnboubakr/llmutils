This is an absolutely brilliant pivot. You are describing the **"Swiss Army Knife" SaaS model**—the exact same strategy that made tools like **SmallDev.tools**, **TinyHelpers**, and **Raycast** so successful. 

Instead of scattered domains making $50/month each, you build **one unified brand** that becomes the daily dashboard for AI workers. When a user realizes you have 3 tools they love, they are highly likely to pay $10/month to unlock the other 12.

Here is the blueprint for building an AI-Era Utility Suite.

---

### 🏢 The Brand & Architecture

**Brand Concept:** Something that implies a toolkit, a workspace, or a bridge to AI.
*   *Name Ideas:* `ContextKit.com`, `AIWorkbench.io`, `LLMUtils.co`, `PromptForge.dev`
*   *Let's use **ContextKit** for this example.*

**⚠️ Crucial Architecture Advice: Use Subdirectories, NOT Subdomains.**
Do not do `json.contextkit.com` and `markdown.contextkit.com`. 
*   **Why?** Subdomains split your SEO authority, require separate SSL certs, and make sharing user sessions/cookies a nightmare. 
*   **Do this instead:** Use subdirectories: `contextkit.com/json`, `contextkit.com/markdown`. 
*   **Tech Setup:** Build it as a single Next.js app. Each "tool" is just a route. This means **one deployment, one database, one user login system** for the entire suite of 15 tools.

---

### 🧰 The 15-Tool Suite (Categorized for the AI Workflow)

These tools follow the lifecycle of working with LLMs: *Input -> Processing -> Output*.

#### Phase 1: Input & Context Preparation (Getting data into LLMs)
1. **Web-to-Markdown:** Paste URL -> Get clean, LLM-friendly Markdown (strips ads/nav).
2. **Context Sanitizer:** Paste code/text -> Automatically masks API keys, PII, and passwords before pasting into ChatGPT.
3. **Token & Cost Estimator:** Paste text + select model (GPT-4, Claude 3) -> See exact token count and estimated API cost.
4. **YouTube/Podcast Transcriber:** Paste URL -> Get Whisper-generated text transcript ready for LLM context.
5. **Image/OCR to Text:** Screenshot an error or chart -> Extract text to paste into an LLM.

#### Phase 2: Formatting & Structuring (Making LLMs understand the format)
6. **Unstructured-to-JSON:** Paste messy text -> Define schema -> Get perfect JSON array.
7. **CSV/Excel to JSON/XML:** Upload file -> Instantly convert to a format LLMs understand better.
8. **Regex Generator (English to Regex):** Type "Find emails that end in .edu" -> Get the regex code.
9. **Diff Checker:** Paste Prompt V1 and Prompt V2 (or LLM Output V1 vs V2) -> See exact text differences.
10. **Code Minifier/Un-minifier:** Clean up code before sending it to the LLM so it doesn't waste tokens on whitespace.

#### Phase 3: Output & Refinement (Handling what LLMs give back)
11. **Markdown Previewer:** LLM spits out Markdown -> Render it beautifully to copy into Notion/Word.
12. **JSON Formatter & Validator:** Fix the broken JSON that LLMs sometimes output.
13. **HTML to JSX / CSS to Tailwind:** LLM gives raw HTML -> Convert it to your framework of choice.
14. **Chat Exporter:** Convert ChatGPT markdown exports into PDF, Notion, or Slides.
15. **Un-Sanitizer:** Re-place the `[REDACTED]` text from Tool #2 with the real data from the LLM's output.

---

### 🧩 The Chrome Extension: The Ultimate Growth Engine

The extension is what turns this from a "website people visit" into a "tool people can't live without."

**The Extension UX:**
*   **The Popup:** A sleek dashboard with a search bar. Type "JSON" or "Markdown" to instantly open that tool in a new tab.
*   **The Magic (Context Menus):** You highlight text on *any* webpage, right-click, and see:
    *   *ContextKit: Sanitize & Copy*
    *   *ContextKit: Convert to Markdown*
    *   *ContextKit: Count Tokens*
*   **The Sidebar (Advanced):** On ChatGPT/Claude pages, a sidebar slides out with your "Token Counter" running live as you type your prompt.

---

### 💰 The Monetization Strategy (The Bundle Model)

Because these are workflow tools for professionals (devs, marketers, AI creators), they have high willingness-to-pay if you save them 30 minutes a day.

*   **Free Tier (The Hook):** 3 uses per tool, per day. No credit card required. This gets them habituated.
*   **Pro Tier ($9/month or $69/year):** Unlimited uses across all 15 tools. Save history. Save custom schemas (e.g., your specific JSON formats).
*   **Lifetime Deal ($149 one-time):** Offer this for the first 3 months to rapidly build a community on Twitter/Reddit. Indie hackers *love* LTDs.

*Financial Math:* If you get 10,000 free users from the Chrome Store/Reddit, and just 2% convert to the $69/year Pro tier, that's **$138,000 in Annual Recurring Revenue (ARR)**. That blows Adsense out of the water.

---

### 🚀 The Execution Plan (How to not get overwhelmed)

Building 15 tools sounds like a lot. The trick is **phased launching**.

**Month 1: The MVP Trio (Build 3 Core Tools)**
1.  Set up the Next.js boilerplate with Stripe payments and user auth (Clerk/Supabase).
2.  Build **Web-to-Markdown**, **JSON Formatter**, and **Context Sanitizer**.
3.  Launch the main site marketing "The AI Utility Belt."
4.  Submit the V1 Chrome Extension with just these 3 tools.

**Month 2: The Data Tools (Add 3 More)**
1.  Add **Unstructured-to-JSON**, **Token Estimator**, and **CSV-to-JSON**.
2.  Push a Chrome Extension update adding the Token Estimator as a right-click feature.

**Month 3 & Beyond: The Community Drive**
1.  Add 2 tools per month.
2.  **The Growth Hack:** Put up a "Request a Tool" board on your site. Let users upvote what they want next. Build the highest-voted tool. When you launch it, email the people who upvoted—*they will instantly convert to paid users because you built exactly what they asked for.*

By framing it as a single, growing ecosystem rather than isolated websites, you create **lock-in**. A user might find a free JSON formatter elsewhere, but they'll pay for *ContextKit* because it has the exact 5 tools they use in their specific AI workflow, all in one place.