import { useEffect, useState } from "react";

export type Skill = "math" | "logic" | "data" | "ai";
export type GameId = "sprint" | "fifty" | "queens" | "tango" | "deduce" | "data" | "aicheck" | "path" | "category" | "ladder" | "sudoku" | "patches" | "wordtrail" | "2048";

/** A confidence (0.5–1) stated before the reveal, and whether the answer was right. */
export interface Call { confidence: number; correct: boolean }

export interface ReadinessItem { ms: number; correct: boolean; round: number }
/** One Green Light check. Verdicts are recomputed from history, never stored, so rule changes apply retroactively. */
export interface ReadinessSession {
  at: number;
  date: string; // YYYY-MM-DD
  hour: number; // local hour, for the time-of-day baseline band
  items: ReadinessItem[];
  roundMs: number[];
  sleptUnder6?: boolean;
  caffeine?: boolean;
  decision?: string;
  feel?: number; // 1-5 self-report after the verdict
  rating?: number; // 1-5, how the tagged decision went
}

export interface Attempt {
  game: GameId;
  skill: Skill;
  score: number; // 0-100 normalized
  raw: string; // human-readable result
  accuracy: number; // 0-1
  ms: number;
  hintUsed: boolean;
  thoughtFirst: boolean; // committed an answer before any explanation
  date: string; // YYYY-MM-DD
  at: number;
  levelNumber?: number;
  puzzleDifficulty?: 1 | 2 | 3;
  calls?: Call[];
}

export interface ProgressState {
  attempts: Attempt[];
  selectedLevels?: Partial<Record<GameId, number>>;
  mixPool?: GameId[];
  readiness?: ReadinessSession[];
}

const KEY = "staysmart.progress.v1";
const EVT = "staysmart:progress";

export const today = (d = new Date()) => {
  const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return z.toISOString().slice(0, 10);
};

export function load(): ProgressState {
  if (typeof window === "undefined") return { attempts: [] };
  try {
    return JSON.parse(localStorage.getItem(KEY) || "") as ProgressState;
  } catch {
    return { attempts: [] };
  }
}

function save(s: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event(EVT));
}

export function recordAttempt(a: Omit<Attempt, "date" | "at">) {
  const s = load();
  s.attempts.push({ ...a, date: today(), at: Date.now() });
  save(s);
}

export function selectLevel(game: GameId, number: number) {
  const s = load();
  s.selectedLevels = { ...s.selectedLevels, [game]: number };
  save(s);
}

export function setMixPool(pool: GameId[]) {
  const s = load();
  s.mixPool = pool;
  save(s);
}

export function recordReadiness(session: ReadinessSession) {
  const s = load();
  s.readiness = [...(s.readiness ?? []), session];
  save(s);
}

export function patchReadiness(at: number, patch: Partial<ReadinessSession>) {
  const s = load();
  s.readiness = (s.readiness ?? []).map((r) => (r.at === at ? { ...r, ...patch } : r));
  save(s);
}

export function useProgress(): ProgressState & { ready: boolean } {
  const [s, setS] = useState<ProgressState>({ attempts: [] });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const f = () => setS(load());
    f();
    setReady(true);
    window.addEventListener(EVT, f);
    window.addEventListener("storage", f);
    return () => {
      window.removeEventListener(EVT, f);
      window.removeEventListener("storage", f);
    };
  }, []);
  return { ...s, ready };
}

/** Consecutive days (ending today or yesterday) with at least one attempt. */
export function streak(attempts: Attempt[], now = new Date()): number {
  const days = new Set(attempts.map((a) => a.date));
  let n = 0;
  const d = new Date(now);
  if (!days.has(today(d))) d.setDate(d.getDate() - 1);
  while (days.has(today(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Share of the last `days` days with at least one attempt. The primary habit number; the streak is secondary. */
export function consistency(attempts: Attempt[], days = 28, now = new Date()): number {
  const have = new Set(attempts.map((a) => a.date));
  const d = new Date(now);
  let n = 0;
  for (let i = 0; i < days; i++) {
    if (have.has(today(d))) n++;
    d.setDate(d.getDate() - 1);
  }
  return n / days;
}

/** Skill rating 0-100: recency-weighted average of last 10 scores; 50 when unplayed. */
export function skillRating(attempts: Attempt[], skill: Skill): number {
  const xs = attempts.filter((a) => a.skill === skill).slice(-10);
  if (!xs.length) return 50;
  let w = 0, sum = 0;
  xs.forEach((a, i) => { const wi = i + 1; w += wi; sum += a.score * wi; });
  return Math.round(sum / w);
}

/** Difficulty level 1-3 for a game from recent accuracy. */
export function difficulty(attempts: Attempt[], game: GameId): 1 | 2 | 3 {
  const xs = attempts.filter((a) => a.game === game).slice(-3);
  if (xs.length < 2) return 1;
  const acc = xs.reduce((s, a) => s + a.accuracy, 0) / xs.length;
  if (acc >= 0.85) return 3;
  if (acc >= 0.65) return 2;
  return 1;
}

/** Deterministic seeded RNG */
export function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const daySeed = (d = today()) => Number(d.replace(/-/g, ""));
