# StaySmart product plan: Green Light

Date: 2026-10-24. Status: proposal for founder decision. Evidence: six research briefs in `docs/research/` (reward design, cognitive science, audio, pricing, competition, build feasibility). Numbers quoted below come from those briefs and are company-reported or literature values unless marked otherwise.

## 1. The decision in one line

StaySmart becomes the daily app that tells a professional, against their own baseline, whether they are sharp right now, and then trains the judgment that AI erodes. The puzzles are the gym equipment. The Green Light and the Judgment Ledger are the product.

Why this and not "more games":

- Nobody scores "how you are today". LinkedIn and NYT score streaks and solve time. Lumosity and Elevate score a lifetime index. Wearables score your body with unpublished maths and no plan attached. Only a free indie app (CogniTrack) and a two-rating App Store app do a self-referenced cognitive check.
- Nobody trains AI-output checking at a daily consumer cadence, nobody gives feedback on written reasoning, and nobody in the category uses audio.
- Our eight LinkedIn clones are parity, not differentiation. LinkedIn reports 86 percent next-day return and distributes for free. We keep them as equipment and stop building more.

Positioning: *StaySmart is the daily mental gym for professionals who work alongside AI: ten minutes that tell you, against your own baseline, whether you are sharp enough to make today's call yourself, and that train the one habit AI erodes: thinking first.*

## 2. The founder's ritual, shipped honestly

The ritual: play three fast arithmetic rounds; if the time drops or holds each round, move ahead.

What the science says about that rule:

- Time dropping across three back-to-back rounds is mostly warm-up and within-session practice. Improvement is the default outcome, so the rule says "ready" almost every time. It is a confirmation ritual, not a measurement.
- The informative signal runs the other way: a session that is slower, more variable or more error-prone than your own usual range. Intra-individual variability is a more sensitive fatigue marker than mean speed.
- Speed alone is blind to "fast but sloppy" states. Caffeine speeds you up, alcohol raises errors. Accuracy must be scored.
- Personal baselines cut false positives. In 8,002 service members, two thirds of people flagged by population norms showed no change from their own baseline.

So the product keeps the feel (three rounds, your times on screen, a go or wait moment) and changes the rule underneath.

### Green Light spec

| Element | Spec |
|---|---|
| Format | 3 rounds of 15 fixed-template arithmetic items, about 30 seconds each, 45 scored items total. Keypad entry. Per-item response time logged. |
| Items | Balanced templates per round (two-digit add and subtract with and without carry, single-digit multiply). Same mix every session. No adaptive difficulty inside the check, ever. |
| Visible numbers | Round times, exactly as the founder did it: "22.4s, 21.1s, 20.6s". |
| Verdict inputs | Median correct response time, accuracy, variability (IQR over median), lapses (items slower than 2x personal median), round slope. |
| Baseline | Session 1 discarded. No verdict until 5 sessions on 3 different days in the same time band (plus or minus 2 hours). Rolling 20-session baseline, exponentially weighted. Re-baseline on device or input change. |
| Verdict rule | Each metric as a z-score against personal baseline. Flag "below usual" only when 2 of 3 core metrics are under -1 z, or any one is under -1.5 z. -0.5 to -1 is "uncertain". |
| Three states | Green: "In your usual range". Amber: "Slower or more variable than usual". Grey: "Building your baseline (3 of 5)". Never a binary Ready or Not Ready; green means "in your usual range", not "cleared to decide". |
| Next action | Always attached. Usual: "Good window. Make the call." Below: "Re-run in 20 minutes, or draft with AI now and decide after lunch." Wearables users' top complaint is a verdict without a plan. |
| Context tags | One tap before the check: slept under 6 hours, caffeine in the last hour. Shown beside the verdict, never used to override it. |
| Self-report | A one-tap "how do you feel" slider sits beside the number. If they disagree, the app says so and trusts the user. |
| Decision tag | Before the check the user names the decision ("pricing call"). 24 hours later a one-tap rating. After 10 tagged decisions the Decision Journal shows the only honest claim worth making: "You were in range 11 times; 9 of those decisions you rated well. Your best window is 9 to 10am." |
| Share card | "Green light. 3 rounds: 22.4s, 21.1s, 20.6s." No spoilers, no verdict about others. |

Claim wording: "A 90-second check of your attention and speed, compared with your own usual range." Never "detects impairment" or "know when you're ready to decide". Validate the thresholds on the first thousand real sessions against self-report before removing the "beta" label.

## 3. The daily loop (8 to 10 minutes)

The home screen becomes **Today**. Surprise Mix moves to Free Play.

1. **Brain Bite** (2 minutes, optional): one pre-question, a 90-second audio explainer with transcript, one check question.
2. **Green Light** (90 seconds).
3. **SmartSet** (5 minutes): two or three games, one from the weakest skill, one themed on today's Bite. Multiple-choice games ask for a confidence before the reveal.
4. **End card** (the memory of the session): verdict, personal-best delta ("0.8s faster than your best"), confident-calls tally, 28-day consistency, one tip, share.

The end card is where the feeling lives. The peak-end rule says people remember an experience by its peak and its ending, so the ending is designed, not assembled.

## 4. Reward architecture: sticky by design, not by trick

| Timescale | What the user feels | Mechanic | Evidence |
|---|---|---|---|
| Per answer | "That landed" | Chime and colour flash (exists). Distinct chime for "high confidence, correct". | Fogg: celebrate within seconds. |
| Per session | "I have proof" | Personal-best delta as the headline. Confidence-weighted score separates skill from luck (WordleBot logic). | Strava "PR by one second"; WordleBot skill versus luck. |
| Daily | "I showed up, and it meant something" | Green Light verdict. Streak with one free automatic repair per week. 28-day consistency rate as the primary number, streak secondary. | Duolingo: 7-day streakers 2.4x likelier to return. Silverman and Barasch 2023: repairable streaks blunt the drop after a miss. |
| Weekly | "I am moving" | Monday Judgment Report: four skill arrows, calibration arrow, consistency, one line of advice. Spoiler-free share grid of the arrows. | Fresh-start effect (Monday). Amabile: visible progress is the biggest motivator; setbacks weigh double, so never frame a bad week as a loss. |
| Monthly and yearly | "I am becoming someone" | Steady badge when a 21-day rolling median improves in any skill. Concept mastery per Bite topic. Year-end "Mind Gym Wrapped". | NYT Year in Games; Peloton trophy cabinet. |
| Social | "People I respect see it" | Personal board first (you versus your own history). The comparison leaderboard unlocks once the baseline is built and can be switched off. Friend streak and team challenges later. | Duolingo friend streak +22 percent daily completion; LinkedIn results screen drives sharing. |

Rules we will not break:

- Rewards are information about yourself, never currency. Expected tangible rewards reduce intrinsic motivation; informational feedback increases it.
- Streaks are pausable and repairable for free and are never the only progress signal. Snapchat's paid streak restores are the line we do not cross.
- No guilt copy. No "you lost your streak". No notifications between 22:00 and 07:00 local.
- No causal brain claims. Lumosity paid the FTC 2 million dollars in 2016 for exactly that.

## 5. Judgment Ledger: how "think first" becomes measurable

The original plan's north-star metric, "rationale submitted before hint", is not measurable today: the app hard-codes the think-first flag to true. Replace it with two layers.

- **Layer 1, free, every multiple-choice game.** A 50 to 100 percent confidence slider before "lock in". Brier-style calibration score. Weekly calibration arrow beside the four skills. The feel-good moment is the tally: "7 confident calls right this week, 1 wrong." Overconfident misses are logged quietly, never shamed. AI Reality Check penalises blanket scepticism, because inoculation games show players drift toward calling everything fake.
- **Layer 2, Pro, metered at 30 per month.** One sentence of reasoning before the reveal, graded 0 to 3 with a tip of at most 140 characters by a small model through the Lovable AI gateway. Cost is about seven thousandths of a cent per call.

New north star for the thesis: think-first rate (share of answers submitted with a confidence before reveal) and calibration delta over four weeks.

## 6. Personas and how the app adapts

**Buyer personas** (who we sell to, all daily users of ChatGPT, Copilot or Gemini who want proof they still have it):

- The analyst who signs off on models and dashboards.
- The product manager or team lead who prioritises on top of AI drafts.
- The consultant or finance professional who does numbers under time pressure in front of clients.

**Psychological profiles** (how the app behaves), set by a five-question onboarding adapted from validated items: chronotype (rMEQ), reaction to a visible timer, need for cognition (NCS-6), novelty seeking (BSSS-4), and what keeps you coming back (Hexad).

| Profile | Signature | Green Light presentation | Reward style |
|---|---|---|---|
| Competitor | Timer makes them sharper; motivated by records and comparison | Timer visible, personal best shown after the verdict | Leaderboards on, streaks, direct z-scores |
| Steady Thinker | Timer rattles them; perfectionism cues | Timer hidden, "warm-up" framing, accuracy shown first, private | Ranges and trends, informational feedback, no speed badges |
| Explorer | High novelty seeking | Same fixed check (measurement must not vary), but rotating games and surprise Bite topics | Unlockable content, variety over points |
| Learner | High need for cognition, motivated by learning | Check framed as calibration, richer post-session explanation | Explanation after answer, mastery maps, no tangible rewards |

Chronotype cuts across all four: the reminder lands in the user's preferred window and the baseline is kept per time band. Profiles are UX defaults the user can switch. Measure retention by profile before claiming personalisation works.

## 7. Brain Bites and World Bites: the audio layer

Standalone audio apps keep dying (Curio, Huxe, Knowable). Audio bolted onto an existing habit loop survives. Bites ride the game loop and are never a separate product.

| Element | Spec |
|---|---|
| Length | 90 seconds default, 120 cap. One concept per clip. |
| Structure | Pre-question 8s, hook with a concrete work situation 12s, three beats 50s, "the tell" (how to spot it tomorrow) 12s, check question 8s. |
| Delivery | 160 to 175 words per minute, user can speed up. Transcript and one on-screen figure always shown; audio alone is weak for number-dense material. |
| Recall | Check question immediately, re-asked at 24 hours as tomorrow's warm-up, again at about 7 days inside a themed game round. |
| Cadence | One per weekday at 06:00 local. Weekend replays the user's weakest recall. Produced in monthly batches. |
| Mapping | Each Bite maps to one or two of the 14 games. Failing a game round surfaces the matching Bite. Bite streaks count toward the game streak. |

Launch topics: base rates (why a 95 percent accurate screen is mostly wrong), Simpson's paradox, survivorship bias, verifying an AI claim, unit economics before CAC and LTV, percent versus percentage points, regression to the mean, Goodhart's law, Fermi estimation in 60 seconds, hallucinated citations and the five tells.

Production: structured brief, LLM draft, 10 to 15 minutes of human editing, Gemini Flash TTS through the Lovable gateway (about 2 cents a clip), rendered by a nightly job into Supabase Storage at immutable URLs, labelled "AI voice" (EU AI Act Article 50 applies since August 2026). AI voice only at launch. Revisit a human-narrator A/B once Bite completion data exists, because Blinkist publicly dropped AI narration in June 2026 after two years of testing. Write original explainers; cite books only as further reading, since publishers are now suing over AI summarisation.

### World Bites (Pro): two minutes from an industry that is not yours

Brain Bites train the traps behind the games. World Bites do the opposite job: they force exposure to something new every day. How a mechanical watch keeps time. How a company reached its first two million customers. Why a particular IPO is worth watching. How a hip replacement works. Voice plus a four-panel infographic, one story per weekday, and every story ends with one idea the listener can carry into their own work.

| Element | Spec |
|---|---|
| Length | 120 seconds default, 150 cap. About 300 words at 160 words per minute. |
| Structure | STAR. Hook 10s. Situation 20s (the world before). Task 15s (the problem to solve). Action 45s (how it works, or what they did). Result 20s (what changed) ending in the carry-over, one transferable idea. Check question 10s. |
| Visual | Four panels, one per STAR beat: a title, one number or key fact, one line, one icon. Rendered in-app from JSON, never AI-generated diagrams, which hallucinate detail. Mechanical and anatomy topics may carry one hand-made SVG diagram. The Result panel doubles as the share card. |
| Learning loop | Pre-question before, check question after, recall at 24 hours and 7 days, same engine as Brain Bites. |
| Categories | Rotate across: how things work (engineering, medicine), how they grew (companies and products), why it matters (market and policy events), how it runs (airports, elections, supply chains), science in plain words. The daily recommendation avoids the last three categories the user heard and prefers ones they have not explored. |
| Editorial rules | Every number comes from a named source listed on the Bite. Timely topics carry an "as of" date and expire from the recommendation after 60 days; evergreen topics are preferred three to two per week. Market and IPO stories describe what to watch, never what to buy. Original writing only. |
| Access | Pro only. Free users see the title and the Situation panel as a locked teaser, which is the second paywall surface after the Green Light result. |

Why it earns its place in Pro: it is content the games cannot give, it feeds the Explorer and Learner profiles with daily novelty, the Result panel is a natural share card, and it costs the same few cents a clip as a Brain Bite. The full schema, STAR template, editorial checklist and two drafted example Bites are in `docs/world-bites-spec.md`.

## 8. Free, Pro, Teams

| | Free | Pro | Teams |
|---|---|---|---|
| Price | 0 | 8.99 a month or 49.99 a year, 7-day trial on annual only. Launch window: Pro at 0 for everyone for the first weeks, then full price | 4 per seat per month billed annually (48 a seat a year), minimum 5 seats, self-serve to 250 |
| Today loop | Full: one Bite, Green Light verdict, 3-game SmartSet | Full | Full |
| Green Light | Verdict only, one tagged decision a week | Baseline, 30-day trend, time-of-day windows, Decision Journal, context tags | Pro for every seat |
| Games | 14 games, daily set, leaderboard | Unlimited rounds, full 365-level archive | Pro |
| Reports | Headline skill ratings, 24-hour recall | Monday Judgment Report, calibration, percentile versus your own history, Wrapped | Admin view: aggregate anonymised readiness and skill trends, never individual verdicts |
| AI feedback | None | 30 graded rationales a month | Pro, pooled |
| Bites | Today's Brain Bite with pre and check question and transcript; today's World Bite as a locked teaser (title and first panel) | Brain Bite archive, role playlists, 7 and 30-day mastery scheduling. World Bites: a two-minute STAR voice-plus-infographic story from another industry every weekday, with archive and a daily recommendation | Team packs with manager view; a World Bite discussion prompt for team channels |
| Social | Personal board, comparison board after baseline, share cards | Friend streak | Team challenges, SSO at 50 seats, invoicing |

Decisions behind the table:

- **The Pro hero is the Green Light.** It is the only addition that is differentiated, recurring, personal and near-zero marginal cost, and it is the natural Teams hook. Baseline comparison is the category's proven converter (Lumosity Insights, Peak stats, Elevate tracking all sit behind the paywall).
- **AI feedback lives inside Pro, metered, never as its own tier.** Duolingo Max at 2.3x the Super price reached only 5 to 9 percent of subscribers in two years and its hero feature is being pushed down into Super. Apps with AI features retain 36 percent worse on monthly plans.
- **Brain Bites are retention content, sampled free. World Bites are the Pro content hook.** The summary-app category collapsed to 60 to 90 dollars a year with lifetime deals, so clips alone do not carry a subscription. Paired with the Green Light trend and the reports, they give Pro a daily reason to open.
- **Paywall placement:** the results screen of the first Green Light, on day 0. The verdict is free, the baseline comparison and skill breakdown are blurred, the annual-with-trial offer sits there, with a visible "continue free" link so the leaderboard and sharing loop stay open. Ninety percent of trial starts happen on day 0 across the industry.
- **Payments:** Lovable built-in payments at launch, with the Pro plan priced at 0 during the launch window and the real prices after. Move to an own Stripe account later as a single cut-over: Lovable's built-in path cannot run beside own Stripe and blocks remixing while it is on. Billing sits behind one `subscriptions` table and one `usePro()` hook so the cut-over only swaps the writer.
- **Price logic:** sits inside the Education annual median (44.99) and the brain-training band (35 to 60). Higher price points earn about twice the lifetime value of mid ones. No store fee on web, so test 59.99 a year in month three.
- **Teams is sold to L&D and team leads of AI-heavy functions, not HR wellness and never as impairment screening.** Fitness-for-duty vendors charge 300 to 650 dollars per employee but only under a safety driver that knowledge work lacks, and declaring someone unfit is legal exposure we do not want.

Planning benchmarks: trial-to-paid about 37 percent (health and fitness median), download-to-paid about 3 percent, 72 percent of annual subscribers cancel within year one, 35 percent of annual cancellations happen in month one.

## 9. Metrics

- **North star:** share of weekly actives who complete a Green Light and at least one game on 4 or more days a week.
- **Habit:** D1, D7, D30 return; distribution of 28-day consistency rate.
- **Thesis:** think-first rate; calibration delta over four weeks; Decision Journal entries per Pro user.
- **Green Light validity:** agreement between verdict and self-report; flag rate; share of users who reach the 5-session baseline.
- **Money:** day-0 trial starts, trial-to-paid, month-1 churn, revenue per payer.
- **Guardrails:** streak repairs used (should be common, not rare), notifications sent in quiet hours (must be zero), verdict complaints.

## 10. Claims and ethics policy

Say: "Practise mental arithmetic, logic and data reasoning." "Track your own speed and accuracy against your personal baseline." "A 90-second check of your attention and speed, compared with your own usual range." "Built on well-replicated learning techniques: retrieval practice and spaced review." "Users improve at the games they practise."

Do not say: improves memory, IQ, focus or decision-making; makes you smarter; sharpens your brain; detects impairment; know when you're ready to decide; prevents cognitive decline; proven to counter AI brain-drain; designed by neuroscientists. The "think first" thesis is a position, not a finding; present it as philosophy.

The FTC's 2016 order against Lumosity requires randomised controlled evidence for performance claims. The current `/why` page and meta descriptions need an audit against this list.

## 11. Build plan on the current code

Principles: keep TanStack Start and Supabase on Lovable Cloud. No Expo rewrite until web retention is proven. Pure logic stays in `src/lib` with vitest coverage, as the codebase already does. Content moves to the database only when it changes weekly.

### Phase 0: honesty and instrumentation (week 1)

- Confidence slider before "lock in" in `src/components/games/McqGame.tsx`. `Attempt` gains `confidence`. `thoughtFirst` is computed from it in `src/routes/play.$gameId.tsx`, not hard-coded.
- Brier calibration in a new `src/lib/calibration.ts` with a test.
- PostHog with five events (today_started, readiness_completed, game_completed, bite_completed, paywall_viewed) mounted in `src/routes/__root.tsx`, identified on sign-in, reset on sign-out. Never initialise at module scope; SSR will break.
- `ssr: false` on the routes that read localStorage (index, play, progress) to stop hydration mismatches.
- Lazy-import the level JSON per game in `src/lib/levels.ts`. The 2.6 MB currently ships to every visitor.
- Claims audit of `src/routes/why.tsx` and route meta descriptions.

### Phase 1: Green Light (weeks 2 to 4)

- `src/lib/readiness.ts`: item templates, per-session metrics, exponentially weighted 20-session baseline, z-scores, three-state verdict, Decision Journal aggregation. Full vitest coverage, including the "no verdict before 5 sessions on 3 days" rule.
- `src/components/games/ReadinessCheck.tsx`: three rounds of 15 items reusing the keypad from `MathGame.tsx`, round times on screen.
- Progress store gains `readiness: Session[]` and `decisions: Decision[]`.
- Supabase tables `readiness_sessions` and `decisions` with own-row row-level security for signed-in users. Guests stay local.
- `src/routes/index.tsx` becomes Today (Bite, Check, SmartSet). Surprise Mix moves to `/play`.
- End card in `play.$gameId.tsx`: personal-best delta, confident-calls tally, consistency, share.
- Ship with a "beta" label on the verdict.

### Phase 2: reward layer and profiles (weeks 4 to 6)

- Streak repair and 28-day consistency in `src/lib/progress.ts`; Steady badge in `src/lib/badges.ts`.
- Monday Judgment Report and share grid in `src/routes/progress.tsx`.
- Five-question onboarding stored in the progress store; Green Light presentation and reward defaults keyed by profile.
- Leaderboard: personal board (you versus your last 30 rounds) by default in `src/routes/leaderboard.tsx`; the comparison board unlocks once the 5-session baseline exists and has an off switch.

### Phase 3: Brain Bites (weeks 6 to 8)

- Tables `bites` and `bite_progress`. Server route `/api/jobs/render-bites` guarded by the existing cron-auth helper, calling the gateway's speech function in batches of five (Workers allow six outgoing connections) and uploading to Supabase Storage with a content-hash key. A 400 "already exists" is a cache hit.
- `src/components/BitePlayer.tsx` with pre-question, transcript, check question. Recall scheduling folded into `smartSet()` in `src/lib/games.ts`.
- Ten Brain Bite scripts written and edited; AI voice only, labelled as such.
- World Bites: the `WorldBite` schema from `docs/world-bites-spec.md` as a JSON store, a four-panel infographic renderer fed from JSON, a locked teaser for free users, and a daily recommendation that rotates category and skips the last three heard. The two example Bites in the spec are the first content.

### Phase 4: Pro (weeks 8 to 10)

- Lovable built-in payments with a 0-priced launch plan, a `subscriptions` table, and a `usePro()` hook that reads only that table so the later move to own Stripe is a writer swap; the paywall on the Green Light results screen.
- Progress sync: `attempts` table keyed by `(user_id, client_id)`, set-union upsert in batches of 500 after each local write, pull and union on sign-in. Keep `submit_daily_score` as is.
- Rationale grading as a server function behind `requireSupabaseAuth`, zod-validated input capped at 300 characters, small model at temperature 0 with JSON-schema output, reply validated in code, one grade per attempt key, 30 per month cap. The rationale is passed as delimited data, never as instructions.

### Phase 5: later

- Teams admin view with aggregate-only queries.
- Web push and PWA: hand-rolled manifest and a minimal service worker, since the PWA Vite plugin is incompatible with TanStack Start production builds. Subscribe only on a button tap (iOS requires it; the Lovable preview iframe blocks the prompt).
- Question banks and Bites in the database with an admin page, once content changes weekly.
- Expo mobile only if web retention clears D30 of 20 percent.

### What we stop doing

- No more LinkedIn-clone games. Fourteen is enough equipment.
- No decision dilemmas or argument builder until Judgment Ledger data shows users write rationales.
- No IQ or "smarter" language anywhere.

## 12. Risks

| Risk | Mitigation |
|---|---|
| Verdict thresholds are literature-derived, not validated for an arithmetic sprint | Ship as beta; validate against self-report on the first thousand sessions; publish the method in-app. |
| Performance or health claims draw FTC attention | Section 10 wording; audit copy before every release. |
| Lovable AI credits are a 4-credit monthly grant (about one dollar) and features stop at 402 | Enable auto top-up with a monthly cap before shipping Phases 3 and 4; handle 402 in the UI. |
| Vite 8.1.5 and rolldown 1.2.1 are pinned around a nitro build bug | Test every dependency bump as a full publish, not just dev mode. |
| AI narration underperforms human | Clips are short, where TTS weaknesses hide best; track Bite completion and run a human-narrator A/B if completion drops below 70 percent. |
| Lovable built-in payments blocks remixing and cannot run beside own Stripe | Keep billing behind one table and one hook; plan the Stripe move as a single cut-over release. |
| AI features churn faster | Keep AI inside Pro and metered; the readiness and reports carry the subscription. |
| Green Light verdict read as fitness-for-duty by an employer | Teams view is aggregate-only by design; contract language forbids individual use. |

## 13. Decisions made (2026-10-24)

1. **Name: Green Light.** Verdict colours are green (in your usual range), amber (slower or more variable than usual) and grey (building your baseline). Green never means "cleared to decide"; the copy stays "in your usual range". The internal code name stays `readiness`.
2. **Price: 8.99 a month or 49.99 a year**, full paywall built from day one. Launch window: Pro at 0 for everyone for the first few weeks, then full price. Test 59.99 a year in month three.
3. **Payments: Lovable built-in first, own Stripe later.** The built-in path cannot run beside own Stripe and blocks remixing, so the move is a one-release cut-over. Billing is isolated behind one `subscriptions` table and one `usePro()` hook so only the writer changes.
4. **Narration: AI voice only.** Revisit a human-narrator A/B once Bite completion data exists.
5. **Leaderboard: personal board first.** Every user sees their own history by default; the comparison board unlocks after the 5-session baseline and can be switched off.
6. **World Bites in Pro.** Two-minute STAR voice-plus-infographic stories from other industries, one per weekday, Pro only, with a locked first-panel teaser for free users. Spec in `docs/world-bites-spec.md`.
