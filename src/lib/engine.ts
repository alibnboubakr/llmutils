// PromptScore engine — deterministic prompt analysis, runs entirely client-side.
// No API calls, no cost, instant results at any traffic volume.

export type DimensionKey =
  | "task"
  | "specificity"
  | "context"
  | "format"
  | "constraints"
  | "clarity"
  | "examples"
  | "role";

export interface Dimension {
  key: DimensionKey;
  label: string;
  weight: number;
  score: number; // 0-100
  tip: string;
}

export interface Issue {
  severity: "high" | "medium" | "low";
  title: string;
  fix: string;
}

export interface GradeResult {
  score: number; // 0-100
  grade: string; // S, A+, A ... F
  percentile: number; // 1-99
  roast: string;
  dimensions: Dimension[];
  issues: Issue[];
  improved: string;
  wordCount: number;
}

const DIMENSION_META: Record<
  DimensionKey,
  { label: string; weight: number; tip: string }
> = {
  task: {
    label: "Task definition",
    weight: 18,
    tip: "Lead with a clear action verb: write, summarize, analyze, generate…",
  },
  specificity: {
    label: "Specificity",
    weight: 15,
    tip: "Concrete details — numbers, names, quantities — beat vague asks.",
  },
  context: {
    label: "Context",
    weight: 15,
    tip: "Tell the model who you are, who it's for, and why it matters.",
  },
  format: {
    label: "Output format",
    weight: 12,
    tip: "Say what the answer should look like: length, structure, tone.",
  },
  constraints: {
    label: "Constraints",
    weight: 12,
    tip: "Boundaries (avoid X, no more than Y) cut hallucinated filler.",
  },
  clarity: {
    label: "Clarity",
    weight: 10,
    tip: 'Vague words like "something" or "nice" make the model guess.',
  },
  examples: {
    label: "Examples",
    weight: 10,
    tip: "One input→output example is the highest-leverage upgrade there is.",
  },
  role: {
    label: "Role / persona",
    weight: 8,
    tip: '"You are a senior tax lawyer…" focuses the model\'s knowledge.',
  },
};

const ACTION_VERBS =
  /\b(write|create|generate|summari[sz]e|explain|list|analy[sz]e|translate|rewrite|draft|design|build|compare|review|fix|debug|plan|outline|classify|extract|convert|improve|brainstorm|code|implement|answer|describe|recommend|suggest|calculate|evaluate|compose|edit|proofread|research|identify|develop|make|help me|give me|tell me|show me)\b/gi;

const CONTEXT_SIGNALS =
  /\b(i am|i'm|we are|we're|my |our |for a |for my |for our |audience|background|currently|i work|i have|i need this|this is for|context|the goal is|because|so that|in order to)\b/gi;

const FORMAT_SIGNALS =
  /\b(format|json|markdown|csv|table|bullet|bulleted|numbered|list|step[ -]by[ -]step|outline|heading|section|paragraph|word limit|\d+\s*(words?|sentences?|paragraphs?|bullets?|items?|lines?|pages?|characters?)|tone|style|concise|detailed|brief|short|long|structure|template|email|essay|tweet|caption|headline|subject line|in the form of)\b/gi;

const CONSTRAINT_SIGNALS =
  /\b(don'?t|do not|avoid|never|must|should not|shouldn'?t|only|exclude|without|no more than|at most|at least|limit|keep it|max(imum)?|min(imum)?|exactly|strictly|required|do n?ot include|no jargon|plain english)\b/gi;

const ROLE_SIGNALS =
  /\b(act as|you are|you're an?|as an? (expert|senior|professional|experienced|world[- ]class)|playing the role|imagine you|pretend you|take the role|persona)\b/i;

const EXAMPLE_SIGNALS =
  /\b(for example|for instance|e\.g\.|example:|examples?:|such as|like this:|input:|output:|here'?s an example|sample:)\b/i;

const VAGUE_WORDS =
  /\b(thing|things|stuff|something|somehow|whatever|etc\.?|kinda|sorta|maybe|nice|cool|good|great|better|best|awesome|interesting|some kind of|make it pop|catchy|engaging|viral|professional sounding)\b/gi;

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function countMatches(text: string, re: RegExp): number {
  const m = text.match(re);
  return m ? m.length : 0;
}

// Deterministic small hash for stable roast selection per prompt.
function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

const ROASTS: Array<{ min: number; lines: string[] }> = [
  {
    min: 92,
    lines: [
      "Certified prompt whisperer. The model is taking notes from you.",
      "This prompt could teach a masterclass. Frame it.",
      "Top-shelf. AI engineers weep with joy at prompts like this.",
    ],
  },
  {
    min: 80,
    lines: [
      "Strong work. The model knows exactly what you want — almost.",
      "Solid prompt. A couple of tweaks from elite.",
      "You clearly read the manual. Now squeeze out the last 20%.",
    ],
  },
  {
    min: 65,
    lines: [
      "Decent — but the model is doing some educated guessing.",
      "The AI can work with this. It would just prefer not to improvise.",
      "Above average, which says more about the average than about this prompt.",
    ],
  },
  {
    min: 45,
    lines: [
      "You're making the AI play 20 questions with you.",
      "Half a prompt. The model is filling in the other half with vibes.",
      "The model read this and quietly lowered its expectations.",
    ],
  },
  {
    min: 25,
    lines: [
      "This prompt is a vibe, not an instruction.",
      "Somewhere, a GPU is sighing.",
      "You wouldn't brief a coworker like this. The AI noticed.",
    ],
  },
  {
    min: 0,
    lines: [
      '"do the thing" energy. The AI is scared.',
      "This is less a prompt and more a cry for help.",
      "The model needs a hint. Any hint. Please.",
    ],
  },
];

function pickRoast(score: number, prompt: string): string {
  const band = ROASTS.find((b) => score >= b.min) ?? ROASTS[ROASTS.length - 1];
  return band.lines[hash(prompt) % band.lines.length];
}

export function gradeToLetter(score: number): string {
  if (score >= 97) return "S";
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "A-";
  if (score >= 75) return "B+";
  if (score >= 70) return "B";
  if (score >= 65) return "B-";
  if (score >= 60) return "C+";
  if (score >= 55) return "C";
  if (score >= 50) return "C-";
  if (score >= 40) return "D";
  return "F";
}

function percentileFor(score: number): number {
  // Logistic curve calibrated so a careless one-liner lands ~20-30%
  // and a structured prompt lands 85%+.
  const p = 100 / (1 + Math.exp(-(score - 55) / 12));
  return clamp(p, 1, 99);
}

export function gradePrompt(raw: string): GradeResult {
  const prompt = raw.trim();
  const words = prompt.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = prompt.split(/[.!?\n]+/).filter((s) => s.trim().length > 0);

  const scores: Record<DimensionKey, number> = {
    task: 0,
    specificity: 0,
    context: 0,
    format: 0,
    constraints: 0,
    clarity: 0,
    examples: 0,
    role: 0,
  };

  // --- Task definition ---
  const verbMatches = prompt.match(ACTION_VERBS) ?? [];
  const first15 = words.slice(0, 15).join(" ");
  if (verbMatches.length > 0) {
    scores.task = 70;
    if (ACTION_VERBS.test(first15)) scores.task += 22;
    ACTION_VERBS.lastIndex = 0;
  } else if (prompt.includes("?")) {
    scores.task = 60;
  } else {
    scores.task = 20;
  }
  // Many unrelated asks dilute focus.
  const distinctVerbs = new Set(verbMatches.map((v) => v.toLowerCase()));
  if (distinctVerbs.size > 5) scores.task -= 15;
  scores.task = clamp(scores.task);

  // --- Specificity ---
  let spec = 0;
  spec += Math.min(30, countMatches(prompt, /\d+/g) * 10);
  // Proper nouns: capitalized words not at sentence start.
  const properNouns = countMatches(prompt, /(?<=[a-z,;:]\s)[A-Z][a-zA-Z]+/g);
  spec += Math.min(20, properNouns * 7);
  spec += Math.min(15, countMatches(prompt, /["'“”‘’`]/g) * 4);
  if (wordCount >= 20) spec += 15;
  if (wordCount >= 40) spec += 10;
  if (wordCount >= 80) spec += 10;
  scores.specificity = clamp(spec);

  // --- Context ---
  const ctx = countMatches(prompt, CONTEXT_SIGNALS);
  scores.context = ctx === 0 ? 18 : ctx === 1 ? 55 : ctx === 2 ? 75 : 95;

  // --- Output format ---
  const fmt = countMatches(prompt, FORMAT_SIGNALS);
  scores.format = fmt === 0 ? 20 : fmt === 1 ? 60 : fmt === 2 ? 80 : 95;

  // --- Constraints ---
  const cons = countMatches(prompt, CONSTRAINT_SIGNALS);
  scores.constraints = cons === 0 ? 22 : cons === 1 ? 60 : cons === 2 ? 80 : 95;

  // --- Clarity ---
  let clarity = 92;
  clarity -= countMatches(prompt, VAGUE_WORDS) * 13;
  const avgSentenceLen = wordCount / Math.max(1, sentences.length);
  if (avgSentenceLen > 40) clarity -= 20;
  scores.clarity = clamp(clarity, 8, 100);

  // --- Examples ---
  scores.examples = EXAMPLE_SIGNALS.test(prompt) ? 92 : 22;

  // --- Role ---
  scores.role = ROLE_SIGNALS.test(prompt) ? 92 : 25;

  // --- Weighted total ---
  const dimensions: Dimension[] = (
    Object.keys(DIMENSION_META) as DimensionKey[]
  ).map((key) => ({
    key,
    label: DIMENSION_META[key].label,
    weight: DIMENSION_META[key].weight,
    score: scores[key],
    tip: DIMENSION_META[key].tip,
  }));

  let total =
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0) /
    dimensions.reduce((sum, d) => sum + d.weight, 0);

  // Length gates: tiny prompts can't score well no matter what they hit.
  if (wordCount < 4) total = Math.min(total, 22);
  else if (wordCount < 8) total = Math.min(total, 45);
  else if (wordCount < 12) total = Math.min(total, 62);

  const score = clamp(total);

  // --- Issues (worst weighted deficits first) ---
  const issues: Issue[] = dimensions
    .filter((d) => d.score < 70)
    .sort((a, b) => (100 - b.score) * b.weight - (100 - a.score) * a.weight)
    .slice(0, 5)
    .map((d) => ({
      severity: d.score < 35 ? "high" : d.score < 55 ? "medium" : "low",
      title: issueTitle(d.key),
      fix: d.tip,
    }));

  if (wordCount < 8) {
    issues.unshift({
      severity: "high",
      title: "Prompt is too short to be specific",
      fix: "A strong prompt is usually 30-150 words. Add the what, who, and how.",
    });
  }

  return {
    score,
    grade: gradeToLetter(score),
    percentile: percentileFor(score),
    roast: pickRoast(score, prompt),
    dimensions,
    issues: issues.slice(0, 5),
    improved: buildImproved(prompt, scores),
    wordCount,
  };
}

function issueTitle(key: DimensionKey): string {
  switch (key) {
    case "task":
      return "The task isn't stated as a clear instruction";
    case "specificity":
      return "Too few concrete details";
    case "context":
      return "No background or audience given";
    case "format":
      return "Output format left to chance";
    case "constraints":
      return "No constraints or boundaries set";
    case "clarity":
      return "Vague wording forces the model to guess";
    case "examples":
      return "No example of what 'good' looks like";
    case "role":
      return "No role or persona assigned";
  }
}

// Builds a structured upgrade of the user's prompt, adding sections
// for whatever the analysis found missing. Placeholders in [brackets]
// are for the user to fill — we never invent facts for them.
function buildImproved(
  prompt: string,
  scores: Record<DimensionKey, number>
): string {
  const parts: string[] = [];

  if (scores.role < 70) {
    parts.push(
      "You are a [role — e.g. senior copywriter / staff engineer / veteran analyst] with deep expertise in this task."
    );
  }

  const cleaned = prompt.replace(/\s+/g, " ").trim();
  parts.push(
    `## Task\n${cleaned.charAt(0).toUpperCase() + cleaned.slice(1)}`
  );

  if (scores.context < 70) {
    parts.push(
      "## Context\n- Who this is for: [audience]\n- Why I need it: [goal]\n- Key background: [1-2 facts the model must know]"
    );
  }

  if (scores.format < 70) {
    parts.push(
      "## Output format\n- [e.g. a 5-bullet summary / a table / a 300-word draft]\n- Skip preamble — give me the result directly."
    );
  }

  if (scores.constraints < 70) {
    parts.push(
      "## Constraints\n- Avoid: [anything you don't want]\n- Must include: [non-negotiables]"
    );
  }

  if (scores.examples < 70) {
    parts.push(
      "## Example of what good looks like\nInput: [a short sample]\nExpected output: [what you'd want back]"
    );
  }

  parts.push(
    "If any requirement above is ambiguous, ask me up to 3 clarifying questions before answering."
  );

  return parts.join("\n\n");
}

export const EXAMPLE_PROMPTS = {
  weak: "write a blog post about productivity",
  strong: `You are a senior content strategist for a B2B SaaS company.

## Task
Write a 800-word blog post about deep-work productivity for remote engineering managers.

## Context
- Audience: engineering managers at 50-500 person startups
- Goal: rank for "deep work for managers" and drive newsletter signups

## Output format
- H2 sections, short paragraphs, one actionable checklist
- Conversational but credible tone, no fluff

## Constraints
- Avoid generic advice like "wake up early"
- Must include 2 concrete calendar tactics

For example, a tactic like "no-meeting Wednesdays with a shared team focus block" is the level of specificity I want.`,
} as const;
