import { at } from "@/lib/at";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GameProps } from "./types";
import { genQueens, queensErrors, genTango, tangoErrors } from "@/lib/puzzles";
import { storedPuzzle } from '@/lib/levels';

const REG = ["bg-region-1","bg-region-2","bg-region-3","bg-region-4","bg-region-5","bg-region-6","bg-region-7"];

function useTimer() {
  const start = useRef(Date.now()); const [t, setT] = useState(0);
  useEffect(() => { const i = setInterval(() => setT(Date.now() - start.current), 250); return () => clearInterval(i); }, []);
  return { t, start };
}
const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}`;
const timeScore = (ms: number, par: number) => Math.max(20, Math.min(100, Math.round(100 - ((ms - par) / 1000) * 0.5)));

export function QueensGame({ level, seed, onFinish, levelNumber }: GameProps) {
  const n = level === 1 ? 5 : level === 2 ? 6 : 7;
  const { region, sol } = useMemo(() => levelNumber ? storedPuzzle('queens', levelNumber) : genQueens(n, seed), [n, seed, levelNumber]);
  const [cells, setCells] = useState<number[][]>(() => Array.from({ length: n }, () => Array(n).fill(0))); // 0 empty,1 x,2 crown
  const [hint, setHint] = useState(false);
  const { t, start } = useTimer();
  const crowns = cells.map((r) => r.map((v) => v === 2));
  const { bad, solved } = queensErrors(region, crowns);
  const moves = useRef(0);

  useEffect(() => {
    if (solved) {
      const ms = Date.now() - start.current;
      setTimeout(() => onFinish({ score: timeScore(ms, 60000) - (hint ? 15 : 0), raw: `Solved ${n}×${n} in ${fmt(ms)}`, accuracy: 1, ms, hintUsed: hint,
        tip: "Start with the smallest colour region — it has the fewest places a crown can go." }), 600);
    }
  }, [solved]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (y: number, x: number) => {
    if (solved) return; moves.current++;
    setCells((c) => c.map((row, yy) => row.map((v, xx) => (yy === y && xx === x ? (v + 1) % 3 : v))));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tap once for ✕, twice for a crown.</span><span className="font-mono">{fmt(t)}</span></div>
      <div className="card-block p-2 mx-auto w-fit">
        <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {cells.map((row, y) => row.map((v, x) => {
            const id = at(region, y)[x] ?? 0;
            const edge = `${y > 0 && at(region, y-1)[x] !== id ? "border-t-2" : "border-t"} ${x > 0 && at(region, y)[x-1] !== id ? "border-l-2" : "border-l"} border-ink`;
            const isBad = bad.has(`${y},${x}`);
            return (
              <button key={`${y}-${x}`} aria-label={`row ${y+1} column ${x+1}`} onClick={() => tap(y, x)}
                className={`${REG[id % REG.length]} ${edge} size-11 sm:size-14 flex items-center justify-center text-2xl ${isBad ? "text-destructive" : ""}`}>
                {v === 1 && <span className="text-muted-foreground text-base">✕</span>}
                {v === 2 && <span className={solved ? "animate-pop" : ""}>♛</span>}
              </button>
            );
          }))}
        </div>
      </div>
      <div className="text-center">
        {!hint ? (
          <button className="text-xs underline text-muted-foreground disabled:opacity-40" disabled={moves.current < 6} onClick={() => {
            setHint(true);
            setCells((c) => c.map((row, y) => row.map((v, x) => (x === sol[0] && y === 0 ? 2 : v))));
          }}>{moves.current < 6 ? "Hint unlocks after a few attempts" : "Reveal one crown (−15)"}</button>
        ) : <span className="text-xs text-muted-foreground">Hint used</span>}
      </div>
    </div>
  );
}

export function TangoGame({ level, seed, onFinish, levelNumber }: GameProps) {
  const { givens } = useMemo(() => levelNumber ? storedPuzzle('tango', levelNumber) : genTango(seed, level), [seed, level, levelNumber]);
  const [grid, setGrid] = useState<(number | null)[][]>(() => givens.map((r) => [...r]));
  const { t, start } = useTimer();
  const { bad, solved } = tangoErrors(grid);

  useEffect(() => {
    if (solved) {
      const ms = Date.now() - start.current;
      setTimeout(() => onFinish({ score: timeScore(ms, 75000), raw: `Solved 6×6 in ${fmt(ms)}`, accuracy: 1, ms, hintUsed: false,
        tip: "Two in a row? The cells on both ends must be the opposite symbol." }), 600);
    }
  }, [solved]); // eslint-disable-line react-hooks/exhaustive-deps

  const tap = (y: number, x: number) => {
    if (at(givens, y)[x] !== null || solved) return;
    setGrid((g) => g.map((row, yy) => row.map((v, xx) => (yy === y && xx === x ? (v === null ? 0 : v === 0 ? 1 : null) : v))));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm"><span className="text-muted-foreground">Equal ☀ and ☾ per row/column. Never three alike in a line.</span><span className="font-mono">{fmt(t)}</span></div>
      <div className="card-block p-2 mx-auto w-fit">
        <div className="grid grid-cols-6 gap-1">
          {grid.map((row, y) => row.map((v, x) => {
            const fixed = at(givens, y)[x] !== null;
            return (
              <button key={`${y}-${x}`} aria-label={`row ${y+1} column ${x+1}`} onClick={() => tap(y, x)}
                className={`size-11 sm:size-14 rounded-md border-2 text-2xl flex items-center justify-center ${fixed ? "bg-muted border-border" : "bg-card border-ink"} ${bad.has(`${y},${x}`) ? "ring-2 ring-destructive" : ""}`}>
                {v === 0 && <span className="text-primary">☀</span>}
                {v === 1 && <span className="text-skill-logic">☾</span>}
              </button>
            );
          }))}
        </div>
      </div>
    </div>
  );
}
