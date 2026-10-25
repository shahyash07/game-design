import { at } from "@/lib/at";
import { useMemo, useRef, useState } from "react";
import type { GameProps } from "./types";
import type { MCQ } from "@/lib/content";
import { rng, type Call } from "@/lib/progress";
import { Slider } from "@/components/ui/slider";

/** Think-first MCQ: commit an answer and a confidence, then the explanation unlocks. */
export function McqGame({ seed, onFinish, bank, count = 4 }: GameProps & { bank: MCQ[]; count?: number }) {
  const qs = useMemo(() => {
    const r = rng(seed);
    return [...bank].sort(() => r() - 0.5).slice(0, count);
  }, [seed, bank, count]);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [right, setRight] = useState(0);
  const [hint, setHint] = useState(false);
  const [conf, setConf] = useState(70);
  const calls = useRef<Call[]>([]);
  const start = useRef(Date.now());
  const q = qs[i];
  if (!q) return <p>No questions available.</p>;

  const next = () => {
    if (i + 1 >= qs.length) {
      const acc = right / qs.length;
      onFinish({ score: Math.round(acc * 100 - (hint ? 5 : 0)), raw: `${right}/${qs.length} correct`, accuracy: acc, ms: Date.now() - start.current, hintUsed: hint, calls: calls.current, tip: qs.at(-1)?.tip ?? "Compare every option before committing." });
      return;
    }
    setI(i + 1); setPick(null); setLocked(false);
  };

  return (
    <div className="space-y-5 animate-pop" key={q.id}>
      <div className="font-mono text-xs text-muted-foreground">Question {i + 1} of {qs.length}</div>
      {q.context && (
        <div className="card-block p-4 bg-paper text-sm leading-relaxed border-dashed">{q.context}</div>
      )}
      <h2 className="text-2xl font-semibold">{q.prompt}</h2>
      <div className="space-y-2" role="radiogroup">
        {q.options.map((o, k) => {
          const state = !locked ? (pick === k ? "bg-accent" : "bg-card")
            : k === q.answer ? "bg-success text-success-foreground" : k === pick ? "bg-destructive text-destructive-foreground" : "bg-card opacity-60";
          return (
            <button key={k} role="radio" aria-checked={pick === k} disabled={locked}
              className={`btn-block w-full text-left px-4 py-3 ${state} disabled:opacity-100`}
              onClick={() => setPick(k)}>
              <span className="font-mono mr-2">{String.fromCharCode(65 + k)}</span>{o}
            </button>
          );
        })}
      </div>
      {!locked ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm shrink-0">How sure? <b className="font-mono">{conf}%</b></span>
            <Slider aria-label="Confidence" min={50} max={100} step={5} value={[conf]} onValueChange={(v) => setConf(v[0] ?? conf)} className="max-w-xs" />
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-block bg-primary text-primary-foreground px-6 py-3" disabled={pick === null}
              onClick={() => { const ok = pick === q.answer; setLocked(true); if (ok) setRight(right + 1); calls.current.push({ confidence: conf / 100, correct: ok }); }}>
              Lock in my answer
            </button>
            <span className="text-xs text-muted-foreground">Explanation unlocks after you commit.</span>
          </div>
        </div>
      ) : (
        <div className="card-block p-4 space-y-2 animate-pop">
          <div className="font-semibold">{pick === q.answer ? "Nice reasoning." : "Not quite — here's why."} <span className="ml-2 font-mono text-xs text-muted-foreground">You said {conf}%</span></div>
          <p className="text-sm">{q.explain}</p>
          {!hint ? (
            <button className="text-xs underline text-muted-foreground" onClick={() => setHint(true)}>Show thinking tip</button>
          ) : (
            <p className="text-sm font-medium text-primary">Tip: {q.tip}</p>
          )}
          <button className="btn-block bg-ink text-paper px-5 py-2 mt-2" onClick={next}>{i + 1 >= qs.length ? "Finish" : "Next"}</button>
        </div>
      )}
    </div>
  );
}
