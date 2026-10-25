import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { patchReadiness, recordReadiness, today, useProgress, type ReadinessItem, type ReadinessSession } from "@/lib/progress";
import { BASELINE_MIN_DAYS, BASELINE_MIN_SESSIONS, BASELINE_WINDOW, ITEMS_PER_ROUND, LIGHT_LABEL, ROUNDS, checkProgress, makeItems, shareText, verdict, type Verdict } from "@/lib/readiness";
import { track } from "@/lib/analytics";
import { play } from "@/lib/sound";

type Stage = "intro" | "round" | "between" | "done";
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0"];
export const LIGHT_CLASS = { green: "bg-success text-success-foreground", amber: "bg-accent text-accent-foreground", grey: "bg-muted text-foreground" } as const;
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const DISCLAIMER = "A self-check of attention and speed against your own usual range. Not a test of judgment, safety or fitness to work.";

export function GreenLight({ onAgain }: { onAgain: () => void }) {
  const { readiness = [], ready } = useProgress();
  const [stage, setStage] = useState<Stage>("intro");
  const [decision, setDecision] = useState("");
  const [sleptUnder6, setSleptUnder6] = useState(false);
  const [caffeine, setCaffeine] = useState(false);
  // One-line twin of levels.freshNumberSeed, kept here so /check never imports the 2.6 MB level library.
  const [seed] = useState(() => globalThis.crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now());
  const rounds = useMemo(() => makeItems(seed), [seed]);
  const [round, setRound] = useState(0);
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [feel, setFeel] = useState<number | null>(null);
  const [result, setResult] = useState<{ session: ReadinessSession; v: Verdict } | null>(null);
  const items = useRef<ReadinessItem[]>([]);
  const roundMs = useRef<number[]>([]);
  const itemStart = useRef(0);
  const roundStart = useRef(0);
  const item = rounds[round]?.[index];
  const prog = checkProgress(readiness);

  useEffect(() => {
    if (stage !== "round") return;
    const t = setInterval(() => setElapsed(Date.now() - roundStart.current), 100);
    return () => clearInterval(t);
  }, [stage]);

  function startRound(r: number) {
    const now = Date.now();
    roundStart.current = now;
    itemStart.current = now;
    setRound(r); setIndex(0); setTyped(""); setElapsed(0); setStage("round");
  }

  function finish(now: number) {
    const session: ReadinessSession = {
      at: now, date: today(), hour: new Date(now).getHours(), items: items.current, roundMs: roundMs.current,
      ...(sleptUnder6 ? { sleptUnder6 } : {}),
      ...(caffeine ? { caffeine } : {}),
      ...(decision.trim() ? { decision: decision.trim().slice(0, 80) } : {}),
    };
    const v = verdict(session, readiness);
    recordReadiness(session);
    track("readiness_completed", { light: v.light, medianRt: Math.round(v.metrics.medianRt), accuracy: Math.round(v.metrics.accuracy * 100) });
    if (v.light === "green") play("win");
    setResult({ session, v });
    setStage("done");
  }

  function answer(correct: boolean) {
    const now = Date.now();
    items.current.push({ ms: now - itemStart.current, correct, round });
    if (correct) play("tap");
    setTyped("");
    if (index + 1 < ITEMS_PER_ROUND) { setIndex(index + 1); itemStart.current = now; return; }
    roundMs.current.push(now - roundStart.current);
    if (round + 1 < ROUNDS) setStage("between");
    else finish(now);
  }

  const onKey = (k: string) => {
    if (stage !== "round" || !item) return;
    if (k === "⌫") { setTyped((t) => t.slice(0, -1)); return; }
    const t = typed + k;
    if (Number(t) === item.answer) { answer(true); return; }
    // a wrong entry counts once and moves on, so retries never inflate the time
    if (t.length >= String(item.answer).length) { answer(false); return; }
    setTyped(t);
  };

  useEffect(() => {
    if (stage !== "round") return;
    const h = (e: KeyboardEvent) => { if (/^[0-9]$/.test(e.key)) onKey(e.key); if (e.key === "Backspace") onKey("⌫"); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  async function share() {
    if (!result) return;
    const text = `${shareText(result.session, result.v.light)} StaySmart`;
    try {
      if (navigator.share) await navigator.share({ text, url: window.location.origin });
      else { await navigator.clipboard.writeText(`${text} ${window.location.origin}`); toast.success("Copied to clipboard"); }
    } catch { /* cancelled */ }
  }

  if (!ready) return <div className="h-64" />;

  if (stage === "intro") return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Green Light</p>
        <h1 className="text-4xl sm:text-5xl font-black">Are you in your usual range?</h1>
        <p className="text-muted-foreground">Three rounds of {ITEMS_PER_ROUND} quick sums, about 90 seconds. Your speed, accuracy and steadiness are compared with your own last {BASELINE_WINDOW} checks at this time of day, never with anyone else.</p>
      </div>
      <div className="card-block p-5 space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-semibold">What are you about to decide? <span className="text-muted-foreground font-normal">(optional)</span></span>
          <Input value={decision} maxLength={80} placeholder="e.g. pricing call, send the proposal" onChange={(e) => setDecision(e.target.value)} className="bg-card" />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Context">
          <Button variant={sleptUnder6 ? "secondary" : "outline"} aria-pressed={sleptUnder6} onClick={() => setSleptUnder6((v) => !v)}>Slept under 6h</Button>
          <Button variant={caffeine ? "secondary" : "outline"} aria-pressed={caffeine} onClick={() => setCaffeine((v) => !v)}>Caffeine in the last hour</Button>
        </div>
        <p className="text-xs text-muted-foreground">{prog.ready ? "Baseline ready." : `Baseline: ${prog.sessions} of ${BASELINE_MIN_SESSIONS} checks on ${prog.days} of ${BASELINE_MIN_DAYS} days. The comparison appears once it is built.`}</p>
        <button className="btn-block btn-glow w-full py-4 text-lg" onClick={() => startRound(0)}>Start round 1 →</button>
      </div>
      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );

  if (stage === "round") return (
    <div className="space-y-6">
      <div className="flex justify-between font-mono text-sm"><span>Round {round + 1} of {ROUNDS} · {index + 1}/{ITEMS_PER_ROUND}</span><span>{secs(elapsed)}</span></div>
      <div className="h-2 rounded-full bg-muted overflow-hidden border border-ink"><div className="h-full bg-primary transition-all" style={{ width: `${(index / ITEMS_PER_ROUND) * 100}%` }} /></div>
      <div className="card-block py-10 text-center font-mono text-5xl font-bold">{item?.text}<div className="text-3xl mt-3 h-10 text-primary">{typed || "_"}</div></div>
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {KEYS.map((k) => <button key={k} className="btn-block bg-card py-4 font-mono text-2xl" onClick={() => onKey(k)}>{k}</button>)}
      </div>
    </div>
  );

  if (stage === "between") return (
    <div className="card-block p-8 text-center space-y-4 animate-pop">
      <div className="text-xs font-mono uppercase text-muted-foreground">Round {round + 1} done</div>
      <div className="font-mono text-5xl font-bold">{secs(roundMs.current[round] ?? 0)}</div>
      <div className="font-mono text-sm text-muted-foreground">{roundMs.current.map(secs).join(" · ")}</div>
      <button className="btn-block btn-glow px-8 py-3 text-lg" onClick={() => startRound(round + 1)}>Round {round + 2} →</button>
    </div>
  );

  if (!result) return null;
  const { session, v } = result;
  const context = [session.sleptUnder6 && "slept under 6h", session.caffeine && "caffeine in the last hour"].filter((x): x is string => typeof x === "string");
  return (
    <div className="space-y-5">
      <div className="card-block p-6 space-y-4 animate-pop">
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${LIGHT_CLASS[v.light]}`}>{LIGHT_LABEL[v.light]}</span>
          <span className="font-mono text-sm text-muted-foreground">{session.roundMs.map(secs).join(" · ")}</span>
        </div>
        <h1 className="text-3xl font-black">{v.headline}</h1>
        <p className="text-sm text-muted-foreground">{v.note}</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-muted p-3"><div className="text-xs text-muted-foreground">Per sum</div><div className="font-mono text-xl font-bold">{secs(v.metrics.medianRt)}</div></div>
          <div className="rounded-xl bg-muted p-3"><div className="text-xs text-muted-foreground">Accuracy</div><div className="font-mono text-xl font-bold">{Math.round(v.metrics.accuracy * 100)}%</div></div>
          <div className="rounded-xl bg-muted p-3"><div className="text-xs text-muted-foreground">Slow sums</div><div className="font-mono text-xl font-bold">{v.metrics.lapses}</div></div>
        </div>
        <div className="rounded-xl bg-accent/15 border border-accent/40 p-3 text-sm"><b className="text-accent">Next:</b> {v.action}</div>
        {context.length > 0 && <p className="text-xs text-muted-foreground">Noted: {context.join(", ")}. Shown for context, never used to change the verdict.</p>}
      </div>

      <div className="card-block p-5 space-y-3">
        <div className="font-semibold">How do you feel right now?</div>
        <div className="flex gap-2" role="group" aria-label="How you feel">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} aria-pressed={feel === n} className={`btn-block size-11 font-mono text-lg ${feel === n ? "btn-glow" : "bg-card"}`} onClick={() => { setFeel(n); patchReadiness(session.at, { feel: n }); }}>{n}</button>
          ))}
        </div>
        {feel !== null && v.light === "amber" && feel >= 4 && <p className="text-sm">You feel fine. Trust that too: the check only measures speed and steadiness.</p>}
        {feel !== null && v.light === "green" && feel <= 2 && <p className="text-sm">Your numbers are usual but you don't feel it. Both count; take the break if you want it.</p>}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/" className="btn-block btn-glow px-6 py-3">Today's SmartSet →</Link>
        <Button variant="outline" className="btn-block bg-card px-5 py-2.5 h-auto" onClick={share}>Share ↗</Button>
        <Button variant="outline" className="btn-block bg-card px-5 py-2.5 h-auto" onClick={onAgain}>Run again</Button>
      </div>
      <p className="text-xs text-muted-foreground">{DISCLAIMER}</p>
    </div>
  );
}
