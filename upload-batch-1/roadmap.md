# More StaySmart games
- [x] Verify LinkedIn puzzle types and rules.
- [x] Add path, category, word-ladder, mini Sudoku, rectangle partition, and word-trail games.
- [x] Integrate games with free play, daily workouts, and progress.
- [x] Test puzzle rules and play through new games, including saved results and mobile layouts.

# Level libraries
- [x] Store at least 365 distinct levels for each finite game.
- [x] Add level selection, completion tracking, and unlimited number rounds.
- [x] Test catalog uniqueness, validity, and level selection end to end.
- [x] Keep level libraries in reusable files and document how to extend them.

# 2048
- [x] Add standard 2048 with keyboard, swipe, and directional controls.
- [x] Integrate unlimited rounds and saved results with existing games.
- [x] Test merge rules and verify play and saved scores.
# Leaderboard & experience
- [x] Accounts, profile with avatar, badges.
- [x] Global daily leaderboard per game; rank on result screen.
- [x] First-time onboarding, how-to-play cards, sounds and confetti.
- [x] Surprise Mix: player picks 10+ games, app deals a hidden random next game after each one.
- [x] Bold new visual design across the app.

# Green Light (PRODUCT-PLAN.md phases 0–1, built 2026-10-24)
- [x] Confidence slider before the reveal in multiple-choice games; calibration helpers and tests; thoughtFirst computed.
- [x] Green Light check: fixed item templates, session metrics, time-of-day baseline, green/amber/grey verdict, decision journal, /check screen, tests.
- [x] Today home screen (Green Light card, SmartSet, skills, decision rating prompt); Surprise Mix moved to /mix.
- [x] Personal leaderboard first; comparison board unlocks after five checks on three days.
- [x] Analytics stub (track) and copy audit against the claims policy.

# Next, in order (see PRODUCT-PLAN.md section 11)
- [ ] First build: regenerate routeTree.gen.ts, run `npm test`, add the PostHog connector, set `ssr: false` on routes that read localStorage if hydration warnings appear.
- [ ] Phase 2: streak repair (one free per week) and 28-day consistency as the primary number; Monday Judgment Report with skill and calibration arrows and a share grid; five-question onboarding profiles that set timer visibility and reward defaults.
- [ ] Phase 3: Brain Bites tables (bites, bite_progress), nightly render job through the AI gateway TTS into Storage, BitePlayer with pre-question and check question, recall at 24h and 7d inside smartSet(), "AI voice" label.
- [ ] Phase 3b: World Bites (Pro). Schema and two example Bites in docs/world-bites-spec.md; JSON store; four-panel STAR infographic renderer from JSON (no AI images); locked teaser for free users; daily recommendation that rotates category and skips the last three heard; same TTS job and recall loop as Brain Bites.
- [ ] Phase 4: Lovable payments with a 0-priced launch plan, subscriptions table, usePro() hook, paywall on the first Green Light result (verdict free, baseline blurred); attempts and readiness sync tables with own-row RLS; rationale grading server function (300-char cap, JSON-schema output, 30 per month).
- [ ] Phase 5: Teams admin view (aggregate only), web push and PWA manifest, question banks and Bites in the database with an admin page.
