import { describe, expect, it } from "vitest";
import { brier, callsSince, confidentCalls } from "@/lib/calibration";
import type { Attempt } from "@/lib/progress";

const att = (date: string, calls: Attempt["calls"]): Attempt => ({ game: "deduce", skill: "logic", score: 100, raw: "", accuracy: 1, ms: 1, hintUsed: false, thoughtFirst: true, date, at: 1, ...(calls ? { calls } : {}) });

describe("calibration", () => {
  it("scores stated confidence against outcomes", () => {
    expect(brier([])).toBeNull();
    expect(brier([{ confidence: 1, correct: true }])).toBe(0);
    expect(brier([{ confidence: 0.5, correct: false }])).toBe(0.25);
    expect(brier([{ confidence: 0.8, correct: true }, { confidence: 0.8, correct: false }])).toBeCloseTo((0.04 + 0.64) / 2, 6);
  });
  it("tallies confident calls by outcome", () => {
    expect(confidentCalls([{ confidence: 0.9, correct: true }, { confidence: 0.8, correct: false }, { confidence: 0.6, correct: false }])).toEqual({ right: 1, wrong: 1 });
  });
  it("collects calls from attempts on or after a date, ignoring attempts without calls", () => {
    const attempts = [att("2026-10-20", [{ confidence: 0.7, correct: true }]), att("2026-10-22", undefined), att("2026-10-23", [{ confidence: 0.9, correct: false }])];
    expect(callsSince(attempts, "2026-10-21")).toEqual([{ confidence: 0.9, correct: false }]);
  });
});
