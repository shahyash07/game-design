import { at } from "@/lib/at";
import { useEffect, useMemo, useRef, useState } from "react";
import { Undo2, RotateCcw, Lightbulb, Eraser, ArrowUp, ArrowDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { THREADS, LADDERS, WORD_TRAILS } from "@/lib/content";
import { adjacent, fullPath, genPath, pathValid, genMini, miniErrors, genPatches, rectangle, patchValid, oneLetterApart, normalizeAnswer, wordPathValid } from "@/lib/puzzles";
import type { GameProps } from "./types";
import { storedPuzzle } from '@/lib/levels';

const REGION = ["bg-region-1", "bg-region-2", "bg-region-3", "bg-region-4", "bg-region-5", "bg-region-6", "bg-region-7"];
function useClock() {
  const start = useRef(Date.now());
  const [ms, setMs] = useState(0);
  useEffect(() => { const i = setInterval(() => setMs(Date.now() - start.current), 500); return () => clearInterval(i); }, []);
  return { start, label: `${Math.floor(ms / 60000)}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")}` };
}
function useSolved(solved: boolean, props: GameProps, start: { current: number }, hint: boolean, raw: string, tip: string) {
  const finished = useRef(false);
  useEffect(() => {
    if (!solved || finished.current) return;
    finished.current = true;
    const ms = Date.now() - start.current;
    props.onFinish({ score: Math.max(20, Math.min(100, Math.round(100 - Math.max(0, ms - 90000) / 4000)) - (hint ? 15 : 0)), raw, accuracy: 1, ms, hintUsed: hint, tip });
  }, [solved, props, start, hint, raw, tip]);
}
function Tools({ undo, reset, hint, canHint, used }: { undo: () => void; reset: () => void; hint?: () => void; canHint?: boolean; used?: boolean }) {
  return <div className="flex justify-center gap-2">
    <Button variant="outline" size="icon" title="Undo" aria-label="Undo" onClick={undo}><Undo2 /></Button>
    <Button variant="outline" size="icon" title="Reset board" aria-label="Reset board" onClick={reset}><RotateCcw /></Button>
    {hint && <Button variant="outline" size="icon" title={used ? "Hint already used" : canHint ? "Reveal one step (−15 points)" : "Try a few moves to unlock a hint"} aria-label="Reveal one step" disabled={!canHint || used} onClick={hint}><Lightbulb /></Button>}
  </div>;
}
const boardClass = "relative grid w-full max-w-96 mx-auto aspect-square border-2 border-ink rounded-md overflow-hidden touch-none select-none";
const cols = (n: number) => n === 4 ? "grid-cols-4" : n === 5 ? "grid-cols-5" : "grid-cols-6";

export function PathGame(props: GameProps) {
  const puzzle = useMemo(() => props.levelNumber ? storedPuzzle('path', props.levelNumber) : genPath(props.seed, props.level), [props.seed, props.level, props.levelNumber]);
  const [path, setPath] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState(false);
  const [message, setMessage] = useState("");
  const drawing = useRef(false);
  const clock = useClock();
  useSolved(pathValid(path, puzzle.n, puzzle.clues, true), props, clock.start, hint, `Connected all ${puzzle.n * puzzle.n} cells`, "Look ahead: avoid isolating empty cells before you reach the final number.");
  function visit(cell: number) {
    setMoves((v) => v + 1);
    setPath((current) => {
      const index = current.indexOf(cell);
      if (index >= 0) { setMessage(""); return current.slice(0, index + 1); }
      const next = [...current, cell];
      if (!pathValid(next, puzzle.n, puzzle.clues)) { setMessage(current.length ? "Use a neighbouring cell and visit numbers in order." : "Start at number 1."); return current; }
      if (puzzle.clues[cell] === puzzle.count && next.length < puzzle.n * puzzle.n) { setMessage("Fill every cell before reaching the last number."); return current; }
      setMessage(""); return next;
    });
  }
  return <div className="space-y-4">
    <div className="flex justify-between font-mono text-sm"><span>{path.length}/{puzzle.n * puzzle.n} cells</span><span>{clock.label}</span></div>
    <div className={`${boardClass} ${cols(puzzle.n)}`} onPointerMove={(e) => {
      if (!drawing.current) return;
      const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-path-cell]");
      if (!target || !e.currentTarget.contains(target)) return;
      const cell = Number(target.dataset['pathCell']);
      if (Number.isInteger(cell) && cell !== path.at(-1)) visit(cell);
    }} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} onLostPointerCapture={() => { drawing.current = false; }}>
      <svg className="absolute inset-0 size-full pointer-events-none z-10 text-primary" viewBox={`0 0 ${puzzle.n} ${puzzle.n}`} aria-hidden="true"><polyline points={path.map((c) => `${c % puzzle.n + 0.5},${Math.floor(c / puzzle.n) + 0.5}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="0.14" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {Array.from({ length: puzzle.n * puzzle.n }, (_, c) => <Button key={c} data-path-cell={c} variant="ghost" aria-label={`row ${Math.floor(c / puzzle.n) + 1} column ${c % puzzle.n + 1}${puzzle.clues[c] ? ` number ${puzzle.clues[c]}` : ""}`} className={`relative h-full w-full p-0 rounded-none border border-border ${path.includes(c) ? "bg-accent/40" : "bg-card"}`} onPointerDown={(e) => { if (e.pointerType === "mouse" && e.button !== 0) return; drawing.current = true; e.currentTarget.parentElement?.setPointerCapture(e.pointerId); visit(c); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); visit(c); } }}>
        {puzzle.clues[c] && <span className="relative z-10 size-7 sm:size-9 bg-ink text-paper rounded-full flex items-center justify-center font-mono font-bold text-base">{puzzle.clues[c]}</span>}
      </Button>)}
    </div>
    <div className="min-h-5 text-center text-sm text-destructive" role="status">{message}</div>
    <Tools undo={() => setPath((p) => p.slice(0, -1))} reset={() => { setPath([]); setMessage(""); }} canHint={moves >= 4} used={hint} hint={() => { setHint(true); setPath(puzzle.solution.slice(0, Math.max(2, path.length + 1))); }} />
  </div>;
}

export function MiniSudokuGame(props: GameProps) {
  const puzzle = useMemo(() => props.levelNumber ? storedPuzzle('sudoku', props.levelNumber) : genMini(props.seed, props.level), [props.seed, props.level, props.levelNumber]);
  const [grid, setGrid] = useState<(number | null)[]>([...puzzle.givens]);
  const [selected, setSelected] = useState<number | null>(null);
  const [notes, setNotes] = useState<number[][]>(Array.from({ length: 36 }, () => []));
  const [noteMode, setNoteMode] = useState(false);
  const [history, setHistory] = useState<{ grid: (number | null)[]; notes: number[][] }[]>([]);
  const [hint, setHint] = useState(false);
  const clock = useClock();
  const { bad, solved } = miniErrors(grid);
  useSolved(solved, props, clock.start, hint, "Solved 6×6 Sudoku", "Check the 2×3 boxes as well as rows and columns; a missing digit often has only one possible home.");
  function enter(v: number | null) {
    if (selected === null || puzzle.givens[selected] !== null) return;
    setHistory((h) => [...h, { grid: [...grid], notes: notes.map((a) => [...a]) }]);
    if (noteMode && v !== null) setNotes((ns) => ns.map((a, i) => i === selected ? a.includes(v) ? a.filter((x) => x !== v) : [...a, v].sort() : a));
    else { setGrid((g) => g.map((x, i) => i === selected ? v : x)); setNotes((ns) => ns.map((a, i) => i === selected ? [] : a)); }
  }
  return <div className="space-y-4" onKeyDown={(e) => { if (/^[1-6]$/.test(e.key)) enter(Number(e.key)); if (e.key === "Backspace" || e.key === "Delete") { e.preventDefault(); enter(null); } }}>
    <div className="flex justify-between font-mono text-sm"><span>{grid.filter((v) => v !== null).length}/36 cells</span><span>{clock.label}</span></div>
    <div className={`${boardClass} grid-cols-6`}>
      {grid.map((v, c) => <Button key={c} variant="ghost" aria-label={`row ${Math.floor(c / 6) + 1} column ${c % 6 + 1}${v ? ` value ${v}` : ""}${puzzle.givens[c] !== null ? " fixed" : ""}`} onClick={() => setSelected(c)} className={`h-full w-full p-0 rounded-none border border-border font-mono text-xl sm:text-2xl ${c % 6 === 3 ? "border-l-2 border-l-ink" : ""} ${Math.floor(c / 6) === 2 || Math.floor(c / 6) === 4 ? "border-t-2 border-t-ink" : ""} ${selected === c ? "bg-accent" : puzzle.givens[c] !== null ? "bg-muted font-bold" : "bg-card text-primary"} ${bad.has(c) ? "text-destructive ring-2 ring-inset ring-destructive" : ""}`}>
        {v ?? <span className="grid grid-cols-3 w-full h-full p-1 text-[10px] sm:text-xs text-muted-foreground">{[1, 2, 3, 4, 5, 6].map((digit) => <span key={digit}>{notes[c]?.includes(digit) ? digit : ""}</span>)}</span>}
      </Button>)}
    </div>
    <div className="grid grid-cols-6 max-w-96 mx-auto gap-2">{[1, 2, 3, 4, 5, 6].map((v) => <Button key={v} variant="outline" className="h-11 font-mono text-lg" onClick={() => enter(v)} disabled={selected === null || puzzle.givens[selected] !== null}>{v}</Button>)}</div>
    <div className="flex justify-center gap-2"><Button variant={noteMode ? "secondary" : "outline"} aria-pressed={noteMode} onClick={() => setNoteMode((x) => !x)}>Pencil marks</Button><Button variant="outline" size="icon" title="Erase selected cell" aria-label="Erase selected cell" onClick={() => enter(null)}><Eraser /></Button></div>
    <Tools undo={() => { const last = history.at(-1); if (last) { setGrid(last.grid); setNotes(last.notes); setHistory((h) => h.slice(0, -1)); } }} reset={() => { setGrid([...puzzle.givens]); setNotes(Array.from({ length: 36 }, () => [])); setHistory([]); }} used={hint} canHint={history.length >= 4} hint={() => { const c = grid.findIndex((v, i) => v !== puzzle.solution[i]); if (c < 0) return; setHint(true); setGrid((g) => g.map((v, i) => i === c ? at(puzzle.solution, i) : v)); setSelected(c); }} />
    {bad.size > 0 && <p className="text-center text-sm text-destructive" role="status">A digit repeats in a row, column or box.</p>}
  </div>;
}

export function CategoryGame(props: GameProps) {
  const q = props.levelNumber ? storedPuzzle('category', props.levelNumber) : at(THREADS, Math.abs(props.seed) % THREADS.length);
  const [revealed, setRevealed] = useState(1);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [ended, setEnded] = useState<boolean | null>(null);
  const clock = useClock();
  function submit() {
    if (!guess.trim() || ended !== null) return;
    const correct = q.aliases.some((a) => normalizeAnswer(a) === normalizeAnswer(guess)) || normalizeAnswer(q.answer) === normalizeAnswer(guess);
    setGuesses((xs) => [...xs, guess.trim()]); setGuess("");
    if (correct) setEnded(true);
    else if (revealed === 5) setEnded(false);
    else setRevealed((n) => n + 1);
  }
  return <div className="space-y-5">
    <div className="flex justify-between font-mono text-sm"><span>Clue {revealed}/5</span><span>{clock.label}</span></div>
    <div className="space-y-2">{q.clues.map((clue, i) => <div key={i} className={`border-2 rounded-md p-4 font-display text-2xl ${i < revealed ? "bg-region-4 border-ink" : "bg-muted border-border text-muted-foreground"}`}>{i < revealed ? clue : <span className="font-mono text-sm">{i + 1} · · ·</span>}</div>)}</div>
    {ended === null ? <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}><Input aria-label="Shared category" placeholder="What connects these clues?" value={guess} onChange={(e) => setGuess(e.target.value)} className="h-11 bg-card" autoComplete="off" /><Button type="submit" className="h-11" disabled={!guess.trim()}>Guess</Button></form> : <div className="space-y-3 border-t-2 border-ink pt-4"><h2 className="text-2xl">{ended ? "You found the thread!" : q.answer}</h2><p>{q.explain}</p><Button onClick={() => props.onFinish({ score: ended ? Math.max(20, 120 - revealed * 20) : 0, raw: ended ? `Found with ${revealed}/5 clues` : "Connection not found", accuracy: ended ? 1 : 0, ms: Date.now() - clock.start.current, hintUsed: false, tip: "Try a second meaning of each clue. A connection may be a shared word, object or category." })}>Finish <Check /></Button></div>}
    {!!guesses.length && <div className="text-sm text-muted-foreground space-y-1">{guesses.map((g, i) => <div key={i}>{i + 1}. {g} {ended === true && i === guesses.length - 1 ? "✓" : "✕"}</div>)}</div>}
  </div>;
}

export function LadderGame(props: GameProps) {
  const q = props.levelNumber ? storedPuzzle('ladder', props.levelNumber) : at(LADDERS, Math.abs(props.seed) % LADDERS.length);
  const middle = useMemo(() => [1, 2, 3].sort((a, b) => ((a * 7919 + props.seed) % 11) - ((b * 7919 + props.seed) % 11)), [props.seed]);
  const [values, setValues] = useState<Record<number, string>>({});
  const [order, setOrder] = useState(middle);
  const [stage, setStage] = useState<"clues" | "order" | "ends">("clues");
  const [error, setError] = useState("");
  const [checks, setChecks] = useState(0);
  const [hint, setHint] = useState(false);
  const clock = useClock();
  useSolved(stage === "ends" && values[0] === q.words[0] && values[4] === q.words[4], props, clock.start, hint, "Completed the word ladder", "Solve the clearest clue first, then compare letter positions to place neighbouring rungs.");
  function check() {
    setChecks((n) => n + 1);
    if (stage === "clues") { if (middle.every((i) => values[i] === q.words[i])) { setStage("order"); setError(""); } else setError("At least one answer does not fit its clue."); }
    else if (stage === "order") { if (order.every((i, k) => i === k + 1) && order.every((i, k) => k === 0 || oneLetterApart(at(q.words, at(order, k - 1)), at(q.words, i)))) { setStage("ends"); setError(""); } else setError("Arrange the rungs from top to bottom; neighbouring words change one letter."); }
  }
  function field(i: number) { return <div key={i} className="grid grid-cols-[1fr_7rem] gap-3 items-center border-b border-border py-3"><label htmlFor={`rung-${i}`} className="text-sm">{q.clues[i]}</label><Input id={`rung-${i}`} aria-label={q.clues[i]} value={values[i] ?? ""} maxLength={at(q.words, i).length} onChange={(e) => setValues((v) => ({ ...v, [i]: e.target.value.toUpperCase().replace(/[^A-Z]/g, "") }))} autoComplete="off" className="bg-card font-mono text-center uppercase" /></div>; }
  return <div className="space-y-4">
    <div className="flex justify-between font-mono text-sm"><span>{stage === "clues" ? "1 · Solve the clues" : stage === "order" ? "2 · Arrange the rungs" : "3 · Complete the ends"}</span><span>{clock.label}</span></div>
    {stage === "clues" ? middle.map(field) : <div className="max-w-sm mx-auto space-y-2">{stage === "ends" && field(0)}{order.map((i, k) => <div key={i} className="flex items-center gap-2 bg-region-2 border-2 border-ink rounded-md p-2"><span className="font-mono text-xl flex-1 text-center">{q.words[i]}</span>{stage === "order" && <><Button variant="ghost" size="icon" aria-label={`Move ${q.words[i]} up`} disabled={k === 0} onClick={() => setOrder((old) => { const a = [...old]; [a[k - 1], a[k]] = [at(a, k), at(a, k - 1)]; return a; })}><ArrowUp /></Button><Button variant="ghost" size="icon" aria-label={`Move ${q.words[i]} down`} disabled={k === order.length - 1} onClick={() => setOrder((old) => { const a = [...old]; [a[k], a[k + 1]] = [at(a, k + 1), at(a, k)]; return a; })}><ArrowDown /></Button></>}</div>)}{stage === "ends" && field(4)}</div>}
    {stage === "ends" ? <p className="text-sm text-muted-foreground">{q.endClue}</p> : <Button onClick={check}>Check {stage === "clues" ? "answers" : "order"} <Check /></Button>}
    <p role="status" className="text-sm text-destructive min-h-5">{error}</p>
    <Button variant="outline" size="icon" title="Reveal a rung (−15 points)" aria-label="Reveal a rung" disabled={checks < 2 || hint} onClick={() => { setHint(true); if (stage === "clues") { const i = middle.find((k) => values[k] !== q.words[k]); if (i !== undefined) setValues((v) => ({ ...v, [i]: at(q.words, i) })); } else if (stage === "order") setOrder([1, 2, 3]); else setValues((v) => ({ ...v, [0]: at(q.words, 0) })); }}><Lightbulb /></Button>
  </div>;
}

export function PatchworkGame(props: GameProps) {
  const puzzle = useMemo(() => props.levelNumber ? storedPuzzle('patches', props.levelNumber) : genPatches(props.seed, props.level), [props.seed, props.level, props.levelNumber]);
  const [patches, setPatches] = useState<number[][]>([]);
  const [anchor, setAnchor] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const clock = useClock();
  const covered = patches.flat();
  useSolved(covered.length === puzzle.n * puzzle.n, props, clock.start, false, `Completed ${patches.length} rectangles`, "Start with clues near a corner. A rectangle's area is its width multiplied by its height.");
  function commit(a: number, b: number) {
    const cells = rectangle(a, b, puzzle.n);
    if (cells.some((c) => covered.includes(c))) setMessage("Rectangles cannot overlap.");
    else if (!patchValid(cells, puzzle.n, puzzle.clues)) setMessage("Each rectangle needs exactly one clue matching its area.");
    else { setPatches((ps) => [...ps, cells]); setMessage(""); }
    setAnchor(null); setEnd(null);
  }
  const preview = anchor !== null && end !== null ? rectangle(anchor, end, puzzle.n) : [];
  return <div className="space-y-4">
    <div className="flex justify-between font-mono text-sm"><span>{covered.length}/{puzzle.n * puzzle.n} cells</span><span>{clock.label}</span></div>
    <div className={`${boardClass} ${cols(puzzle.n)}`}>
      {Array.from({ length: puzzle.n * puzzle.n }, (_, c) => { const p = patches.findIndex((a) => a.includes(c)); const clue = puzzle.clues.find((a) => a.cell === c); return <Button key={c} variant="ghost" aria-label={`row ${Math.floor(c / puzzle.n) + 1} column ${c % puzzle.n + 1}${clue ? ` area ${clue.area}` : ""}`} className={`h-full w-full rounded-none border border-border p-0 font-mono text-xl ${preview.includes(c) ? "bg-accent ring-2 ring-inset ring-ink" : p >= 0 ? REGION[p % REGION.length] : "bg-card"} ${p >= 0 && (c % puzzle.n === 0 || !patches[p]?.includes(c - 1)) ? "border-l-2 border-l-ink" : ""} ${p >= 0 && !patches[p]?.includes(c - puzzle.n) ? "border-t-2 border-t-ink" : ""}`} onPointerDown={() => { if (anchor === null) { setAnchor(c); setEnd(c); } }} onPointerEnter={() => { if (anchor !== null) setEnd(c); }} onPointerUp={() => { if (anchor !== null && (anchor !== c || end !== anchor)) commit(anchor, c); }} onClick={() => { if (anchor !== null && anchor !== c) commit(anchor, c); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (anchor === null) { setAnchor(c); setEnd(c); } else commit(anchor, c); } }}>{clue?.area}</Button>; })}
    </div>
    <p className="text-sm text-destructive text-center min-h-5" role="status">{message}</p>
    <div className="flex justify-center gap-2"><Tools undo={() => { setPatches((p) => p.slice(0, -1)); setAnchor(null); setEnd(null); }} reset={() => { setPatches([]); setAnchor(null); setEnd(null); setMessage(""); }} />{anchor !== null && <Button variant="outline" onClick={() => commit(anchor, end ?? anchor)}>Place rectangle <Check /></Button>}</div>
  </div>;
}

export function WordTrailsGame(props: GameProps) {
  const q = props.levelNumber ? storedPuzzle('wordtrail', props.levelNumber) : at(WORD_TRAILS, Math.abs(props.seed) % WORD_TRAILS.length);
  const puzzle = useMemo(() => { if (props.levelNumber) return storedPuzzle('wordtrail', props.levelNumber); const path = fullPath(4, props.seed); const grid = Array<string>(16).fill(""); [...q.words.join("")].forEach((l, i) => { grid[at(path, i)] = l; }); return { path, grid }; }, [props.seed, props.levelNumber, q]);
  const [found, setFound] = useState<{ word: string; cells: number[] }[]>([]);
  const [path, setPath] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [hint, setHint] = useState(false);
  const [message, setMessage] = useState("");
  const drawing = useRef(false);
  const clock = useClock();
  const used = found.flatMap((f) => f.cells);
  useSolved(used.length === 16, props, clock.start, hint, "Found all four words", "Look for likely letter pairs, then check that the remaining letters can still form complete words.");
  function visit(c: number) {
    if (used.includes(c)) return;
    setMoves((n) => n + 1);
    setPath((old) => { if (old.includes(c)) return old.slice(0, old.indexOf(c) + 1); if (!old.length || adjacent(at(old, old.length - 1), c, 4)) return [...old, c]; return old; });
    setMessage("");
  }
  function submit() {
    const word = path.map((c) => puzzle.grid[c]).join("");
    if (q.words.includes(word) && !found.some((f) => f.word === word) && wordPathValid(path, puzzle.grid, 4, word, used)) { setFound((fs) => [...fs, { word, cells: [...path] }]); setPath([]); setMessage(""); }
    else setMessage("That is not one of this theme's hidden words.");
  }
  return <div className="space-y-4">
    <div className="flex justify-between text-sm"><span className="font-semibold">{q.theme}</span><span className="font-mono">{clock.label}</span></div>
    <div className="grid grid-cols-4 gap-2">{q.words.map((word) => <div key={word} className={`text-center py-2 rounded-md border border-ink font-mono text-sm ${found.some((f) => f.word === word) ? "bg-success text-success-foreground" : "bg-muted"}`}>{found.some((f) => f.word === word) ? word : `${word.length} letters`}</div>)}</div>
    <div className={`${boardClass} grid-cols-4`} onPointerUp={() => { drawing.current = false; }} onPointerLeave={() => { drawing.current = false; }}>
      {puzzle.grid.map((letter, c) => { const f = found.findIndex((v) => v.cells.includes(c)); return <Button key={c} variant="ghost" aria-label={`row ${Math.floor(c / 4) + 1} column ${c % 4 + 1} letter ${letter}`} disabled={f >= 0} className={`h-full w-full rounded-none border border-border font-mono text-2xl p-0 disabled:opacity-100 ${f >= 0 ? REGION[f] : path.includes(c) ? "bg-accent ring-2 ring-inset ring-ink" : "bg-card"}`} onPointerDown={() => { drawing.current = true; visit(c); }} onPointerEnter={() => { if (drawing.current) visit(c); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); visit(c); } }}>{letter}</Button>; })}
    </div>
    <div className="flex gap-3 justify-center items-center"><span className="font-mono text-xl min-w-20 text-center">{path.map((c) => puzzle.grid[c]).join("") || "· · · ·"}</span><Button disabled={!path.length} onClick={submit}>Submit word <Check /></Button></div>
    <p role="status" className="min-h-5 text-sm text-center text-destructive">{message}</p>
    <Tools undo={() => { if (path.length) setPath((p) => p.slice(0, -1)); else setFound((fs) => fs.slice(0, -1)); }} reset={() => { setFound([]); setPath([]); }} canHint={moves >= 4} used={hint} hint={() => { const i = q.words.findIndex((w) => !found.some((f) => f.word === w)); if (i < 0) return; setHint(true); setPath(puzzle.path.slice(i * 4, i * 4 + 2)); }} />
  </div>;
}