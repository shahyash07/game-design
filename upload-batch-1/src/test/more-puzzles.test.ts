import { at } from "@/lib/at";
import { describe, expect, it } from "vitest";
import { genPath, pathValid, genMini, solveMini, miniErrors, genPatches, patchValid, rectangle, oneLetterApart, fullPath, wordPathValid } from "@/lib/puzzles";
import { GAMES } from "@/lib/games";
import { LADDERS, WORD_TRAILS } from "@/lib/content";

describe("LinkedIn-style puzzle rules", () => {
  it("includes all eight researched puzzle styles", () => {
    expect(GAMES.filter((g) => g.inspired).map((g) => g.inspired).sort()).toEqual(["Queens", "Tango", "Zip", "Pinpoint", "Crossclimb", "Mini Sudoku", "Patches", "Wend"].sort());
  });
  it("path visits every cell once and numbered clues in order", () => {
    for (const level of [1, 2, 3]) for (const seed of [1, 2, 20261021]) {
      const p = genPath(seed, level);
      expect(pathValid(p.solution, p.n, p.clues, true)).toBe(true);
      expect(pathValid(p.solution.slice(0, -1), p.n, p.clues, true)).toBe(false);
      expect(pathValid([...p.solution, at(p.solution, 0)], p.n, p.clues)).toBe(false);
      expect(pathValid([at(p.solution, 0), at(p.solution, 2)], p.n, p.clues)).toBe(false);
      const wrong = { ...p.clues, [at(p.solution, 1)]: 3 };
      expect(pathValid(p.solution, p.n, wrong, true)).toBe(false);
      expect(genPath(seed, level)).toEqual(p);
    }
  });
  it("mini Sudoku has exactly one solution using digits 1–6 in 2×3 boxes", () => {
    for (const level of [1, 2, 3]) {
      const p = genMini(20261021, level);
      expect(solveMini(p.givens)).toEqual(p.solution);
      expect(miniErrors(p.solution).solved).toBe(true);
      expect(p.givens.filter((v) => v !== null).length).toBeLessThan(36);
      for (let i = 0; i < 36; i++) if (p.givens[i] === null) expect(solveMini(p.givens, [i, at(p.solution, i)])).toBeNull();
    }
    const board = Array<number | null>(36).fill(null); board[0] = 1; board[7] = 1;
    expect(miniErrors(board).bad).toEqual(new Set([0, 7]));
    expect(miniErrors(board).solved).toBe(false);
  });
  it("patches cover the board with one matching area clue per rectangle", () => {
    for (const level of [1, 2, 3]) {
      const p = genPatches(31, level);
      expect(new Set(p.regions.flat()).size).toBe(p.n * p.n);
      expect(p.regions.every((cs) => patchValid(cs, p.n, p.clues))).toBe(true);
    }
    expect(patchValid([0, 1, 4], 4, [{ cell: 0, area: 3 }])).toBe(false);
    expect(patchValid(rectangle(0, 5, 4), 4, [{ cell: 0, area: 4 }, { cell: 5, area: 1 }])).toBe(false);
    expect(patchValid(rectangle(0, 5, 4), 4, [{ cell: 0, area: 3 }])).toBe(false);
  });
  it("every word ladder changes exactly one letter between rungs", () => {
    expect(LADDERS.every((q) => q.words.every((word, i) => i === 0 || oneLetterApart(at(q.words, i - 1), word)))).toBe(true);
    expect(oneLetterApart("COLD", "WARM")).toBe(false);
    expect(oneLetterApart("CAT", "CAT")).toBe(false);
  });
  it("word trails use orthogonal neighbours without reusing letters", () => {
    for (const q of WORD_TRAILS) {
      const path = fullPath(4, 71), grid = Array<string>(16).fill("");
      [...q.words.join("")].forEach((c, i) => { grid[at(path, i)] = c; });
      q.words.forEach((w, i) => expect(wordPathValid(path.slice(i * 4, i * 4 + 4), grid, 4, w, path.slice(0, i * 4))).toBe(true));
      expect(new Set(path).size).toBe(16);
      expect(wordPathValid(path.slice(0, 4), grid, 4, at(q.words, 0), [at(path, 0)])).toBe(false);
    }
    expect(wordPathValid([0, 5], ["A", "", "", "", "", "B"], 4, "AB")).toBe(false);
  });
});