# Reward mechanics and progress design for StaySmart

Research brief, 24 October 2026. Persona: senior game designer specialising in retention and reward psychology. Research only.

## 1. What the benchmarks actually do, by timescale

**Per action (juice, feedback)**
- Duolingo: Duo spins and bursts into flame on every streak extension; a special milestone animation on select days. That animation alone lifted new-learner D7 retention +1.7% (Duolingo blog).
- Strava: a live progress ring during a segment showing ahead/behind your personal best, then "new PR by one second" at the finish. The reward is a precise, self-referenced delta, not confetti.
- NYT WordleBot: grades each solve 0–99 on Skill and Luck versus the Times average, so two players with the same guess count get different scores. Separating skill from luck is what makes a score feel like proof rather than noise.

**Per session (scorecards, share cards)**
- Wordle: ~90 daily players on 1 Nov 2021; the emoji grid (a player's invention, adopted by Wardle in Dec 2021) took it to 300,000+ in two months. In 2025 NYT counted 46 Wordle scores shared per second and 3 million shares of one Connections puzzle (22 April). Wardle credits one-puzzle-a-day scarcity as much as the grid.
- Wordle stats panel: played, win %, current streak, max streak, guess distribution. The guess distribution is a you-versus-you histogram, not a leaderboard.
- LinkedIn Games: results screen shows solve time, how connections fared, and post/send/copy. Product manager Nicholas Pezarro: "discussions may start with scores and strategies, they often lead to bigger professional conversations." Retention has risen with each launch: 80% next-day at Tango, 84% at Zip, 86% next-day and 82% at seven days at Mini Sudoku/Wend. LinkedIn says only "millions" play daily.

**Daily (streaks, freezes, "done" moments)**
- Duolingo (primary A/B results): learners with a 7-day streak are 2.4x likelier to return next day and 3.6x likelier to finish the course. Letting a single lesson extend the streak (decoupled from the daily goal): +3.3% D14, +1% DAU; a year later 7+ day streakers were over half of DAU, up from a third. Two equippable Streak Freezes: +0.38% DAU. Weekend Amulet: +4% return a week later, 5% fewer streaks lost. Streak Wager (7-day commitment): +14% D7. Friend Streak: +22% daily-lesson completion. Mazal's first "big win" on streaks was the late-night streak-saver push.
- Softer streaks: Headspace lets you disable the run streak; Calm shows a calendar and lets you manually add a missed session; Brilliant's Streak Charge keeps the streak but awards no XP for the missed day.
- One puzzle a day is the "daily done" moment for Wordle and LinkedIn (refresh time unchanged since May 2024). NYT added "Bonus Puzzles" in Sept 2026 only after engagement leveled off (11.1B solves in 2024, 11.2B in 2025; Wordle fell from 5.3B to 4.2B plays).

**Weekly (leagues, reports)**
- Duolingo leagues: 30-person cohorts matched on prior-week engagement, 10 tiers, close Sunday, reveal Monday, no extra tasks. Result: +17% learning time, 3x the learners doing 1h/day 5 days a week, D1/D7 up significantly (Mazal, Lenny's Newsletter). The whole programme lifted CURR 21% and DAU 4.5x over four years.
- Brilliant copies it: 30 learners, 10 element-named tiers, XP resets Sunday 8pm PT.

**Long term (levels, badges, mastery)**
- Elevate EPQ (0–5000) and Lumosity LPI (five areas; needs a baseline set of games first) are proprietary and unvalidated. Duolingo Score (0–160, CEFR-anchored) gives the number meaning outside the app, now surfaced on LinkedIn profiles.
- Peloton: badge every 50 classes per discipline, kept in a trophy cabinet.
- NYT Year in Games (Dec 2025, Wrapped-style): most-played game, days on app, average Wordle guesses, longest Strands streak, morning/night-player awards, comparisons with other players. Aggregate hooks: BONGO ended 36,337 streaks on 14 May 2025; "corer" ended 5.6M on 15 Oct 2024.

## 2. What the science says, and where the ethical line is

- **Variable reward**: Skinner-schedule effects are real, and loot-box research ties variable-ratio schedules to problem-gambling symptoms (stronger in adolescents). Critics of Hooked argue the variable-reward and investment steps weaken the model's predictive power and note Google won by *reducing* reward variability; for a utility, predictable payoff beats slot-machine payoff.
- **Progress feedback**: Amabile and Kramer's progress principle (~12,000 diary entries, 238 workers, 7 companies): visible daily progress is the biggest driver of motivation; setbacks weigh roughly twice as much as progress, so never frame a bad day as a loss.
- **Loss aversion and streaks**: Silverman and Barasch (JCR 2023, seven studies) show an intact logged streak raises subsequent engagement and a broken one lowers it; the drop is worse when the user blames themselves and smaller when repair is possible. Barasch: messaging that highlights a recent failure "typically doesn't work."
- **Goal gradient and endowed progress**: Kivetz, Urminsky and Zheng (2006): coffee buyers accelerate as they near the free cup, a 12-stamp card with 2 pre-stamped beats a 10-stamp card, and acceleration predicts retention. Nunes and Drèze (2006) named the endowed-progress effect.
- **Fresh starts**: Dai, Milkman and Riis (2014): goal pursuit spikes after temporal landmarks (Monday, new month, birthday).
- **Feel-good moments**: Fogg's "shine" (celebrate within seconds of the behaviour) and the peak-end rule (experiences are remembered by peak and ending; Redelmeier's colonoscopy patients returned more often after a gentler ending). The end screen is the memory.
- **Overjustification**: Deci, Koestner and Ryan's 1999 meta-analysis found expected tangible rewards undermine intrinsic motivation while informational feedback enhances it. Hamari et al. (2014) found gamification works but is context-dependent with novelty decay. Prefer rewards that are *information about yourself* (PBs, trends) over currency.

**Ethical vs dark pattern**
- Eyal's own test: would you use it yourself, and does it materially improve the user's life. CHT's frame: treat human psychology as a design constraint, optimise for user goals not screen time.
- Regulators: FTC "Bringing Dark Patterns to Light" (2022); ICO/CMA joint paper on harmful online choice architecture (harmful nudges and sludge, confirmshaming, biased framing, bundled consent, defaults), with CMA fines up to 10% of global turnover under the DMCC Act; ICO Children's Code standard 13 bars nudges exploiting "need for affirmation"; the EU Digital Fairness Act (proposal due Q4 2026) explicitly targets "addictive design", and the CMA has probed Temu/Shein game-like rewards; New York's SAFE for Kids Act (in force 25 Jan 2027) and California SB 976 ban overnight notifications to minors without parental consent. Advocacy filings to the FTC single out Snapstreaks. Snapchat's paid streak restores drew backlash: monetising loss aversion is the line.
- Most relevant precedent for StaySmart: Lumosity paid the FTC $2M in 2016 for unsubstantiated claims that games improve work performance and delay decline. Report patterns in the user's own data; never claim cognitive gains.

Practical rules: streaks pausable and repairable for free, never the sole progress signal; no guilt copy; no night pushes; rewards as feedback, not currency; no causal "smarter" claims.

## 3. Proving improvement to a results-oriented user

- **Baseline before verdict**: Oura compares a 14-day weighted average with a 2-month baseline and shows a crown at 85+; Garmin uses a 7-day rolling HRV status; Apple Fitness Trends compares the last 90 days with the last 365 and shows an up/down arrow per metric, needs 180 days of data, and attaches coaching when an arrow turns down. Lumosity withholds LPI until enough games are played. Copy this: "not enough data yet" is more credible than a fake number.
- **Personal bests as the headline**: Strava's live PB ring and "PR by one second"; Peloton's PR. The smallest honest delta beats a vague badge.
- **Skill versus luck**: WordleBot-style attribution lets a sceptic trust the score.
- **Percentile versus your own history**: "today beat 78% of your last 30 rounds" (Oura logic), not versus strangers.
- **External anchor**: Duolingo Score to CEFR shows a number gains credibility when tied to a reference outside the app.
- **Weekly deltas and recaps**: arrow per skill, Monday delivery (fresh-start effect), annual Wrapped-style recap. Show medians (noisy games), split speed from accuracy, and celebrate on the end screen (peak-end).

## 4. Three concrete ideas for StaySmart

**1. Readiness Check (the founder's ritual, productised)**
- Three back-to-back 30-second Number Sprint rounds (user can pick any timed game). Verdict rule mirrors the founder: Ready if round time holds or drops each round within a tolerance band; otherwise "Warm up one more". Validated repeated-measures precedent: NASA's PVT+ runs three short reaction sessions a day against a personal baseline.
- Score 0–100 against the user's own 14-check median (Oura style), crown at personal-best readiness, "building your baseline" for the first five checks.
- Decision tag: before the check the user names the decision ("pricing call"); afterwards they can rate how it went. Over weeks this yields the only honest claim worth making: "You said Ready 11 times; 9 of those decisions you rated well. Your best window is 9–10am."
- Share card: "Ready. 3 rounds, 22.4s → 21.1s → 20.6s", no game spoilers.

**2. Judgment Ledger (calibration for the "think first" thesis)**
- In Deduction, Data Detective and AI Reality Check, require an answer plus a 50–100% confidence before reveal. Track a Brier-style calibration score and show it as a weekly arrow alongside the four skill ratings.
- The feel-good moment: "High confidence, correct" gets a distinct chime and a tally ("7 confident calls right this week, 1 wrong"); overconfident misses are logged quietly, never shamed.
- Monthly "Judgment Report" (Monday delivery): calibration delta, best and worst category, one line of advice. This is novel, on-thesis, and the data StaySmart already generates.

**3. Steady Streak and You-vs-You card (replace all-or-nothing streaks)**
- Keep the daily streak but add a 28-day consistency rate as the primary number and a free auto-repair for one missed day (Silverman and Barasch: repairability blunts the drop-off). Copy never mentions loss.
- "Steady" badge when the 21-day rolling median improves in any skill, so the reward is improvement, not attendance; "PB Moment" end card with a Strava-style delta ("−0.8s vs best").
- Weekly spoiler-free share grid: four skill arrows plus consistency rate, like Wordle's grid for a results-oriented professional. Yearly "Mind Gym Wrapped" using the same data.

Not checked: Deci et al. 1999, Hamari et al. 2014, Gerlich 2025 and the Common Sense FTC filing are cited from standard references; the pages did not load this session. Duolingo and LinkedIn figures are company-reported A/B results, not independent studies. Neither app store has a known rule on streaks.

## Sources
- https://blog.duolingo.com/how-duolingo-streak-builds-habit/
- https://blog.duolingo.com/improving-the-streak/
- https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/
- https://blog.duolingo.com/product-lessons-friend-streak/
- https://blog.duolingo.com/duolingo-score/
- https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
- https://duolingo.deconstructoroffun.com/mechanics/leagues
- https://help.brilliant.org/en/articles/6399120-leagues-faq
- https://brilliant.org/help/using-brilliant/what-is-a-streak-charge
- https://help.headspace.com/hc/en-us/articles/215730567-How-does-the-run-streak-feature-work
- https://support.calm.com/hc/en-us/articles/115002473827-How-to-View-Your-Meditation-Stats-History-and-Streak-in-Calm
- https://techcrunch.com/2022/05/04/wordle-new-york-times-user-growth
- https://buildd.co/product/wordle-the-viral-sensation
- https://www.nbcnewyork.com/entertainment/entertainment-news/hardest-wordle-connections-games-2025/6436464/
- https://www.aol.com/exclusive-wordle-puzzle-ended-5-013624721.html
- https://www.amediaoperator.com/analysis/wordle-tv-show-new-york-times-games-jonathan-knight/
- https://www.forbes.com/sites/erikkain/2026/09/02/nyt-games-bonus-puzzles-wordle-in-1-connections-3x3/
- https://thetab.com/2025/12/18/nyt-games-has-launched-a-wrapped-for-wordle-and-its-other-games-heres-how-to-do-it
- https://www.tomsguide.com/news/wordlebot-is-a-new-tool-to-help-you-beat-wordle-and-its-brilliant
- https://contentmarketinginstitute.com/strategy-planning/linkedin-gaming-strategy
- https://www.socialmediatoday.com/news/linkedin-adds-another-puzzle-game-mini-sudoku/757492/
- https://www.netinfluencer.com/linkedin-bets-on-games-to-build-professional-connections-daily-habits/
- https://screensdesign.com/showcase/elevate-brain-training-games
- https://web.cs.wpi.edu/~rich/courses/imgd4600-c15/analyses/lumosity/index.html
- https://ftc.gov/news-events/press-releases/2016/01/lumosity-pay-2-million-settle-ftc-deceptive-advertising-charges
- https://udspace.udel.edu/items/42ce576b-8e1f-429a-8541-e29e48dbcfbb (Silverman & Barasch, JCR 2023)
- https://udel.edu/udaily/2024/march/power-of-streaks-motivation-jackie-silverman
- https://business.columbia.edu/sites/default/files-efs/pubfiles/1200/goalgradient.pdf
- https://msbfile03.usc.edu/digitalmeasures/jnunes/intellcont/Endowed%20Progress%20Effect-1.pdf
- https://faculty.wharton.upenn.edu/wp-content/uploads/2014/06/Dai_Fresh_Start_2014_Mgmt_Sci.pdf
- https://hbr.org/2011/05/the-power-of-small-wins
- https://ideas.ted.com/how-you-can-use-the-power-of-celebration-to-make-new-habits-stick/
- https://en.wikipedia.org/wiki/Peak%E2%80%93end_rule
- https://doi.org/10.1037/0033-2909.125.6.627 (Deci, Koestner & Ryan 1999)
- https://doi.org/10.1109/HICSS.2014.377 (Hamari, Koivisto & Sarsa 2014)
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7089530 (loot boxes and problem gambling)
- https://www.thebehavioralscientist.com/articles/hooked-how-to-build-habit-forming-products-is-wrong
- https://www.humanetech.com/humane-product-design
- https://www.ftc.gov/reports/bringing-dark-patterns-light
- https://www.drcf.org.uk/siteassets/drcf/pdf-files/harmful-design-in-digital-markets-ico-cma-joint-position-paper.pdf
- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/
- https://www.europarl.europa.eu/legislative-train/theme-protecting-our-democracy-upholding-our-values/file-digital-fairness-act
- https://ag.ny.gov/press-release/2026/attorney-general-james-and-governor-hochul-release-final-safe-kids-act-rules
- https://en.wikipedia.org/wiki/Protecting_Our_Kids_from_Social_Media_Addiction_Act
- https://www.commonsensemedia.org/sites/default/files/featured-content/files/common_sense_ftc_dark_patterns_comments_052821_0.pdf
- https://www.imore.com/apps/social-apps/snapchats-snapstreak-restore-feature-will-soon-cost-you-money-via-in-app-purchase
- https://support.ouraring.com/hc/en-us/articles/360025589793-Readiness-Score
- https://athletedata.health/guides/whoop-vs-oura-vs-garmin
- https://support.apple.com/HT205406
- https://ixd.prattsi.org/2025/09/design-critique-strava-ios-app-2/
- https://humansystems.arc.nasa.gov/groups/fatigue/download/2026-02-27-NASA-PVT+User-Guide.pdf
- https://arxiv.org/abs/2506.08872 (MIT "Your Brain on ChatGPT")
- https://www.mdpi.com/2075-4698/15/1/6 (Gerlich 2025, cognitive offloading)
