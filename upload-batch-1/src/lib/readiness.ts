import { at } from "./at";
import { rng, type ReadinessSession } from "./progress";

export const ROUNDS = 3;
export const ITEMS_PER_ROUND = 15;
export const BASELINE_MIN_SESSIONS = 5;
export const BASELINE_MIN_DAYS = 3;
export const BASELINE_WINDOW = 20;
export const HOUR_BAND = 2;
const DAY = 86_400_000;

export interface Item { text: string; answer: number }
export type Light = "green" | "amber" | "grey";
export interface Metrics { medianRt: number; accuracy: number; variability: number; lapses: number; roundSlope: number }
export interface Verdict {
  light: Light;
  z: { speed: number; accuracy: number; variability: number } | null;
  baseline: { sessions: number; days: number };
  metrics: Metrics;
  headline: string;
  note: string;
  action: string;
}

/** Same structure every session (8 adds, 2 subtractions, 5 products per round); only operands vary, so sessions stay comparable. */
export function makeItems(seed: number): Item[][] {
  const r = rng(seed);
  const ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1));
  return Array.from({ length: ROUNDS }, () => {
    const items: Item[] = [];
    for (let i = 0; i < 5; i++) { const a = ri(1, 4) * 10 + ri(0, 4), b = ri(1, 4) * 10 + ri(0, 5); items.push({ text: `${a} + ${b}`, answer: a + b }); }
    for (let i = 0; i < 5; i++) {
      if (i % 2 === 0) { const a = ri(1, 4) * 10 + ri(5, 9), b = ri(1, 4) * 10 + ri(5, 9); items.push({ text: `${a} + ${b}`, answer: a + b }); }
      else { const ta = ri(3, 9), a = ta * 10 + ri(0, 4), b = ri(1, ta - 1) * 10 + ri(5, 9); items.push({ text: `${a} − ${b}`, answer: a - b }); }
    }
    for (let i = 0; i < 5; i++) { const a = ri(3, 9), b = ri(3, 9); items.push({ text: `${a} × ${b}`, answer: a * b }); }
    return items.sort(() => r() - 0.5);
  });
}

export const median = (xs: number[]): number => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b), m = s.length >> 1;
  return s.length % 2 ? at(s, m) : (at(s, m - 1) + at(s, m)) / 2;
};
const quantile = (sorted: number[], p: number) => (sorted.length ? at(sorted, Math.min(sorted.length - 1, Math.round(p * (sorted.length - 1)))) : 0);

export function metrics(s: ReadinessSession): Metrics {
  const ok = s.items.filter((i) => i.correct).map((i) => i.ms).sort((a, b) => a - b);
  const medianRt = median(ok);
  const byRound = (r: number) => median(s.items.filter((i) => i.round === r && i.correct).map((i) => i.ms));
  const first = byRound(0);
  return {
    medianRt,
    accuracy: s.items.length ? ok.length / s.items.length : 0,
    variability: medianRt ? (quantile(ok, 0.75) - quantile(ok, 0.25)) / medianRt : 0,
    lapses: medianRt ? s.items.filter((i) => i.ms > 2 * medianRt).length : 0,
    roundSlope: first ? byRound(ROUNDS - 1) / first : 1,
  };
}

/** Prior sessions in the same time-of-day band, excluding the very first session ever (that one is warm-up to the format). */
export function eligibleHistory(all: ReadinessSession[], current: ReadinessSession): ReadinessSession[] {
  const sorted = [...all].sort((a, b) => a.at - b.at);
  const firstAt = sorted[0]?.at;
  return sorted.filter((s) => s.at < current.at && s.at !== firstAt && Math.abs(s.hour - current.hour) <= HOUR_BAND).slice(-BASELINE_WINDOW);
}

function wstats(xs: number[]) {
  const n = xs.length;
  const w = xs.map((_, i) => 0.9 ** (n - 1 - i));
  const sw = w.reduce((a, b) => a + b, 0);
  const mean = xs.reduce((acc, x, i) => acc + x * at(w, i), 0) / sw;
  const sd = Math.sqrt(xs.reduce((acc, x, i) => acc + at(w, i) * (x - mean) ** 2, 0) / sw);
  return { mean, sd };
}

/** Three-state verdict against the user's own baseline. Never a binary ready/not-ready. */
export function verdict(current: ReadinessSession, all: ReadinessSession[]): Verdict {
  const m = metrics(current);
  const hist = eligibleHistory(all, current);
  const baseline = { sessions: hist.length, days: new Set(hist.map((s) => s.date)).size };
  if (baseline.sessions < BASELINE_MIN_SESSIONS || baseline.days < BASELINE_MIN_DAYS) {
    return {
      light: "grey", z: null, baseline, metrics: m,
      headline: "Building your baseline",
      note: `${baseline.sessions} of ${BASELINE_MIN_SESSIONS} checks on ${baseline.days} of ${BASELINE_MIN_DAYS} days, at about this time of day.`,
      action: "Keep checking at a similar time. The comparison appears once the baseline is built.",
    };
  }
  const hm = hist.map(metrics);
  const speed = wstats(hm.map((x) => x.medianRt)), acc = wstats(hm.map((x) => x.accuracy)), vari = wstats(hm.map((x) => x.variability));
  // sd floors stop a very steady baseline from flagging trivial drift
  const z = {
    speed: (speed.mean - m.medianRt) / Math.max(speed.sd, speed.mean * 0.05, 1),
    accuracy: (m.accuracy - acc.mean) / Math.max(acc.sd, 0.03),
    variability: (vari.mean - m.variability) / Math.max(vari.sd, 0.05),
  };
  const zs = [z.speed, z.accuracy, z.variability];
  const amber = zs.filter((v) => v < -1).length >= 2 || zs.some((v) => v < -1.5);
  if (amber) {
    const weak = [z.speed < -1 && "slower", z.accuracy < -1 && "less accurate", z.variability < -1 && "more uneven"].filter((x): x is string => typeof x === "string");
    const text = weak.length ? weak.join(", ") : "below your usual range";
    return {
      light: "amber", z, baseline, metrics: m,
      headline: "Slower or more variable than usual",
      note: `${text.charAt(0).toUpperCase()}${text.slice(1)} compared with your last ${baseline.sessions} checks at about this time of day.`,
      action: "Re-run in 20 minutes, or draft with AI now and decide after a break.",
    };
  }
  return {
    light: "green", z, baseline, metrics: m,
    headline: "In your usual range",
    note: `Compared with your last ${baseline.sessions} checks at about this time of day.`,
    action: "Good window. Make the call.",
  };
}

/** Unlock rule for comparison features: five checks on three different days, any time of day. */
export function checkProgress(all: ReadinessSession[]) {
  const days = new Set(all.map((s) => s.date)).size;
  return { sessions: all.length, days, ready: all.length >= BASELINE_MIN_SESSIONS && days >= BASELINE_MIN_DAYS };
}

/** A tagged decision that is at least a day old, unrated, and not stale. */
export function pendingDecision(all: ReadinessSession[], now = Date.now()): ReadinessSession | undefined {
  return [...all].reverse().find((s) => s.decision !== undefined && s.rating === undefined && now - s.at >= DAY && now - s.at <= 7 * DAY);
}

export interface Journal { rated: number; byLight: Record<Light, { n: number; good: number }>; bestHour: number | null; ready: boolean }

/** What the verdict said versus how the decision went, from the user's own data only. */
export function journal(all: ReadinessSession[]): Journal {
  const byLight: Journal["byLight"] = { green: { n: 0, good: 0 }, amber: { n: 0, good: 0 }, grey: { n: 0, good: 0 } };
  const hours = new Map<number, number>();
  let rated = 0;
  for (const s of all) {
    if (s.decision === undefined || s.rating === undefined) continue;
    rated++;
    const light = verdict(s, all).light;
    byLight[light].n++;
    if (s.rating >= 4) {
      byLight[light].good++;
      if (light === "green") hours.set(s.hour, (hours.get(s.hour) ?? 0) + 1);
    }
  }
  const best = [...hours.entries()].sort((a, b) => b[1] - a[1])[0];
  return { rated, byLight, bestHour: best ? best[0] : null, ready: rated >= 10 };
}

export const hourLabel = (h: number) => `${((h + 11) % 12) + 1}${h % 24 < 12 ? "am" : "pm"}`;
export const LIGHT_LABEL: Record<Light, string> = { green: "Green light", amber: "Amber", grey: "Baseline building" };
export const shareText = (s: ReadinessSession, light: Light) =>
  `${LIGHT_LABEL[light]}. ${ROUNDS} rounds: ${s.roundMs.map((ms) => `${(ms / 1000).toFixed(1)}s`).join(", ")}.`;
