import { describe, it, expect } from "vitest";
import { streak, difficulty, skillRating, consistency, type Attempt } from "@/lib/progress";
const a = (p: Partial<Attempt>): Attempt => ({ game: "sprint", skill: "math", score: 50, raw: "", accuracy: 1, ms: 1, hintUsed: false, thoughtFirst: true, date: "2026-10-21", at: 0, ...p });
describe("progress rules", () => {
  it("streak counts consecutive days", () => {
    expect(streak([a({ date: "2026-10-21" }), a({ date: "2026-10-20" }), a({ date: "2026-10-18" })], new Date("2026-10-21T12:00:00"))).toBe(2);
  });
  it("difficulty rises with accuracy", () => {
    expect(difficulty([a({ accuracy: 0.9 }), a({ accuracy: 0.9 })], "sprint")).toBe(3);
    expect(difficulty([a({ accuracy: 0.3 }), a({ accuracy: 0.4 })], "sprint")).toBe(1);
  });
  it("unplayed skill rates 50", () => { expect(skillRating([], "ai")).toBe(50); });
  it("consistency is the share of recent days played", () => {
    expect(consistency([a({ date: "2026-10-21" }), a({ date: "2026-10-21" }), a({ date: "2026-10-19" })], 28, new Date("2026-10-21T12:00:00"))).toBeCloseTo(2 / 28, 6);
  });
});
