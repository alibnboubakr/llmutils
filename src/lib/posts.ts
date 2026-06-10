// Blog content. Posts are authored in a small markdown subset rendered
// by src/components/post-body.tsx: ## h2, ### h3, - lists, **bold**,
// `code`, [links](href), and > blockquotes.

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: number; // minutes
  body: string;
}

export const POSTS: Post[] = [
  {
    slug: "prompting-best-practices",
    title: "10 Prompting Best Practices That Actually Move the Needle",
    description:
      "Most prompting advice is noise. These ten practices are the ones that consistently change output quality, ranked by impact.",
    date: "2026-06-10",
    readingTime: 7,
    body: `
Everyone has prompting tips. Most of them are folklore. After grading thousands of prompts against a fixed rubric, a clear pattern emerges: a small number of habits account for almost all of the quality difference between a frustrating AI session and a great one.

Here are the ten that matter, roughly in order of impact.

## 1. Show one example of what "good" looks like

Nothing else comes close. A single input→output example pins down tone, depth, length, and format simultaneously — things that take paragraphs to describe in the abstract. If you only adopt one habit from this list, make it this one.

> Weak: "Write product descriptions in our brand voice."
> Strong: "Write product descriptions in our brand voice. Example — Input: ceramic mug. Output: 'Your morning ritual deserves better than a sad office cup.'"

## 2. State the task as an instruction, not a topic

Models respond to verbs. "Quarterly report" is a topic; "Summarize this quarterly report into five bullets for the board" is a task. Lead with the action verb and put it in the first sentence — burying the actual ask in paragraph three measurably degrades results.

## 3. Specify the output format explicitly

If you don't say what the answer should look like, you get the model's default: a polite essay. Say "a table with three columns", "exactly 5 bullets", "JSON matching this shape", or "a 120-word paragraph". Format instructions are nearly always followed, which makes them the cheapest win available.

## 4. Give two sentences of context

The model knows nothing about your situation. Who are you? Who is the output for? What will you do with it? Two sentences of background routinely double usefulness:

> "I'm a junior analyst presenting to a non-technical VP who cares about cost, not architecture."

That single line changes vocabulary, depth, and emphasis throughout the entire response.

## 5. Use numbers instead of adjectives

"Short" means nothing; "under 100 words" means something. "A few ideas" becomes "exactly 7 ideas". Every vague quantity you replace with a number removes a guess the model would otherwise have to make — and it usually guesses differently than you would.

## 6. Set negative constraints

Telling the model what to avoid is as powerful as telling it what to do. "No buzzwords", "don't invent statistics", "avoid mentioning competitors" — each constraint closes off a failure mode you'd otherwise have to edit out by hand.

## 7. Assign a role when expertise matters

"You are a senior contract lawyer" focuses vocabulary and judgment before the first word is generated. Roles matter most for specialized domains — law, medicine, code review — and least for generic writing tasks. Cheap to add, so add it.

## 8. One prompt, one job

Prompts that ask for five unrelated things get five mediocre answers. If you need a summary, a critique, and a rewrite, run three focused prompts. Each one will be sharper than the combined version, and you can iterate on the weak one without rerunning the rest.

## 9. Invite clarifying questions

End complex prompts with: "If anything is ambiguous, ask up to 3 clarifying questions before answering." This flips the failure mode from "confidently wrong" to "asks first", which is almost always what you want for high-stakes work.

## 10. Iterate on the prompt, not the output

When a response misses, the instinct is to reply "no, make it better". Resist it. Go back and fix the prompt instead — add the constraint it violated, the context it lacked, the example it needed. Edited prompts compound; conversational patches don't carry over to next time.

## The takeaway

None of this is magic. It's the same discipline you'd use briefing a contractor: clear task, real context, concrete spec, one example. [Grade your prompt](/) against all of these automatically — it takes about a second.
`,
  },
  {
    slug: "why-prompts-fail",
    title: "7 Reasons Your AI Prompts Fail (and the Fix for Each)",
    description:
      "Generic output, ignored instructions, confident nonsense — every common prompt failure traces back to one of seven causes.",
    date: "2026-06-08",
    readingTime: 6,
    body: `
When an AI response disappoints, the model usually isn't the problem — the briefing is. Almost every bad output traces back to one of seven failure patterns, and each has a mechanical fix.

## 1. The "topic, not task" prompt

**Symptom:** you get a Wikipedia-style overview when you wanted something done.

You wrote "email marketing for SaaS" when you meant "write 3 subject lines for our churn-recovery email". The model can't tell a research request from a writing request from a brainstorm unless you say so. **Fix:** start with a verb.

## 2. Missing audience

**Symptom:** the output is technically correct but pitched at the wrong level — too basic for experts, too dense for beginners.

The model defaults to a general audience. **Fix:** one sentence — "for a technical audience of backend engineers" or "for a smart 14-year-old" — recalibrates everything.

## 3. Unstated format expectations

**Symptom:** you wanted a tight table; you got four paragraphs.

You had a format in mind and never said it. **Fix:** describe the deliverable like a spec: "a markdown table, columns: feature, cost, risk. No prose before or after."

## 4. Vague quality words

**Symptom:** you asked for "engaging" or "professional" and got generic filler.

Words like *engaging*, *catchy*, and *high-quality* are unfalsifiable — the model can't check its work against them. **Fix:** translate each into something observable. "Engaging" might mean "open with a question, use second person, sentences under 15 words."

## 5. Hidden requirements

**Symptom:** the output violates a rule you never wrote down — mentions a competitor, exceeds your word limit, uses forbidden phrasing.

You knew the constraint; the model didn't. **Fix:** maintain a constraints block in any prompt you reuse. Every time an output breaks an unwritten rule, write the rule down. Reused prompts should accumulate constraints like a test suite accumulates tests.

## 6. The kitchen-sink prompt

**Symptom:** ten requests in one prompt, and the model handles the first three well, skims the middle, and forgets the rest.

Attention is finite. **Fix:** split it. One prompt per deliverable, or explicitly number the parts and ask the model to address each one separately and completely.

## 7. Patching outputs instead of prompts

**Symptom:** by message twelve the thread is a pile of corrections, and starting over feels expensive.

Conversational fixes don't persist — next session, you start from zero. **Fix:** when an output misses, edit the original prompt to prevent that miss, and re-run. You're building a reusable asset instead of a disposable thread.

## Diagnose in one second

All seven failures show up as low scores on specific dimensions — task definition, context, format, clarity, constraints. [Run your prompt through the grader](/) and the weak dimension points straight at which of these seven is biting you.
`,
  },
  {
    slug: "few-shot-prompting-guide",
    title: "Few-Shot Prompting: The Highest-Leverage Technique in Plain English",
    description:
      "Adding one or two examples to your prompt outperforms almost every other trick. Here's why it works and exactly how to do it.",
    date: "2026-06-05",
    readingTime: 6,
    body: `
"Few-shot prompting" sounds like jargon, but it names something simple: putting one or more worked examples inside your prompt. It is, reliably, the single highest-leverage prompting technique — and most people never use it.

## Why examples beat descriptions

Language is bad at describing style. Try defining your company's tone of voice in words and you'll produce something like "friendly but professional, witty but not flippant" — a description that fits a thousand different styles.

Now show one example of an actual sentence in that voice. The ambiguity collapses. An example carries information that adjectives can't: rhythm, vocabulary, sentence length, what gets left unsaid. Models are pattern-matchers before they are instruction-followers, and an example is the densest pattern you can hand them.

## The anatomy of a few-shot prompt

The structure is just: instruction, then one or more input→output pairs, then the real input.

> Rewrite support replies in our brand voice.
>
> Input: "We can't refund that."
> Output: "I wish I had better news — that one's outside our refund window. Here's what I can do instead…"
>
> Input: "Your bug report is a duplicate."
> Output:

The model completes the pattern. Notice the last pair is left open — that's where your actual task goes.

## How many examples?

- **One example** captures format and tone. This is the 80/20 — use it everywhere.
- **Two or three examples** teach variation and edge cases: include one tricky input so the model sees how you handle the hard case, not just the easy one.
- **More than five** rarely helps for everyday work and burns context. If you need many examples, you likely want different examples, not more of them.

## Choosing good examples

The examples define the pattern, so their quality is everything:

- **Make them real.** Synthetic, idealized examples teach an idealized pattern that breaks on real input.
- **Include the hardest common case.** If your inputs are sometimes ambiguous, show one ambiguous input handled well.
- **Keep input and output adjacent and labeled.** The pairing must be unmissable: "Input:" / "Output:" labels work fine.
- **Match the length you want.** Models mirror example length closely — a 40-word example output begets 40-word responses.

## When few-shot is the wrong tool

Skip examples when the task is pure reasoning ("find the bug in this function") or when you genuinely want the model's unanchored take. Examples constrain — that's their power and their cost. For open-ended brainstorming, constraints reduce the variance you're looking for.

## The five-second upgrade

Take a prompt you reuse weekly. Find the best output it ever produced. Paste that output into the prompt as an example. You've just locked in your best result as the new baseline — and you can [check the before/after score](/) to see the difference it makes.
`,
  },
  {
    slug: "prompt-templates-for-work",
    title: "9 Copy-Paste Prompt Templates for Everyday Work",
    description:
      "Battle-tested prompt templates for summaries, emails, feedback, analysis, and meetings — with the blanks marked so you can fill and go.",
    date: "2026-06-02",
    readingTime: 8,
    body: `
Good prompts have a repeatable skeleton: role, task, context, format, constraints. These nine templates apply that skeleton to the tasks people actually do at work. Fill the [brackets], delete what you don't need, and go.

## 1. The executive summary

> Summarize the following for [a busy executive / the board]. Output exactly [5] bullets, each under [15] words, ordered by business impact. End with one line: the single decision this requires. Avoid jargon. Text follows: [paste]

The forcing functions here — bullet cap, word cap, "the single decision" — are what separate this from "summarize this".

## 2. The difficult email

> You are a communications coach. Draft an email to [recipient + relationship] about [situation]. Goals: [what you need to happen]. It must acknowledge [their perspective], stay under [150] words, and end with one concrete next step. Tone: direct but warm. Do not apologize more than once.

## 3. The honest reviewer

> Act as a skeptical [senior engineer / editor / CFO] reviewing the following [code / draft / plan]. List the 3 biggest problems, ranked by severity, each with: why it matters, and the smallest change that fixes it. Do not compliment me. Do not mention minor style issues.

"Do not compliment me" is the most underrated constraint in prompting.

## 4. The decision helper

> Help me decide between [option A] and [option B] for [goal]. My constraints: [budget / time / team]. What I value most: [criteria, ranked]. Output a comparison table, then a recommendation in exactly one sentence, then the one piece of missing information that would most change your answer.

## 5. The meeting de-brief

> Below are my raw meeting notes. Extract: 1) decisions made, 2) action items as "owner → task → deadline", 3) open questions. Anything ambiguous goes under open questions — do not guess owners or dates. Notes: [paste]

The "do not guess" clause matters: extraction prompts hallucinate structure when the source is messy.

## 6. The explainer

> Explain [concept] to [audience — e.g. "a new hire with no finance background"]. Use one concrete analogy, one real-world example, and end with the 2-sentence version they should remember. Under [200] words. No history lesson — go straight to how it works.

## 7. The devil's advocate

> I'm about to [decision]. Argue against it as a thoughtful [investor / customer / lawyer] would. Give the 3 strongest objections, each with the evidence that would prove the objection right. Then rate how worried I should be, 1-10, with one sentence of reasoning.

## 8. The rewrite

> Rewrite the following to be [clearer / warmer / half the length] while keeping every factual claim intact. Audience: [who]. Keep my voice — don't make it sound like marketing. Flag anything you removed as a bullet list at the end. Text: [paste]

The flag-what-you-removed clause turns a black-box rewrite into a reviewable diff.

## 9. The learning plan

> I want to learn [skill] well enough to [concrete goal] within [timeframe], spending [hours/week]. I already know [current level]. Build a week-by-week plan where each week has: one focus, one practical exercise, and one way to test myself. Skip theory I won't use for the goal.

## Make them yours

Each time a template's output misses, add the missing constraint to your copy — templates should accumulate your preferences over time. And before you trust a modified template, [run it through the grader](/) to catch what you dropped.
`,
  },
  {
    slug: "chatgpt-claude-gemini-prompting-differences",
    title: "Do ChatGPT, Claude, and Gemini Need Different Prompts?",
    description:
      "Mostly no — and the ways the answer is 'yes' are not the ones people expect. What actually transfers between models, and what doesn't.",
    date: "2026-05-28",
    readingTime: 6,
    body: `
A common worry: "I learned to prompt ChatGPT — do I have to relearn everything for Claude or Gemini?" The short answer is no. The long answer is more useful.

## The fundamentals transfer completely

Every major model is trained to follow instructions stated in plain language. The core craft — clear task, real context, explicit format, concrete constraints, one good example — improves output on all of them, by a lot. A prompt that scores well on fundamentals is portable: switching models with a strong prompt changes flavor, not quality.

This is the most practical fact in the whole debate. If your prompt only works on one model, the prompt is fragile — it's leaning on a model quirk instead of on clarity.

## Where models genuinely differ

The differences that matter day-to-day are defaults, not capabilities:

- **Default verbosity.** Some models pad answers with preamble and caveats by default. The fix is identical everywhere: say "no preamble, give the answer directly" — you just need it more often on some models.
- **Default formatting.** Left unguided, models differ in how eagerly they reach for headers, bullets, and bold text. If you have format preferences, state them; then the differences vanish.
- **Instruction-following strictness.** Models vary in how literally they treat constraints like exact word counts. The portable habit: make constraints checkable ("exactly 5 bullets") and verify the ones that matter.
- **Refusal boundaries.** Models draw lines in slightly different places on sensitive topics, and adding legitimate context ("I'm a nurse reviewing medication interactions") resolves most spurious refusals on all of them.

Notice the pattern: every difference is something you fix by being more explicit — which improves the prompt for every model at once.

## What about model-specific syntax?

You'll see advice about special tags, system-prompt formats, or magic phrases for particular models. Three things are true about it:

- Most of it targets API users building applications, not people typing into a chat box.
- It changes between model versions, so it ages badly.
- Its effect is small next to the fundamentals. A mediocre prompt with perfect model-specific syntax loses to a well-briefed prompt with none of it, every time.

If you're building software on an API, read your provider's prompting docs — structure genuinely helps there. If you're chatting, skip the folklore.

## The sensible workflow

- Write one strong, model-agnostic prompt: task, context, format, constraints, example.
- If you have access to multiple models, run the same prompt on two of them. The differences you observe are real data about defaults — not about your prompt.
- Patch differences with explicit instructions, not model-specific tricks, so the prompt stays portable.

## The bottom line

Learn prompting once; apply it everywhere. The skill is briefing, and a good brief is good everywhere — [check whether yours is one](/), it takes a second.
`,
  },
  {
    slug: "how-long-should-a-prompt-be",
    title: "How Long Should a Prompt Be? The 30-150 Word Rule",
    description:
      "Five-word prompts underspecify and five-hundred-word prompts bury the task. Why the sweet spot for most everyday prompts is 30-150 words.",
    date: "2026-05-24",
    readingTime: 5,
    body: `
Prompt length is the first thing our grader checks, because it's the strongest single predictor of trouble at both extremes. Across the prompts people grade, very short prompts fail by underspecification and very long ones fail by burial — and the reliable middle for everyday tasks sits around 30 to 150 words.

## Why 8 words can't work

A prompt like "write a blog post about productivity" makes the model decide your audience, angle, tone, length, and format — five decisions, each a coin flip against your actual preferences. The math is unforgiving: even if the model guesses each one acceptably 50% of the time, the chance everything lands is about 3%.

That's why short prompts feel like a slot machine. The model isn't being lazy; you delegated the brief.

## Why 500 words often backfires

The opposite failure is subtler. Very long prompts tend to contain:

- The actual task, buried in paragraph four
- Contradictory instructions the author never noticed ("be comprehensive" + "keep it brief")
- Stale context pasted from somewhere else, which the model dutifully treats as relevant

Models attend to everything you include. Irrelevant detail isn't neutral filler — it actively bends the output toward itself. A 500-word prompt where 100 words matter is a 100-word prompt with 400 words of interference.

## What the 30-150 window buys you

It's not magic — it's just the natural size of a complete brief:

- **Task** stated as an instruction: ~10-20 words
- **Context** — who you are, who it's for: ~20-40 words
- **Format and constraints**: ~15-30 words
- **One example**, when it earns its place: ~20-60 words

Add it up and a fully-specified everyday prompt lands between 60 and 150 words. Under 30, something above is missing. The window isn't a rule about words; it's a checklist wearing a word count.

## The legitimate exceptions

- **Pasted source material doesn't count.** "Summarize the following: [2,000-word article]" is a short prompt with a long attachment. The 30-150 guidance applies to your instructions, not your inputs.
- **Specs for code or data tasks** legitimately run long — schemas, edge cases, and examples are signal, not filler.
- **Quick factual questions** ("capital of Mongolia?") need no brief at all. The window applies when you're requesting work product, not facts.

## A better habit than counting words

Don't pad short prompts to hit a number — that produces long bad prompts. Instead, check completeness: task, audience, format, constraints. Word count is just the symptom; the checklist is the cause. [The grader](/) checks both at once, and tells you which part is missing rather than just that something is.
`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
