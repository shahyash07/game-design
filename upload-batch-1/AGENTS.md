<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- StaySmart progress is stored in browser localStorage via src/lib/progress.ts; game content lives in src/lib/content.ts and puzzle generators in src/lib/puzzles.ts — keep screens data-driven so a Cloud backend can replace these later.
- New puzzle rules and seeded generators live in src/lib/puzzles.ts, with exact-cover Sudoku solving delegated to @algorithm.ts/dlx; keep rule validation independent of React so it can be tested.
- New puzzle screens share src/components/games/MoreGames.tsx and the existing GameProps/GameResult contract; record completion through the game route so all games participate in daily workouts and progress.
- Use the checked entry reader in src/lib/at.ts for required puzzle array entries so malformed content fails explicitly without weakening strict indexing checks.
- Finite games read stable numbered levels from committed per-game JSON libraries through src/lib/levels.ts; author and validate additions offline with scripts/generate-levels.ts so runtime never silently replaces existing puzzles.
- Number games use fresh procedural seeds with selectable difficulty; finite-game completions and last selected levels remain in the existing progress store so saved attempts retain their original puzzle identity.
- 2048 uses the seeded 2048-engine through src/lib/game2048.ts and a dedicated Game2048 screen; keep classic rules separate from React and save results through the shared game route so unlimited rounds join daily workouts and progress.
- Accounts, profiles and daily leaderboard scores live in Lovable Cloud (profiles, daily_scores, submit_daily_score keeps each player's best per game per day); local progress stays in localStorage so guests can still play.
- Surprise Mix: the player's chosen game pool is stored in the progress store; next-game picking lives in src/lib/mix.ts and badges in src/lib/badges.ts as pure, tested functions.
- The visual theme is dark-only and driven by tokens/utilities in src/styles.css (card-block, btn-block, btn-glow, text-gradient); restyle via tokens rather than per-component colors.
- Product direction lives in PRODUCT-PLAN.md (founder decisions in section 13, build phases in section 11) with the research behind it in docs/research/. Follow the phases in order.
- Green Light (internal name `readiness`): pure logic in src/lib/readiness.ts (fixed item templates, session metrics, EWMA baseline, green/amber/grey verdict, decision journal), screen in src/components/games/GreenLight.tsx at /check, sessions stored in the progress store under `readiness`. Never render a binary ready/not-ready; green means "in your usual range". Keep the check's item structure fixed, because adaptive difficulty would break the baseline. Verdicts are recomputed from history, never stored.
- Multiple-choice games ask for a 50–100% confidence before lock-in (McqGame); attempts carry `calls` and src/lib/calibration.ts turns them into a Brier score and confident-call tallies. `thoughtFirst` is computed from calls or hint use, never hard-coded.
- Leaderboard: personal board by default; the comparison board unlocks when checkProgress() reports five checks on three days, with an off switch in localStorage (`staysmart.compare`).
- Analytics go through src/lib/analytics.ts `track()`, a no-op until window.posthog exists (Lovable PostHog connector). Events: today_started, readiness_completed, game_completed, bite_completed, paywall_viewed.
- Claims policy (PRODUCT-PLAN.md section 10): no IQ, memory, focus, impairment or "smarter" claims in copy or meta tags; describe results only relative to the user's own baseline.
- Home is the Today screen (src/routes/index.tsx: Green Light card, SmartSet, skills, decision-journal prompt); Surprise Mix lives at /mix. routeTree.gen.ts was hand-updated for /check and /mix and will be regenerated on the next build.
- Audio content has two tracks. Brain Bites (free daily, cognitive traps tied to games) and World Bites (Pro, two-minute STAR stories from other industries with a four-panel infographic rendered from JSON). The World Bite schema, STAR template, editorial checklist and two example Bites are in docs/world-bites-spec.md; every number in a Bite must trace to a listed source, and infographics are never AI-generated images.
