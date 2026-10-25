import { describe, expect, it } from "vitest";
import { BASELINE_MIN_SESSIONS, ITEMS_PER_ROUND, ROUNDS, checkProgress, journal, makeItems, metrics, pendingDecision, shareText, verdict } from "@/lib/readiness";
import type { ReadinessSession } from "@/lib/progress";

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 9, 1, 12, 0);

/** n is in days (fractions keep the same date); ms pattern gives a median of base + 40. */
function session(n: number, hour: number, base: number, accuracy = 1, extra: Partial<ReadinessSession> = {}): ReadinessSession {
  const total = ROUNDS * ITEMS_PER_ROUND;
  const items = Array.from({ length: total }, (_, i) => ({ ms: base + (i % 5) * 20, correct: i / total < accuracy, round: Math.floor(i / ITEMS_PER_ROUND) }));
  const at = T0 + n * DAY;
  return { at, date: new Date(at).toISOString().slice(0, 10), hour, items, roundMs: [base * 15, base * 15, base * 15], ...extra };
}
const history = (count: number, hour = 9, base = 1000) => Array.from({ length: count }, (_, i) => session(i, hour, base));

describe("Green Light items", () => {
  it("keeps the same structure every session and only varies operands", () => {
    const rounds = makeItems(7);
    expect(rounds).toHaveLength(ROUNDS);
    for (const round of rounds) {
      expect(round).toHaveLength(ITEMS_PER_ROUND);
      expect(round.filter((i) => i.text.includes("+"))).toHaveLength(8);
      expect(round.filter((i) => i.text.includes("−"))).toHaveLength(2);
      expect(round.filter((i) => i.text.includes("×"))).toHaveLength(5);
      expect(round.every((i) => Number.isInteger(i.answer) && i.answer > 0)).toBe(true);
    }
    expect(makeItems(7)).toEqual(rounds);
    expect(makeItems(8)).not.toEqual(rounds);
  });
});

describe("Green Light metrics", () => {
  it("scores median speed, accuracy and spread from correct answers only", () => {
    const m = metrics(session(0, 9, 1000));
    expect(m.medianRt).toBe(1040);
    expect(m.accuracy).toBe(1);
    expect(m.variability).toBeCloseTo(40 / 1040, 4);
    expect(m.lapses).toBe(0);
    expect(m.roundSlope).toBe(1);
    expect(metrics(session(0, 9, 1000, 0.8)).accuracy).toBeCloseTo(0.8, 2);
  });
});

describe("Green Light verdict", () => {
  it("stays grey until five prior checks on three days exist, not counting the first ever", () => {
    const hist = history(3);
    const v = verdict(session(3, 9, 1000), [...hist, session(3, 9, 1000)]);
    expect(v.light).toBe("grey");
    expect(v.baseline).toEqual({ sessions: 2, days: 2 });
    expect(verdict(session(6, 9, 1000), history(6)).baseline.sessions).toBe(5);
  });
  it("goes green when the session sits in the user's usual range, including when faster", () => {
    const hist = history(6);
    expect(verdict(session(6, 9, 1000), hist).light).toBe("green");
    expect(verdict(session(6, 9, 800), hist).light).toBe("green");
  });
  it("goes amber when slower or less accurate than usual", () => {
    const hist = history(6);
    const slow = verdict(session(6, 9, 1400), hist);
    expect(slow.light).toBe("amber");
    expect(slow.z?.speed).toBeLessThan(-1.5);
    expect(slow.note).toMatch(/^Slower/);
    expect(verdict(session(6, 9, 1000, 0.8), hist).light).toBe("amber");
  });
  it("only compares against checks in the same time-of-day band", () => {
    expect(verdict(session(6, 15, 1000), history(6, 9)).light).toBe("grey");
    expect(verdict(session(6, 10, 1000), history(6, 9)).light).toBe("green");
  });
  it("needs three different days, not just five sessions", () => {
    const sameDay = Array.from({ length: 6 }, (_, i) => session(i * 0.02, 9, 1000));
    expect(verdict(session(0.2, 9, 1000), sameDay).light).toBe("grey");
  });
});

describe("Green Light unlock, journal and sharing", () => {
  it("unlocks comparison features after five checks on three days", () => {
    expect(checkProgress(history(5)).ready).toBe(true);
    expect(checkProgress(Array.from({ length: 5 }, (_, i) => session(i * 0.02, 9, 1000))).ready).toBe(false);
    expect(checkProgress([]).sessions).toBe(0);
  });
  it("surfaces a tagged decision for rating after a day and drops it after a week", () => {
    const now = T0 + 30 * DAY;
    const tagged = (daysAgo: number, extra: Partial<ReadinessSession> = {}) => session(30 - daysAgo, 9, 1000, 1, { decision: "pricing call", ...extra });
    expect(pendingDecision([tagged(2)], now)?.decision).toBe("pricing call");
    expect(pendingDecision([tagged(2, { rating: 4 })], now)).toBeUndefined();
    expect(pendingDecision([tagged(0.1)], now)).toBeUndefined();
    expect(pendingDecision([tagged(9)], now)).toBeUndefined();
  });
  it("reports verdict versus outcome only from the user's own rated decisions", () => {
    const all = [...history(6), ...Array.from({ length: 10 }, (_, i) => session(6 + i, 9, 1000, 1, { decision: `call ${i}`, rating: i < 8 ? 5 : 2 }))];
    const j = journal(all);
    expect(j.rated).toBe(10);
    expect(j.ready).toBe(true);
    expect(j.byLight.green).toEqual({ n: 10, good: 8 });
    expect(j.bestHour).toBe(9);
    expect(journal(history(3)).ready).toBe(false);
  });
  it("shares round times without spoilers", () => {
    expect(shareText(session(0, 9, 1000), "green")).toBe(`Green light. ${ROUNDS} rounds: 15.0s, 15.0s, 15.0s.`);
    expect(BASELINE_MIN_SESSIONS).toBe(5);
  });
});
