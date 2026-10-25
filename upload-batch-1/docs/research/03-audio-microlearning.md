# Brain Bites: audio microlearning research brief

Research brief, 24 October 2026. Persona: product researcher for audio microlearning. Research only.

## 1. What the market does today

**Formats cluster into three length tiers**
- **30 s to 2 min:** Google Search Audio Overviews (30 to 45 s, with source links, Labs test); NotebookLM "Brief" format (single speaker, 1 to 2 min); Imprint chapters (~2 min, text plus visuals, no audio yet, users request it).
- **5 to 15 min:** Blinkist Blinks (~15 min, chunked into 2 to 3 min chapters, 6,500+ titles); Headway (<15 min, text or audio, 4.6 stars on ~117K ratings); NotebookLM short setting (~5 min), default (~10 min), long (~20 min), plus Critique and Debate formats.
- **15 min+:** Duolingo Podcast (16 to 20 min story episodes with transcripts; the in-app DuoRadio shorts took "nearly a year" to produce 300 episodes); Shortform (20 to 30 page guides, fully narrated, exercises, $197/yr).

**How they pair audio with recall:** weakly. Imprint has daily quizzes and in-lesson knowledge checks; Headway lets users save insights as flashcards; Blinkist has none in-player; NotebookLM offers quizzes and flashcards as separate notebook outputs. No major product does pre-question, listen, check, next-day recall as one loop. That is the gap.

**What users praise:** commute convenience, human narration (Headway's marketing leans on "professionally recorded human narration"), speed of getting a book's gist, transcripts.

**What users complain about:** superficiality ("the conclusion without the evidence", Chicago Tribune on Blinkist); robotic TTS (Slickdeals commenters on Headway); losing their place and needing to replay chapters; autoplay jumping to unrelated content; aggressive trials and auto-renew billing (Blinkist, Headway, Imprint, Shortform all have this on Trustpilot or App Store); NotebookLM "flattening all content into a standardised format".

**Strongest signal of 2026:** Blinkist emailed subscribers on 14 June 2026 ("No more AI narration at Blinkist") after two years of testing, saying it "could not close the gap with human narration" and that users did not engage as deeply. Existing AI titles stay, labelled AI-generated. Short clips hide TTS weaknesses better than 15-minute reads, but plan for a labelled AI voice and A/B against a human read for the flagship set.

**Newcomers and casualties:** Huxe (ex-NotebookLM founders; daily audio briefings from your email and calendar, interruptible; launched Sept 2025, shut down May 2026, acqui-hired by Apple Oct 2026). BeFreed (AI-generated audio plans of 10 to 40 min from any PDF/URL/topic). Curio closed after eight years ("narrated journalism alone could not be sustainable"). Knowable was bought by Medium in 2021 and is defunct. Uptime (5-min "knowledge hacks", $19m raised) has had no coverage since 2021. Noa (human-read articles, premium tier) is still live. Gemini's Daily Brief gained a "talk through your brief" audio button in a Sept 2026 teardown. No Perplexity audio briefing feature found. Brilliant remains interactive-first with no audio (general knowledge, not re-verified).

Lesson: standalone audio-content apps die; audio bolted onto a habit loop that already exists (games, briefings, language courses) survives.

## 2. Production pipeline in 2026

**Script generation:** a structured brief (concept, one worked example, "the tell", check question) into a small LLM, then a 10 to 15 minute human edit. Script cost is a rounding error: gpt-5-mini is $0.25 in / $2.00 out per 1M tokens, Gemini 2.5 Flash-Lite $0.10 / $0.40. The real cost is editorial review.

**TTS prices (list, per 1M characters unless noted; verify before contracting):**
- Inworld TTS-2 Flash $15, TTS-2 $25 (down to $7 and $12.50 on the $1,500/mo Growth plan). Fastest in independent tests (60 ms median time to first audio).
- Deepgram Aura-2 $30. Google Chirp 3 HD ~$30 (third-party figure; official page would not load). Gemini 3.8 Flash TTS $0.50 text in + $9 per 1M audio tokens through Dec 2026, doubling in Jan 2027.
- OpenAI gpt-4o-mini-tts $0.60 in / $12 audio out per 1M tokens (~$0.015/min, ~$15/M chars measured). Note: tts-1, tts-1-hd and gpt-4o-mini-tts are deprecated, shutting down 6 Jan 2027; OpenAI points to gpt-realtime-2.1-mini. Slowest first-audio in benchmarks (2.3 to 3 s).
- Cartesia Sonic: credits, 1 per character; Pro $5/100K, Startup $49/1.25M, Scale $299/8M, overage $38 to $65 per 1M. Effective $37 to $50.
- ElevenLabs: plans from Starter ($5/mo annual, 30K credits) to Business ($990/mo, 6M credits); 1 credit per character for Multilingual v2, 0.5 to 1 for Flash/Turbo via API. Third parties quote Flash v2.5 at ~$40 and v2/v3/v4 at ~$80 per 1M via API; plan credits work out nearer $165 per 1M. Highest quality on Artificial Analysis (v4 Turbo, Elo 1336); independent first-audio 190 to 290 ms.
- PlayHT/PlayAI: subscription only ($39 to $99/mo); one source flags it as winding down post-Meta. Avoid.

**One 90-second clip:** ~255 words at 170 wpm, roughly 1,500 characters. Cost per clip: Inworld Flash or OpenAI ~$0.02, Deepgram/Google ~$0.045, Cartesia ~$0.06, ElevenLabs Flash ~$0.06 to $0.08, ElevenLabs premium on plan credits ~$0.12 to $0.25. One clip a day for a year is $8 to $90 of TTS. Even ten persona variants a day stays under $1,000/yr. Cost is not the constraint; quality and editorial time are.

**Latency and caching:** Brain Bites are shared, not per-user, so pre-render nightly and never synthesise at request time. Cache key = hash(script text + voice id + model version); store Opus/AAC (~0.4 to 1.4 MB per clip) at immutable CDN URLs with the transcript alongside; regenerate only on script edit. Keep a streaming provider (Inworld, Cartesia, ElevenLabs Flash) only for a future on-demand feature such as "explain why I got this game round wrong".

**Voice licensing:** ElevenLabs requires a paid tier (Starter and up) for commercial use; Voice Library voices carry a commercial licence; policy forbids stripping provenance watermarks and requires disclosure where law requires or silence would mislead. OpenAI's usage policy requires "a clear disclosure to end users that the TTS voice they are hearing is AI-generated". EU AI Act Article 50 applied from 2 August 2026: providers must machine-mark synthetic audio, deployers must disclose AI-generated audio. Put an "AI voice" tag on the player and keep provider metadata in the file.

**Copyright:** facts and ideas are not copyrightable; original-wording explanations of base rates or Simpson's paradox are low risk. Summaries of a specific book or article are the risky end: Blinkist survives by calling Blinks "new, original works", getAbstract licenses from publishers, and publishers are now suing over AI summarisation (Dow Jones and NY Post v. Perplexity cleared discovery Oct 2026 and heads to a jury; CNN sued in 2026). Recommendation: write original concept explainers, cite books or papers as "further reading" only, keep any quotation to a sentence, and run a similarity check on LLM drafts to catch memorised passages.

## 3. Design evidence for "jam-packed" explainers

- **Length: 60 to 180 s is right; default 90, cap 120.** Guo, Kim and Rubin (6.9M edX sessions) found engagement drops sharply after ~6 min. Rey et al.'s meta-analysis of 56 studies found learner-paced, meaning-coherent segments improve retention and transfer (small to medium effect); length should follow the idea, not the clock. Google Search and NotebookLM Brief converged on 30 s to 2 min independently.
- **Pre-question first.** St. Hilaire, Chan and Ahn's 2023 meta-analysis: prequestions help the targeted material (g = 0.54, k = 97) and almost nothing else (g = 0.04). So the pre-question must be about the clip's one key idea. Pan and Sana (2021, n = 1,573) found pretesting beat post-testing on tests up to 48 h later.
- **One check question at the end.** Szpunar, Khan and Schacter (PNAS 2013): interpolated tests halved mind-wandering and improved retention of lectures. For 90 s, one question suffices.
- **Delay the real recall.** Karpicke and Roediger: delaying the first retrieval improves long-term retention; Kang et al.: testing's advantage grows with longer lags; Cepeda and colleagues: optimal gap is roughly 10 to 20 percent of the retention interval (about 1 day for 1-week retention, ~11 days for 5 weeks). So: check question immediately, re-ask at 24 h, again at ~7 days.
- **Speech rate.** Rodero found ~180 wpm optimal for audio ads; news recall peaked at 170 to 190 wpm; comprehension collapses above ~200 to 230 wpm, and faster TTS (178 vs 155) hurt non-native listeners. Render at 160 to 175 wpm; let users speed up.
- **Audio versus text.** Rogowsky (2016) found no comprehension difference between audio and e-reader for adults, but audio is weak for number-dense material. Always ship the transcript and show the one number or table on screen.
- **Structure (90 s):** pre-question (8 s), hook with a concrete work situation (12 s), three beats (50 s), "the tell" (how to spot it tomorrow, 12 s), check question (8 s). Three beats maximum; a fourth is a second bite.

## 4. Recommended "Brain Bites" spec

**Ten launch topics (game tie-in in brackets):**
1. Base rates: why a 95 percent accurate screen is mostly wrong [data reasoning, probability]
2. Simpson's paradox: the aggregate that reverses [data reasoning]
3. Survivorship bias: the dashboards you never see [logic]
4. Verifying an AI claim: ask for the source, check the number, triangulate [AI-output checking]
5. Unit economics: contribution margin before CAC/LTV [calculation]
6. Percent vs percentage points, and the compounding trap [calculation]
7. Regression to the mean: why the "fix" looked like it worked [data reasoning]
8. Goodhart's law: when the metric becomes the target [logic, AI-output checking]
9. Fermi estimation in 60 seconds [calculation]
10. Hallucinated citations and confident wrongness: the five tells [AI-output checking]

Backlog: anchoring, sunk cost, confounders, confidence intervals, expected value, prompt injection, why LLMs cannot count letters.

**Cadence:** one bite per weekday, released 06:00 local, auto-played as the warm-up before the day's games. Weekend bite is a replay chosen by the user's weakest 7-day recall. Monthly batch-produced and cached.

**Loop:** pre-question (tap an answer, errors welcome) → 90 s clip with transcript and one on-screen figure → check question → tomorrow's warm-up re-asks it before the games → a related game round seven days later carries a tagged example. Each bite maps to one or two of the 14 games; the game that follows is themed on the concept, and failing a game round surfaces the matching bite. Bite streaks count toward the game streak; a "concept mastery" score per topic rolls up both.

**Free vs paid:** Free: today's bite, pre and check question, transcript, 24-hour recall. Paid: full archive and search, role playlists (analyst, PM, finance, consultant), the 3-minute "deeper" variant, voice choice and offline download, mastery dashboard with 7- and 30-day recall scheduling, team packs with manager view. Keep the free loop complete so the habit forms before the paywall.

**Production:** LLM draft from the structured brief → editor review → one house narrator voice (Inworld TTS-2 or ElevenLabs Flash at 165 wpm) → pre-render and cache → publish with "AI voice" label and transcript. Record the first ten with a human narrator as an A/B control, given Blinkist's reversal.

## Sources
- https://www.blinkist.com/learn/how-long-does-a-blink-take-to-read-or-listen-to
- https://dev.to/jamilxt/blinkist-just-admitted-ai-narration-failed-that-should-worry-every-ai-optimist-3a7f
- https://www.pressreader.com/usa/chicago-tribune-sunday/20201206/282480006369258
- https://apps.apple.com/us/app/headway-15-min-book-summaries/id1457185832
- https://makeheadway.com/blog/headway-app-reddit-reviews/
- https://slickdeals.net/f/18896596-headway-premium-lifetime-subscription-single-user-39-99
- https://apps.apple.com/us/app/imprint-learn-visually/id1482780647
- https://nibble-app.com/blog/imprint-review
- https://www.shortform.com/blog/shortform-vs-blinkist/
- https://edlatimore.com/shortform-review-vs-blinkist
- https://x.com/NotebookLM/status/1924932327492248026
- https://notebooktoolkit.com/blog/notebooklm-audio-overview-complete-guide
- https://techcrunch.com/2025/06/13/google-tests-audio-overviews-for-search-queries/
- https://www.androidauthority.com/gemini-audio-briefing-shortcut-apk-teardown-3705455/
- https://9to5mac.com/2026/10/09/apple-acqui-hires-ai-startup-founded-by-former-notebooklm-developers/
- https://curio.io/
- https://techcrunch.com/2021/11/16/medium-acquires-knowable-to-bring-audio/
- https://www.cityam.com/?p=1710876
- https://play.google.com/store/apps/details?id=com.newsoveraudio.noa&hl=en
- https://blog.duolingo.com/scaling-duoradio/
- https://pocketcasts.com/podcast/duolingo-spanish-podcast/718dfa90-b6a9-0135-9e60-5bb073f92b78
- https://www.ilounge.com/articles/7-best-ai-personalized-learning-apps-in-2026-audio-first-tested
- https://elevenlabs.io/pricing
- https://elevenlabs.io/use-policy
- https://elevenlabs.io/elevenlabs-voices-a-comprehensive-guide
- https://developers.openai.com/api/docs/pricing
- https://developers.openai.com/api/docs/guides/text-to-speech
- https://ai.google.dev/gemini-api/docs/pricing
- https://texttolab.com/blog/google-cloud-tts-pricing
- https://inworld.ai/pricing
- https://cartesia.ai/pricing
- https://deepgram.com/learn/best-text-to-speech-apis-2026
- https://openbenchmarks.com/text-to-speech-benchmark-by-coval
- https://gradium.ai/content/tts-latency-benchmark-2026
- https://artificialanalysis.ai/text-to-speech
- https://www.traverssmith.com/knowledge/knowledge-container/is-it-a-bot-eu-ai-act-transparency-rules-take-effect-2-august-2026/
- https://www.law360.com/cases/6716810ac29a33038b51fe14/articles
- https://news.bloomberglaw.com/ip-law/news-outlets-perplexity-ai-suits-strike-at-existential-threat
- https://www.avvo.com/legal-answers/how-is-this-app-blinkist-summarize-non-fiction-boo-2566140.html
- https://up.csail.mit.edu/other-pubs/las2014-pguo-engagement.pdf
- https://is.tuebingen.mpg.de/publications/rey2018segmenting
- https://par.nsf.gov/servlets/purl/10511812
- https://pure.athabascau.ca/en/publications/pretesting-versus-posttesting-comparing-the-pedagogical-benefits-/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3631699/
- https://www.gwern.net/doc/psychology/spaced-repetition/2007-karpicke.pdf
- https://home.cs.colorado.edu/~mozer/Research/Selected%20Publications/reprints/KangLindseyMozerPashler2014.pdf
- https://link.springer.com/article/10.3758/s13421-014-0477-z
- https://www.warc.com/newsandopinion/news/how-speech-delivery-speed-impacts-audio-ads/43304
- https://ro.uow.edu.au/era/2129
- https://time.com/5388681/audiobooks-reading-books/

Skipped or not verified: Google Cloud's official TTS pricing page would not load (Chirp 3 HD figure is third-party); no first-hand Reddit threads surfaced (sentiment comes from App Store, Trustpilot, Slickdeals and press); Brilliant's current daily format and Uptime's current status were not confirmed. Risk: TTS list prices and OpenAI model deprecations are moving quickly; re-check vendor pages before signing.
