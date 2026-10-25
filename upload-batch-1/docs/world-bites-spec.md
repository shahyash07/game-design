# World Bites: content spec

Status: founder decision 6, 2026-10-24. Pro only. Builds on the Brain Bites pipeline (same TTS job, storage, player and recall loop) with a different editorial job: force exposure to something outside the listener's day-to-day, in two minutes, and hand them one idea to carry back into their own work.

## 1. The format

- **Length:** 120 seconds default, 150 cap. About 300 words at 160 words per minute.
- **Voice:** AI voice, labelled "AI voice" on the player (founder decision 4; EU AI Act Article 50).
- **Structure:** STAR, with a hook in front and a check question behind.

| Beat | Seconds | Job | Panel |
|---|---|---|---|
| Hook | 10 | One surprising line that earns the next two minutes. | none |
| Situation | 20 | The world before. What existed, what was normal. | Panel 1 |
| Task | 15 | The problem that had to be solved, in one sentence. | Panel 2 |
| Action | 45 | How it works, or what they did. The only beat allowed detail. | Panel 3 |
| Result | 20 | What changed, with one number, then the carry-over: one idea for the listener's own work. | Panel 4 (share card) |
| Check | 10 | One multiple-choice question on the Action beat. | none |

- **Infographic:** four panels, one per STAR beat. Each panel has a title, one number or key fact, one line of text and one icon name from the lucide set already in the project. Panels are rendered in-app from JSON. No AI-generated images or diagrams: they hallucinate parts, labels and numbers. Mechanical and anatomy topics may carry one hand-made SVG diagram checked by the editor.
- **Learning loop:** pre-question before listening (on the Action beat's key fact), check question after, the same question re-asked at 24 hours and 7 days by the Brain Bites recall engine.
- **Transcript** always shown after the check question. Show the four panels during playback, advancing with the beats.

## 2. Categories and the daily recommendation

| Category | Example titles |
|---|---|
| how-it-works | How a mechanical watch keeps time. How a hip replacement works. How a jet engine stays cool. |
| how-they-grew | How a product reached its first two million customers. How a bank got teenagers to open accounts. |
| why-it-matters | Why this IPO is worth watching. Why a port strike moves grocery prices. |
| how-it-runs | How an airport turns a plane around in 35 minutes. How a national election counts votes. |
| science | Why vaccines need boosters. How a battery ages. |

Recommendation rule: one Bite per weekday. Skip the last three categories the user heard. Prefer categories the user has not explored. Prefer evergreen Bites three days out of five; timely Bites (those with an `asOf` date) leave the recommendation 60 days after that date and stay in the archive.

## 3. Editorial rules

1. Every number comes from a named source listed on the Bite. No number without a source. If the source cannot be found, cut the number.
2. Timely topics carry `asOf`. Company and market stories describe what to watch, never what to buy, sell or do with money.
3. Original writing. Summarising a specific book or article is out; explaining how something works or what a public record says is in. Quote at most one sentence.
4. One idea per Bite. If the Action beat needs a fourth point, it is a second Bite.
5. The carry-over must be usable by an analyst, a product manager or a consultant on the same day. "Be curious" is not a carry-over; "ask what your escapement is" is.
6. Plain words. No acronym without the words behind it on first use.
7. Editor checks every number against its source before the TTS job runs. Budget 15 to 20 minutes per Bite.

## 4. Schema

```ts
export type WorldBiteCategory = "how-it-works" | "how-they-grew" | "why-it-matters" | "how-it-runs" | "science";

export interface WorldBitePanel { title: string; stat?: string; line: string; icon: string } // icon: lucide-react component name
export interface WorldBiteBeat { script: string; panel: WorldBitePanel }
export interface WorldBiteQuestion { prompt: string; options: string[]; answer: number; explain: string }

export interface WorldBite {
  id: string;               // kebab-case, stable
  title: string;
  category: WorldBiteCategory;
  evergreen: boolean;
  asOf?: string;            // YYYY-MM-DD, required when evergreen is false
  hook: string;
  star: { situation: WorldBiteBeat; task: WorldBiteBeat; action: WorldBiteBeat; result: WorldBiteBeat };
  carryOver: string;        // one transferable idea, spoken at the end of Result
  preQuestion: WorldBiteQuestion;
  checkQuestion: WorldBiteQuestion;
  sources: { title: string; url: string }[];
  diagramSvg?: string;      // optional hand-made SVG for how-it-works topics
  audio?: { url: string; voice: "ai"; durationS: number }; // filled by the render job
}
```

Storage: a `world_bites` table with the JSON in a `payload` column and `published`, `category`, `evergreen`, `as_of` columns for the recommendation query, plus `world_bite_progress(user_id, bite_id, heard_at, pre_correct, check_correct, recall_24h, recall_7d)` with own-row row-level security. Free users may read `title` and `star.situation.panel` only; the server function that serves a full Bite checks the subscription.

## 5. Example Bite 1 (evergreen, how-it-works)

Draft for editor verification. Numbers are from the listed sources; confirm before rendering.

```json
{
  "id": "mechanical-watch-escapement",
  "title": "How a mechanical watch keeps time",
  "category": "how-it-works",
  "evergreen": true,
  "hook": "No battery, no chip, and it drifts only a few seconds a day. Inside is a tiny gatekeeper that says no 28,800 times an hour.",
  "star": {
    "situation": {
      "script": "A mechanical watch stores energy in a coiled mainspring. You wind it by hand, or a weighted rotor winds it as your wrist moves. Fully wound, a typical movement holds about forty hours of energy.",
      "panel": { "title": "Energy in a spring", "stat": "~40 h", "line": "typical power reserve when fully wound", "icon": "Battery" }
    },
    "task": {
      "script": "The problem is not storing energy. It is releasing it evenly. A spring wants to unwind all at once. The watch has to let it out in identical slices, thousands of times an hour, inside something smaller than a coin.",
      "panel": { "title": "Release it evenly", "stat": "1 tick per swing", "line": "the spring must unwind in identical slices", "icon": "Timer" }
    },
    "action": {
      "script": "The gatekeeper is the escapement. A balance wheel swings back and forth on a hairspring, like a pendulum laid flat. In a common movement it swings 28,800 times an hour, four times a second. Each swing nudges a pallet fork, which lets the gear train advance exactly one tooth and gives the balance a tiny push to keep it going. That is the tick. The gears then divide the swings into seconds, minutes and hours.",
      "panel": { "title": "The escapement", "stat": "28,800 / h", "line": "balance wheel swings at 4 Hz; each one releases a single tooth", "icon": "Cog" }
    },
    "result": {
      "script": "From pure mechanics you get a watch that holds within a few seconds a day. A chronometer-certified movement must stay between minus four and plus six seconds a day across tests. The carry-over: a steady small release beats a big burst. Ask what your escapement is, the thing that turns stored effort into regular output.",
      "panel": { "title": "Accuracy", "stat": "−4 to +6 s/day", "line": "the chronometer standard, from mechanics alone", "icon": "Gauge" }
    }
  },
  "carryOver": "Ask what your escapement is: the thing that turns stored effort into regular output.",
  "preQuestion": { "prompt": "What stops a watch's mainspring from unwinding all at once?", "options": ["A second spring", "The escapement", "The crown", "The crystal"], "answer": 1, "explain": "The escapement lets the gear train advance one tooth per swing of the balance wheel." },
  "checkQuestion": { "prompt": "In a common movement, how often does the balance wheel swing?", "options": ["60 times a minute", "4 times a second", "Once a second", "100 times a second"], "answer": 1, "explain": "28,800 swings an hour is 4 Hz, four swings a second." },
  "sources": [
    { "title": "COSC chronometer certification criteria", "url": "https://www.cosc.swiss/" },
    { "title": "Escapement (overview of lever escapement and balance wheel)", "url": "https://en.wikipedia.org/wiki/Escapement" }
  ]
}
```

## 6. Example Bite 2 (evergreen, how-it-works, medicine)

Draft for editor verification.

```json
{
  "id": "hip-replacement",
  "title": "How a hip replacement works",
  "category": "how-it-works",
  "evergreen": true,
  "hook": "Surgeons can swap out a joint you have used every step of your life, and most people are walking on the new one the next day.",
  "star": {
    "situation": {
      "script": "The hip is a ball and socket. The ball at the top of the thigh bone sits in a cup in the pelvis, and both are coated in cartilage so they glide. With age or injury the cartilage wears away, bone grinds on bone, and every step hurts.",
      "panel": { "title": "A ball in a socket", "stat": "2 surfaces", "line": "cartilage on both sides lets the joint glide; arthritis wears it away", "icon": "Circle" }
    },
    "task": {
      "script": "Replace the worn surfaces without losing what the joint is for: a wide range of motion, stability under your full body weight, and decades of use.",
      "panel": { "title": "Replace the bearing", "stat": "25+ years", "line": "keep the motion and the stability, for decades", "icon": "Target" }
    },
    "action": {
      "script": "The surgeon removes the worn ball and fits a metal stem down into the thigh bone, topped with a new ball of ceramic or metal. The socket is lined with a metal cup and a smooth plastic liner. Many implants are press-fit: the metal has a porous surface and your own bone grows into it over weeks. Others are fixed with bone cement. The new ball sits in the new liner, and the joint moves again.",
      "panel": { "title": "Stem, ball, cup, liner", "stat": "4 parts", "line": "metal stem and ball, metal cup, plastic liner; bone grows into the porous metal", "icon": "Wrench" }
    },
    "result": {
      "script": "Most patients stand or walk with support within a day. In a review of registry data from several countries, about 58 percent of hip replacements were still in place 25 years after surgery. The carry-over: replace the bearing, keep the architecture. When something at work wears out, change the surface that takes the friction before you rebuild the whole system.",
      "panel": { "title": "Built to last", "stat": "58% at 25 years", "line": "share of hip replacements still in place after 25 years", "icon": "Activity" }
    }
  },
  "carryOver": "Replace the bearing, keep the architecture: change the surface that takes the friction before you rebuild the whole system.",
  "preQuestion": { "prompt": "What does a hip replacement actually replace?", "options": ["The whole pelvis", "The worn ball and socket surfaces", "The thigh bone", "The hip muscles"], "answer": 1, "explain": "The ball and the socket lining are replaced; the bone around them stays." },
  "checkQuestion": { "prompt": "How do press-fit implants stay attached?", "options": ["Screws through the pelvis", "Bone grows into a porous metal surface", "Glue applied to the skin", "They float in the joint fluid"], "answer": 1, "explain": "The porous metal lets the patient's own bone grow into it over several weeks." },
  "sources": [
    { "title": "Evans JT et al., How long does a hip replacement last? A systematic review and meta-analysis, The Lancet, 2019", "url": "https://doi.org/10.1016/S0140-6736(18)31665-9" },
    { "title": "NHS: Hip replacement, how it is performed", "url": "https://www.nhs.uk/conditions/hip-replacement/" }
  ]
}
```

## 7. Timely Bite template (why-it-matters)

For a company or market story, for example "Why this IPO is worth watching":

- `asOf` is required and shown on the player ("as of 24 Oct 2026").
- Situation: what the company does and how big it is, with one number from the prospectus or filing.
- Task: what the listing has to prove, in one sentence.
- Action: the three things to watch, each tied to a number from the filing.
- Result: what the outcome would change for the industry, then the carry-over for the listener's own work. No price targets, no "buy", no "sell".
- Sources: the filing itself, plus one independent report.

## 8. Production checklist

1. Pick the topic from the category rotation. Write the brief: title, category, the one idea, the carry-over, two sources.
2. LLM drafts the script and the four panels from the brief, in the schema above.
3. Editor verifies every number against the listed sources, cuts anything unsourced, reads the script aloud once for pace, and sets `evergreen` or `asOf`.
4. Save the JSON. The nightly render job synthesises the audio through the Lovable AI gateway, stores it under a content-hash key, and fills `audio`.
5. Publish. The Bite enters the recommendation pool the next weekday at 06:00 local.
