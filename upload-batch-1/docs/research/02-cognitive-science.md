# Readiness ritual, learning science, claims, personalisation

Research brief, 24 October 2026. Persona: cognitive scientist and learning scientist. Research only.

## 1. Can a short arithmetic/reaction task tell you "am I sharp right now?"

**What the evidence supports**
- The gold-standard state probe is the Psychomotor Vigilance Task (PVT). Basner, Mollicone & Dinges (2011) validated a 3-minute PVT-B (inter-stimulus interval 2–5 s, lapse threshold 355 ms) in 74 adults under total and partial sleep deprivation; it tracked the 10-min PVT with medium-to-large effect sizes, though less sensitive than the full test. A 2022 adaptive version gets to ~1 min 43 s with similar sensitivity.
- PVT-B is essentially practice-free: 45 people × 16 administrations showed no systematic change in mean/median RT, speed or lapses (Sleep, 2018). This is why it works as a repeated self-check and why a learnable game is a weaker instrument.
- Lim & Dinges' meta-analysis (70 studies) found sleep loss hits *lapses of simple attention* hardest (g = −0.78) and reasoning accuracy barely at all (g = −0.13). So a simple, speeded task is the right kind of probe; arithmetic adds working-memory load and skill, which is acceptable but mixes trait into state.
- Intra-individual variability (RT spread, slowest 10%, lapses) is a more sensitive fatigue marker than mean speed. In a self-paced mental-arithmetic task, practice showed up as faster averages while fatigue showed up as *increased RT variability*. Variability also tracks time awake ("state instability").
- Caffeine: under sleep loss, large benefit to RT (g = 1.11) and modest to accuracy (g = 0.43); outside sleep loss, mostly speed. Alcohol: reliably raises errors; effects on speed vary with dose and task, i.e. it shifts the speed–accuracy curve. Both mean a speed-only score is blind to a chemically "fast but sloppy" state: accuracy must be scored.
- Fitness-for-duty products: AlertMeter (Predictive Safety) is a 60-s test with a NIOSH-funded predecessor report and one 17-person sleep-deprivation validation; its "1.5% of tests flag impairment" and intoxication claims are vendor-sourced. Creyos (ex-Cambridge Brain Sciences) sells baseline-vs-retest batteries but explicitly "not a diagnostic tool". ANAM (military) reports reliable change indices against a personal baseline; in 8,002 service members, 65.7% of people flagged by population norms showed *no change from their own baseline*, i.e. personal baselines cut false positives. Athlete tools: a smartphone reaction app (TReaction) correlated r = 0.99 with high-speed camera, but readiness products like Pison have no peer-reviewed validation.
- Practice effects: Cogstate gains are largest from session 1→2 and mostly stabilise by session 2–3; speed and memory measures can keep drifting for several sessions. Reliable-change methods (Jacobson–Truax, Chelune's practice-adjusted RCI) exist for exactly this.
- Ambulatory bursts: smartphone micro-tests averaged across occasions reach lab-grade reliability (between-person ≥ 0.97; within-person variability reliable at 0.41–0.53, Sliwinski 2018). 2–3 ultra-brief administrations suffice for a stable between-person estimate.

**What "time drops or holds steady across 3 rounds" actually measures**
- Mostly warm-up and within-session practice. Responses are slower at the start of any test and speed up; reactive inhibition dissipates between short blocks. Improvement is the *default* outcome, so the founder's rule will say "ready" almost every time: a confirmation ritual, not a measurement.
- Confounds: random problem sets differing in difficulty across rounds; speed–accuracy trade-off (pushing harder lowers time, raises errors); post-error slowing; regression to the mean; circadian time of day; caffeine; input/device latency; motivation (people can "will" a drop); long-run practice inflating the comparison; no accuracy or variability term.
- The informative signal is the opposite direction: a session that is *slower, more variable, or more error-prone than the user's own norm*, with a positive within-session slope (slowing as the session goes on) as a secondary fatigue cue.

**Rigorous design**
- Structure: one 90-s session delivered as 3 × 30-s blocks (keeps the founder's "3 rounds" feel). Fixed-difficulty item templates (e.g. 2-digit + 2-digit, no carry/carry balanced) so blocks are equivalent; no adaptive difficulty inside the ritual. Target ≥ 40 scored responses per session.
- Metrics per session: median correct-RT; accuracy; variability (coefficient of variation or IQR of correct RTs); lapse count (RT > 2× personal median); false starts; block slope (block 3 vs block 1 median).
- Baseline: discard session 1. Require ≥ 5 sessions on ≥ 3 different days, same time-of-day band (±2 h), before any verdict; 10 is better. Maintain a rolling 20-session baseline, exponentially weighted, so slow practice drift is absorbed. Re-baseline when the user changes device or input method.
- Score: z for each metric against personal baseline (mean/SD, or median/MAD for robustness). Composite = speed z (sign flipped), accuracy z, variability z. Flag "below your usual" only when ≥ 2 of 3 fall below −1 z, or any one below −1.5. Treat −0.5 to −1 as "uncertain".
- Context tags at launch (one tap each): hours slept < 6?, caffeine in last hour?, time since waking. Shown alongside the verdict, never used to override it.
- Honest presentation: three states, "In your usual range", "Slower/more variable than usual", "Not enough baseline yet". Always phrase relative to the user ("vs your last 20 sessions"), show the numbers, show the uncertainty band, and state in-app that this is a self-monitoring aid for attention and speed, not a test of judgement, safety or fitness to work. Never render "Ready / Not ready" as a binary verdict, and never imply it detects impairment.

## 2. Learning science for efficient consumption

- Retrieval practice/testing effect: g ≈ 0.50 (Rowland 2014, lab) to 0.61 (Adesope 2017, 272 effects). Feedback roughly doubles it (g 0.73 with vs 0.39 without). Multiple-choice works (Adesope found it at least as strong as short answer).
- Spacing: Cepeda et al. 2008 (1,350 participants): optimal review gap ≈ 20–40% of a 1-week retention interval, falling to ≈ 5–10% at one year. Practical: to still know it in a month, re-quiz at ~3–6 days, then ~2–3 weeks.
- Interleaving: g = 0.42 overall (Brunmair & Richter 2019, 59 studies); strongest when categories are confusable (visual material g = 0.67), small for maths. Mix StaySmart's deduction/data/AI-checking item types within a session rather than blocking them.
- Desirable difficulties (Bjork & Bjork): spacing, interleaving, testing and intermittent feedback build storage strength; difficulties are only desirable when the learner can succeed with effort.
- Pretesting/prequestions: asking 2 questions before each video segment improved later recall even though learners mostly got them wrong (Carpenter & Toftness 2017); for 20-min authentic lectures the gain was confined to the prequestioned facts (Toftness 2018). Pretesting beat post-testing by d ≈ 0.30 on expository text (Pan & Sana 2021). Rule: write the prequestions on the exact facts you want retained.
- Interpolated quizzes: questions every ~5 min of a 21-min lecture halved mind-wandering and improved retention (Szpunar 2013); later replications are mixed, but the cost is near zero.
- Audio-only: for narrative nonfiction, listening ≈ reading (Rogowsky 2016). For dense material, podcast-only listeners scored ~28% lower than readers (Daniel & Woody 2010). Comprehension survives ~1.25–1.5× speed, not more.
- Microlearning: pooled benefits in higher education (SMD 0.74) but no study isolates duration; 2–15 min is a convention. Video engagement drops sharply after ~6 min (Guo 2014, 6.9M sessions).

**Pattern that works for StaySmart audio**: 1 concept per clip, 2–4 min, 1.0× default. Pre-question (1 MCQ) → listen → 2–3 MCQ with explanation feedback → same items resurface at ~3 days and ~3 weeks, interleaved with other topics. Show the 3–5 key terms on screen during playback; offer the transcript after the quiz, not before.

## 3. Defensible vs indefensible claims

- Evidence: Simons et al. 2016 (130+ papers): training improves the trained task, weakly improves close variants, no credible evidence of everyday transfer; every industry-cited study had design flaws. The 2014 Stanford/Max Planck consensus (~70 scientists) reached the same conclusion; a 133-signatory rebuttal conceded claims are "frequently exaggerated". ACTIVE (n = 2,832, older adults): speed-of-processing gains persisted 10 years (d = 0.66 on the trained ability), self-reported daily-function benefit small (d = 0.36, CI touching zero). Kable 2017 RCT (n = 128): 10 weeks of Lumosity did nothing for decision-making that retesting didn't; the no-training group improved as much.
- Regulation: FTC v. Lumos Labs (Jan 2016): $2M redress for claims about work/school performance and delaying cognitive decline; order requires "competent and reliable scientific evidence", defined in brain-training orders as randomised, controlled human testing of the product. The 2022 Health Products Compliance Guidance extends this to health apps. LearningRx was similarly barred from work/athletic performance and age-decline claims.

**Safe wording** (use): "Practise mental arithmetic, logic and data reasoning"; "Track your own speed and accuracy against your personal baseline"; "A 90-second check of your attention and speed, compared with your own usual range"; "Built on well-replicated learning techniques: retrieval practice and spaced review"; "Users improve at the games they practise".

**Avoid**: "improves memory/IQ/focus/decision-making", "makes you smarter", "sharpens your brain", "detects impairment", "know when you're ready to decide", "prevents cognitive decline", "scientifically proven to counter AI brain-drain", "designed by neuroscientists" as a proxy for evidence. The founder's "think first" thesis is a position, not a finding; frame it as philosophy, not outcome.

## 4. Individual differences and a 5-question segmentation

- Chronotype: no main effect on cognition in > 80% of studies, but a synchrony effect (better at preferred time) in ~45% of young-adult studies and 83% of older-adult studies, mainly on attention and effortful tasks. The 5-item rMEQ correlates r ≈ 0.86 with the full MEQ. Implication: baseline within a time-of-day band and nudge the ritual toward the user's preferred window.
- Pressure: Beilock: high-working-memory people choke most under framed pressure; cortisol rise hurts math-anxious students. Timers, countdowns and leaderboards are pressure manipulations; pre-task expressive writing and reappraisal help.
- Perfectionism: perfectionistic *concerns* (not strivings) uniquely predict state anxiety after evaluative stressors and avoidant coping. Show ranges, not single "scores to beat".
- Novelty seeking: BSSS-4 (4 items) is unidimensional and short; high scorers need rotation and surprise.
- Need for cognition: NCS-6 is valid; high-NFC users enjoy effortful content and explanations, low-NFC users need shorter sessions and external scaffolds.
- Rewards: Deci, Koestner & Ryan (128 studies): expected tangible rewards reduce intrinsic motivation (d −0.28 to −0.40); informational positive feedback increases it. Use Hexad-12 user types (Achiever, Player, Socialiser, Free Spirit, Philanthropist, Disruptor) as the reward lens.

**Onboarding (5 questions, each adapted from a validated item)**
1. rMEQ: "If you were entirely free to plan your day, when would you feel at your best?" (early morning / late morning / afternoon / evening)
2. Pressure: "A visible countdown timer makes me…" (sharper / no different / rattled)
3. NCS-6: "I would prefer complex to simple problems" (1–5)
4. BSSS-4: "I prefer unpredictable, new tasks over familiar routines" (1–5)
5. Hexad: "What keeps you coming back?" (beating my record / badges and streaks / comparing with friends / learning something new)

**Profiles and adaptation**

| Profile | Signature | Ritual | Feedback & reward |
|---|---|---|---|
| Competitor | timer = sharper; Q5 record/compare | timer visible, personal-best shown after verdict | opt-in leaderboards, streaks, direct z-score |
| Steady Thinker | timer = rattled or high perfectionism cues; often high NCS | hidden timer, "warm-up" framing, accuracy shown first, private | ranges and trends, informational feedback only, no badges for speed |
| Explorer | high BSSS, Q5 learning/novelty | same fixed ritual (measurement must not vary) but rotating gym games and surprise clip topics | unlockable content, variety over points |
| Learner | high NCS, Q5 learning | ritual framed as "calibration"; richer post-session explanation | explanation-after-answer, mastery maps, no tangible rewards |

Chronotype is a cross-cutting setting (ritual reminder in the preferred window; baseline per band). Profiles are UX defaults, not validated taxonomies: let users switch, and A/B retention by profile before claiming personalisation works.

## Sources
- PVT-B validation (Basner 2011): https://pmc.ncbi.nlm.nih.gov/articles/PMC3197786
- Adaptive PVT-BA: https://academic.oup.com/sleepadvances/article/3/1/zpac038/6764767
- PVT-B repeated administration (Sleep 2018): https://pubmed.ncbi.nlm.nih.gov/29126328/
- Lim & Dinges 2010 meta-analysis: https://www.med.upenn.edu/uep/assets/user-content/documents/LimDinges2010MetaAnalysis.pdf
- Van Dongen 2004 state instability / IIV: https://www.med.upenn.edu/uep/assets/user-content/documents/Van_Dongen_Sleep_27_3_2004.pdf
- Practice vs fatigue in self-paced arithmetic: https://pubmed.ncbi.nlm.nih.gov/23611248
- Caffeine after sleep loss meta-analysis: https://acquire.cqu.edu.au/articles/journal_contribution/Effects_of_acute_caffeine_consumption_following_sleep_loss_on_cognitive_physical_occupational_and_driving_performance_A_systematic_review_and_meta-analysis/13449632/1
- Alcohol and speed–accuracy: https://link.springer.com/article/10.3758/BF03199391 ; https://pmc.ncbi.nlm.nih.gov/articles/PMC3424337
- AlertMeter product page: https://www.predictivesafety.com/alertmeter ; validation: https://www.researchgate.net/publication/349925099_Validation_of_AlertMeter_R_Fatigue_Assessment_Device ; NIOSH report: https://blog.predictivesafety.com/hubfs/BLT%20Test%202009%20Report.pdf
- Creyos science overview: https://try.creyos.com/hubfs/PDFs/creyos-health-science-overview.pdf
- ANAM norms vs baseline: https://nata.kglmeridian.com/view/journals/attr/48/4/article-p499.xml ; FDA 510(k): https://510k.innolitics.com/device/K201376
- TReaction app validation: https://pmc.ncbi.nlm.nih.gov/articles/PMC6878103/
- Cogstate practice effects: https://www.cogstate.com/publication/practice-effects-associated-repeated-assessment-cognitive-function-using-cogstate-battery-10-minute-one-week-one-month-test-retest-intervals/
- Reliable change review: https://resolve.cambridge.org/core/services/aop-cambridge-core/content/view/75AC9F09E738AC53924DA77AE4C66D7D/S1754470X22000484a.pdf/reliable-change-and-the-reliable-change-index-still-useful-after-all-these-years.pdf
- Ambulatory cognitive assessment reliability: https://pubmed.ncbi.nlm.nih.gov/27084835/ ; ultra-brief bursts: https://formative.jmir.org/2023/1/e40188
- Testing-effect meta-analyses summary: https://frontiersin.org/articles/10.3389/fpsyg.2018.02412/full
- Spacing (Cepeda 2008): https://www.evullab.org/pdf/CepedaVulRohrerWixtedPashler-PS-2008.pdf
- Interleaving meta-analysis: https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf
- Desirable difficulties: https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/04/EBjork_RBjork_2011.pdf
- Prequestions on video: https://bps.org.uk/research-digest/heres-simple-way-boost-your-learning-videos-prequestion ; limits: https://pure.royalholloway.ac.uk/files/30437641/JARMAC_Toftness_et_al.pdf
- Pretesting vs posttesting: https://pure.athabascau.ca/en/publications/pretesting-versus-posttesting-comparing-the-pedagogical-benefits-/
- Interpolated tests (Szpunar 2013): https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/
- Audio vs text (Rogowsky, Daniel & Woody coverage): https://time.com/5388681/audiobooks-reading-books/ ; https://sprep.ch/blog/posts/audio-vs-text-which-drives-better-retention-research/
- Microlearning meta-analysis: https://www.researchgate.net/publication/394265408_Microlearning_Effectiveness_in_Higher_Education_A_Systematic_Review_and_Meta-Analysis_of_Student_Retention_and_Learning_Outcomes ; Guo 2014: https://www.cs.rochester.edu/hci/pubs/pdfs/edX-MOOC-video-production-and-engagement_LAS-2014.pdf
- Simons 2016: https://www.psychologicalscience.org/publications/brain-training.html
- Stanford/Max Planck consensus: https://longevity.stanford.edu/a-consensus-on-the-brain-training-industry-from-the-scientific-community-2
- ACTIVE 10-year: https://read.qxmd.com/doi/10.1111/jgs.12607
- Kable 2017: https://pennmedicine.org/news/news-releases/2017/july/brain-training-has-no-effect-on-decision-making-or-cognitive-function
- FTC Lumosity: https://ftc.gov/news-events/press-releases/2016/01/lumosity-pay-2-million-settle-ftc-deceptive-advertising-charges ; FTC brain-training order standard: https://www.ftc.gov/system/files/documents/cases/150708brainresearchbrsstip1.pdf ; 2022 guidance summary: https://www.cov.com/en/news-and-insights/insights/2023/01/ftc-issues-new-guidance-on-health-related-claims-to-replace-the-dietary-supplements-advertising-guide
- Chronotype synchrony review: https://researchinnovation.kingston.ac.uk/en/publications/chronotype-and-synchrony-effects-in-human-cognitive-performance-a/ ; rMEQ: https://ir.ymlib.yonsei.ac.kr/handle/22282913/200961
- Choking under pressure: https://news.uchicago.edu/story/when-2-2-major-anxiety-math-performance-stressful-situations ; https://www.sciencedaily.com/releases/2011/08/110809092045.htm
- Perfectionistic concerns and state anxiety: https://openaccess.city.ac.uk/25645/8/Calissano%20et%20al%20Perfectionism_anxiety_PAID_accepted%20manuscript_for%20CRO.pdf
- NCS-6: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7545655/
- BSSS-4: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9265267/
- Deci, Koestner & Ryan 1999: https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf
- Hexad validation: https://uwspace.uwaterloo.ca/handle/10012/14238 ; Hexad-12: https://cris.fau.de/publications/307386040

Skipped: full texts of Basner 2011 and Lim & Dinges were not fetched, so effect sizes are from abstracts and secondary summaries; Daniel & Woody 2010 figures come from secondary coverage. Risk: the readiness verdict thresholds (z cut-offs, 5-session minimum) are design recommendations synthesised from the literature, not values validated for an arithmetic sprint; validate on StaySmart's own data before shipping.
