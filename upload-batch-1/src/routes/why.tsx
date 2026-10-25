import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/why")({
  head: () => ({
    meta: [
      { title: "The problem StaySmart solves — StaySmart" },
      { name: "description", content: "Why habitual AI reliance can reduce practice of independent reasoning, with sources." },
      { property: "og:title", content: "Why StaySmart — thinking in an AI-assisted world" },
      { property: "og:description", content: "A research-backed problem statement on cognitive offloading and AI judgment." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Why,
});

const SOURCES = [
  { n: 1, text: "Lee, H.-P. et al. (2025). The Impact of Generative AI on Critical Thinking: Self-Reported Reductions in Cognitive Effort and Confidence Effects From a Survey of Knowledge Workers. CHI ’25, Microsoft Research & Carnegie Mellon.", url: "https://www.microsoft.com/en-us/research/wp-content/uploads/2025/01/lee_2025_ai_critical_thinking_survey.pdf" },
  { n: 2, text: "Gerlich, M. (2025). AI Tools in Society: Impacts on Cognitive Offloading and the Future of Critical Thinking. Societies, 15(1), 6.", url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5082524" },
  { n: 3, text: "Kosmyna, N. et al. (2025). Your Brain on ChatGPT: Accumulation of Cognitive Debt when Using an AI Assistant for Essay Writing Task. MIT Media Lab (preprint).", url: "https://arxiv.org/abs/2506.08872" },
  { n: 4, text: "Risko, E. F. & Gilbert, S. J. (2016). Cognitive Offloading. Trends in Cognitive Sciences, 20(9), 676–688.", url: "https://doi.org/10.1016/j.tics.2016.07.002" },
  { n: 5, text: "Sparrow, B., Liu, J. & Wegner, D. M. (2011). Google Effects on Memory. Science, 333(6043), 776–778.", url: "https://doi.org/10.1126/science.1207745" },
  { n: 6, text: "LinkedIn Help (accessed October 2026). Games on LinkedIn — Queens, Tango, Zip, Pinpoint, Crossclimb, Mini Sudoku, Patches and Wend.", url: "https://www.linkedin.com/help/linkedin/answer/a6863543" },
];

const Cite = ({ n }: { n: number }) => (
  <a href={`#src-${n}`} className="font-mono text-xs align-super text-primary hover:underline">[{n}]</a>
);

function Why() {
  return (
    <article className="space-y-8 max-w-2xl">
      <header className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Problem statement</p>
        <h1 className="text-4xl sm:text-5xl font-black leading-tight">We're becoming editors of answers, not owners of thinking.</h1>
      </header>

      <section className="space-y-4 leading-relaxed">
        <p>Generative AI makes answers, summaries and recommendations instant. That's useful — but it also lets us skip the effortful parts of thinking: framing the problem, generating options, checking assumptions and defending a conclusion. Psychologists call this <b>cognitive offloading</b><Cite n={4} />. Done on purpose, it frees the mind. Done by habit, it means the skills stop getting practice.</p>
        <p>The evidence is early but consistent in direction:</p>
        <ul className="space-y-3">
          <li className="card-block p-4">In a survey of 319 knowledge workers, <b>higher confidence in GenAI was associated with less critical-thinking effort</b>, while higher self-confidence was associated with more. Thinking shifted from creating to verifying and integrating AI output.<Cite n={1} /></li>
          <li className="card-block p-4">A study of 666 participants found <b>frequent AI-tool use correlated with lower critical-thinking scores</b>, mediated by cognitive offloading — strongest among younger users.<Cite n={2} /></li>
          <li className="card-block p-4">In an MIT EEG study, people writing essays with ChatGPT showed <b>weaker neural connectivity and poorer recall of their own work</b> than those writing unaided.<Cite n={3} /></li>
          <li className="card-block p-4">Even before AI, easy access to search changed what we remember: we recall <i>where</i> to find information rather than the information itself.<Cite n={5} /></li>
        </ul>
        <p className="text-sm text-muted-foreground">Honest caveat: much of this is correlational or small-sample. AI doesn't make anyone less intelligent. The risk is <b>reduced practice</b> of reasoning — and the plausible-but-wrong answers that slip through when we stop checking.</p>
      </section>

      <section className="card-block p-6 bg-ink text-paper space-y-3">
        <h2 className="text-2xl font-bold">The problem</h2>
        <p>AI-heavy professionals — analysts, managers, consultants, product and finance teams — increasingly accept AI reasoning and decide on top of it, with fewer chances to calculate, deduce and judge for themselves. Over time this erodes confidence in their own judgment and raises the odds of acting on flawed output.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Our answer: a mental gym</h2>
        <p>Short daily puzzles already work as a habit — LinkedIn's Queens, Tango and Zip show people will return for a few minutes of deduction each day.<Cite n={6} /> StaySmart keeps that fun, and adds the skills that transfer to work:</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[["Calculation", "Number Sprint, 50 Correct, Mini Sudoku"], ["Logic", "Crowns, Sun & Moon, Number Trail, Common Thread, Word Ladder, Patchwork, Word Trails, Deduction"], ["Data reasoning", "Data Detective"], ["AI judgment", "AI Reality Check"]].map(([a, b]) => (
            <div key={a} className="card-block p-3"><b>{a}</b><div className="text-muted-foreground">{b}</div></div>
          ))}
        </div>
        <p><b>Rule #1: AI comes second.</b> You commit an answer before any explanation or hint unlocks. We track your <i>think-first rate</i> — the share of challenges solved without help.</p>
        <p className="text-sm text-muted-foreground">StaySmart is practice. We make no claims about IQ or medical cognitive benefits.</p>
        <Link to="/" className="btn-block inline-block bg-primary text-primary-foreground px-5 py-2.5">Start today's workout →</Link>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Sources</h2>
        <ol className="space-y-2 text-sm">
          {SOURCES.map((s) => (
            <li key={s.n} id={`src-${s.n}`} className="flex gap-2">
              <span className="font-mono text-primary">[{s.n}]</span>
              <a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">{s.text}</a>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
