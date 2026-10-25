import { describe, expect, it } from "vitest";
import { nextMystery, validMix } from "@/lib/mix";
import { computeBadges, personalBest } from "@/lib/badges";
import type { Attempt, GameId } from "@/lib/progress";

const pool: GameId[] = ["2048", "sprint", "fifty", "queens", "tango", "deduce", "data", "aicheck", "path", "category"];

describe("surprise mix", () => {
  it("requires at least 10 different games", () => {
    expect(validMix(pool.slice(0, 9))).toBe(false);
    expect(validMix(pool)).toBe(true);
  });
  it("never deals the game just played or the last three", () => {
    const recent: GameId[] = ["sprint", "fifty", "queens"];
    for (let i = 0; i < 200; i++) expect(recent).not.toContain(nextMystery(pool, recent));
  });
});

const att = (game: GameId, score: number, at: number, hintUsed = false): Attempt => ({ game, skill: "logic", score, raw: "", accuracy: 1, ms: 1, hintUsed, thoughtFirst: true, date: "2026-10-23", at });

describe("badges", () => {
  it("awards first rep after one game and perfect at 100", () => {
    const b = computeBadges([att("path", 100, 1)], new Date("2026-10-23T12:00:00"));
    expect(b.find((x) => x.id === "first")?.earned).toBe(true);
    expect(b.find((x) => x.id === "perfect")?.earned).toBe(true);
    expect(b.find((x) => x.id === "ten")?.earned).toBe(false);
  });
  it("personal best ignores the attempt just recorded", () => {
    expect(personalBest([att("path", 60, 1), att("path", 90, 2)], "path", 2)).toBe(60);
  });
});
