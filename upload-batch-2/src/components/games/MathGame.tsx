import { at } from "@/lib/at";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GameProps } from "./types";
import { rng } from "@/lib/progress";

interface Q { text: string; answer: number; options: number[] }

function makeQ(r: () => number, level: number): Q {
  const ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1));
  const ops = level === 1 ? ["+", "-"] : level === 2 ? ["+", "-", "×", "÷"] : ["+", "-", "×", "÷", "%"];
  const op = ops[ri(0, ops.length - 1)];
  const max = level === 1 ? 20 : level === 2 ? 50 : 99;
  let a = ri(2, max), b = ri(2, max), ans = 0, text = "";
  switch (op) {
    case "+": ans = a + b; text = `${a} + ${b}`; break;
    case "-": if (b > a) [a, b] = [b, a]; ans = a - b; text = `${a} − ${b}`; break;
    case "×": a = ri(2, level === 3 ? 19 : 12); b = ri(2, 12); ans = a * b; text = `${a} × ${b}`; break;
    case "÷": b = ri(2, 12); ans = ri(2, 12); a = b * ans; text = `${a} ÷ ${b}`; break;
    case "%": { const p = at([5, 10, 15, 20, 25, 50, 75], ri(0, 6)); a = ri(1, 40) * 20; ans = (a * p) / 100; text = `${p}% of ${a}`; }
  }
  const set = new Set([ans]);
  while (set.size < 4) { const d = ans + ri(-10, 10) || ans + ri(1, 5); if (d >= 0) set.add(d); }
  const options = [...set].sort(() => r() - 0.5);
  return { text, answer: ans, options };
}

export function MathGame({ level, seed, onFinish, mode }: GameProps & { mode: "sprint" | "fifty" }) {
  const r = useMemo(() => rng(seed), [seed]);
  const [q, setQ] = useState<Q>(() => makeQ(r, level));
  const [started, setStarted] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState<"ok" | "no" | null>(null);
  const [typed, setTyped] = useState("");
  const [now, setNow] = useState(0);
  const start = useRef(0);
  const done = useRef(false);
  const keypad = level >= 2;
  const LIMIT = 30000, TARGET = 50;

  useEffect(() => {
    if (!started) return;
    const t = setInterval(() => setNow(Date.now() - start.current), 100);
    return () => clearInterval(t);
  }, [started]);

  const finish = (c: number, w: number) => {
    if (done.current) return; done.current = true;
    const ms = Date.now() - start.current;
    const acc = c + w ? c / (c + w) : 0;
    if (mode === "sprint") {
      onFinish({ score: Math.min(100, Math.round(c * 5 * acc)), raw: `${c} correct in 30s`, accuracy: acc, ms, hintUsed: false,
        tip: acc < 0.85 ? "Slow down slightly — accuracy compounds faster than speed." : "Try anchoring on round numbers: 48+27 = 50+25." });
    } else {
      const secs = ms / 1000;
      onFinish({ score: Math.max(10, Math.min(100, Math.round(100 - (secs - 60) / 2 - w * 2))), raw: `50 correct in ${secs.toFixed(1)}s · ${w} misses`, accuracy: acc, ms, hintUsed: false,
        tip: w > 5 ? "Misses cost more than hesitation here. Check before you tap." : "Chunk multiplication: 14×6 = 10×6 + 4×6." });
    }
  };

  useEffect(() => { if (mode === "sprint" && started && now >= LIMIT) finish(correct, wrong); });

  const answer = (v: number) => {
    if (!started || done.current) return;
    const ok = v === q.answer;
    const c = correct + (ok ? 1 : 0), w = wrong + (ok ? 0 : 1);
    setCorrect(c); setWrong(w); setFlash(ok ? "ok" : "no"); setTyped("");
    setTimeout(() => setFlash(null), 180);
    if (ok || !keypad) setQ(makeQ(r, level));
    if (mode === "fifty" && c >= TARGET) finish(c, w);
  };

  const onKey = (k: string) => {
    if (k === "⌫") return setTyped((t) => t.slice(0, -1));
    const t = typed + k;
    setTyped(t);
    if (Number(t) === q.answer) answer(q.answer);
    else if (t.length >= String(q.answer).length + 1) answer(-1);
  };

  useEffect(() => {
    if (!keypad || !started) return;
    const h = (e: KeyboardEvent) => { if (/^[0-9]$/.test(e.key)) onKey(e.key); if (e.key === "Backspace") onKey("⌫"); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  });

  if (!started) {
    return (
      <div className="text-center space-y-5 py-8">
        <p className="text-muted-foreground max-w-sm mx-auto">
          {mode === "sprint" ? "Solve as many as you can in 30 seconds." : "Get 50 correct as fast as you can."}{" "}
          {keypad ? "Type on the keypad (or your keyboard)." : "Tap the right answer."}
        </p>
        <button className="btn-block bg-primary text-primary-foreground px-8 py-3 text-lg" onClick={() => { start.current = Date.now(); setStarted(true); }}>Start</button>
      </div>
    );
  }

  const progress = mode === "sprint" ? Math.max(0, 1 - now / LIMIT) : correct / TARGET;
  return (
    <div className="space-y-6">
      <div className="flex justify-between font-mono text-sm">
        <span>✓ {correct} · ✗ {wrong}</span>
        <span>{mode === "sprint" ? `${Math.max(0, Math.ceil((LIMIT - now) / 1000))}s` : `${(now / 1000).toFixed(1)}s`}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden border border-ink">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className={`card-block py-10 text-center font-mono text-5xl font-bold transition-colors ${flash === "ok" ? "bg-success text-success-foreground" : flash === "no" ? "bg-destructive text-destructive-foreground" : ""}`}>
        {q.text}
        {keypad && <div className="text-3xl mt-3 h-10 text-primary">{typed || "_"}</div>}
      </div>
      {keypad ? (
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {["1","2","3","4","5","6","7","8","9","⌫","0"].map((k) => (
            <button key={k} className="btn-block bg-card py-4 font-mono text-2xl" onClick={() => onKey(k)}>{k}</button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {q.options.map((o) => (
            <button key={o} className="btn-block bg-card py-5 font-mono text-3xl" onClick={() => answer(o)}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}
