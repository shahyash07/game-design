import { describe, it, expect, beforeEach } from 'vitest';
import { LEVELS, storedPuzzle, storedLevel, nextLevel, completedLevels, isUnlimited, freshNumberSeed, type FiniteGame } from '@/lib/levels';
import { pathValid, queensErrors, tangoErrors, miniErrors, patchValid, oneLetterApart, wordPathValid } from '@/lib/puzzles';
import { recordAttempt, selectLevel, load, type Attempt } from '@/lib/progress';
import { at } from '@/lib/at';

describe('stored level libraries', () => {
  it('each finite game stores at least 365 numbered distinct levels', () => {
    for (const game of Object.keys(LEVELS) as FiniteGame[]) {
      const entries = LEVELS[game];
      expect(entries.length).toBeGreaterThanOrEqual(365);
      expect(entries.map(e => e.number)).toEqual(Array.from({ length: 365 }, (_, i) => i + 1));
      const keys = entries.map(e => {
        if (e.questions) return JSON.stringify(e.questions.map(q => [q.context, q.prompt]));
        const p = e.puzzle;
        if (game === 'ladder') return [...storedPuzzle('ladder', e.number).words].sort().join('|');
        if (game === 'category') return [...storedPuzzle('category', e.number).clues].sort().join('|');
        if (game === 'wordtrail') return [...storedPuzzle('wordtrail', e.number).words].sort().join('|');
        return JSON.stringify(p);
      });
      expect(new Set(keys).size, game).toBeGreaterThanOrEqual(365);
    }
  });
  it('all 365 Zip levels have legal full-board numbered paths', () => {
    for (const entry of LEVELS.path) { const p = storedPuzzle('path', entry.number); expect(pathValid(p.solution, p.n, p.clues, true)).toBe(true); }
  });
  it('all stored grid solutions satisfy their game rules', () => {
    for (let n = 1; n <= 365; n++) {
      const q = storedPuzzle('queens', n);
      expect(queensErrors(q.region, q.region.map((row, y) => row.map((_, x) => q.sol[y] === x))).solved).toBe(true);
      expect(tangoErrors(storedPuzzle('tango', n).solution).solved).toBe(true);
      const s = storedPuzzle('sudoku', n); expect(miniErrors(s.solution).solved).toBe(true);
      expect(s.givens.every((v, i) => v === null || v === s.solution[i])).toBe(true);
      const p = storedPuzzle('patches', n); expect(new Set(p.regions.flat()).size).toBe(p.n * p.n);
      expect(p.regions.every(c => patchValid(c, p.n, p.clues))).toBe(true);
    }
  });
  it('all word levels have valid chains, clues and non-overlapping word routes', () => {
    for (let n = 1; n <= 365; n++) {
      const l = storedPuzzle('ladder', n); expect(l.words.length).toBe(5); expect(l.clues.length).toBe(5);
      expect(l.words.every((w, i) => i === 0 || oneLetterApart(at(l.words, i - 1), w))).toBe(true);
      expect(l.clues.every(c => c.length > 0)).toBe(true);
      const t = storedPuzzle('wordtrail', n); expect(new Set(t.words).size).toBe(4);
      t.words.forEach((w, i) => expect(wordPathValid(t.path.slice(i * 4, i * 4 + 4), t.grid, 4, w, t.path.slice(0, i * 4))).toBe(true));
      const c = storedPuzzle('category', n); expect(c.clues.length).toBe(5); expect(c.aliases).toContain(c.answer);
    }
  });
  it('all reasoning levels contain four valid question records', () => {
    for (const game of ['deduce','data','aicheck'] as const) for (const entry of LEVELS[game]) {
      expect(entry.questions?.length).toBe(4);
      for (const q of entry.questions ?? []) { expect(new Set(q.options).size).toBe(4); expect(q.answer).toBeGreaterThanOrEqual(0); expect(q.answer).toBeLessThan(4); expect(q.explain.length).toBeGreaterThan(0); }
    }
  });
  it('number solving supports unlimited generation instead of a 365-level ceiling', () => {
    expect(isUnlimited('sprint')).toBe(true); expect(isUnlimited('fifty')).toBe(true); expect(isUnlimited('2048')).toBe(true); expect(isUnlimited('path')).toBe(false);
    expect(new Set(Array.from({ length: 1000 }, freshNumberSeed)).size).toBeGreaterThan(990);
  });
  it('level lookup enforces the 1–365 bounds', () => {
    expect(storedLevel('path', 365).number).toBe(365);
    expect(() => storedLevel('path', 366)).toThrow(); expect(() => storedLevel('path', 0)).toThrow();
  });
});
describe('level persistence', () => {
  beforeEach(() => localStorage.clear());
  it('saves last selected level and completed puzzle identity across reads', () => {
    selectLevel('path', 365);
    recordAttempt({ game:'path', skill:'logic', score:100, raw:'Solved', accuracy:1, ms:100, hintUsed:false, thoughtFirst:true, levelNumber:365, puzzleDifficulty:3 });
    const saved = load(); expect(saved.selectedLevels?.path).toBe(365); expect(saved.attempts[0]?.levelNumber).toBe(365);
    expect(completedLevels(saved.attempts, 'path').has(365)).toBe(true);
  });
  it('failed attempts do not complete a level; next level finds the first unfinished puzzle', () => {
    const base: Attempt = { game:'category', skill:'logic', score:100, raw:'', accuracy:1, ms:100, hintUsed:false, thoughtFirst:true, date:'2026-10-21', at:1, levelNumber:1 };
    const attempts = [base, { ...base, levelNumber:2, accuracy:0 }];
    expect([...completedLevels(attempts, 'category')]).toEqual([1]); expect(nextLevel(attempts, 'category')).toBe(2);
  });
});