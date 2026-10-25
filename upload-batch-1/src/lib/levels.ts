import path from './levels/path.json';
import queens from './levels/queens.json';
import tango from './levels/tango.json';
import sudoku from './levels/sudoku.json';
import patches from './levels/patches.json';
import category from './levels/category.json';
import ladder from './levels/ladder.json';
import wordtrail from './levels/wordtrail.json';
import deduce from './levels/deduce.json';
import data from './levels/data.json';
import aicheck from './levels/aicheck.json';
import type { MCQ, THREADS, LADDERS, WORD_TRAILS } from './content';
import type { GameId, Attempt } from './progress';
import type { genPath, genQueens, genTango, genMini, genPatches } from './puzzles';
import { at } from './at';

export interface PuzzleTypes {
  path: ReturnType<typeof genPath>;
  queens: ReturnType<typeof genQueens>;
  tango: ReturnType<typeof genTango>;
  sudoku: ReturnType<typeof genMini>;
  patches: ReturnType<typeof genPatches>;
  category: typeof THREADS[number];
  ladder: typeof LADDERS[number];
  wordtrail: typeof WORD_TRAILS[number] & { path: number[]; grid: string[] };
  deduce: null; data: null; aicheck: null;
}
export type FiniteGame = keyof PuzzleTypes;
export interface StoredLevel<P> { number: number; difficulty: 1 | 2 | 3; seed: number; puzzle?: P; questions?: MCQ[] }
export const LEVEL_COUNT = 365;
export const LEVELS = { path, queens, tango, sudoku, patches, category, ladder, wordtrail, deduce, data, aicheck } as unknown as { [K in FiniteGame]: StoredLevel<PuzzleTypes[K]>[] };
export function isUnlimited(game: GameId): boolean { return game === 'sprint' || game === 'fifty' || game === '2048'; }
export function storedLevel<K extends FiniteGame>(game: K, number: number): StoredLevel<PuzzleTypes[K]> {
  if (!Number.isInteger(number) || number < 1 || number > LEVEL_COUNT) throw new Error('Level must be between 1 and 365');
  return at(LEVELS[game], number - 1);
}
export function storedPuzzle<K extends FiniteGame>(game: K, number: number): PuzzleTypes[K] {
  const puzzle = storedLevel(game, number).puzzle;
  if (!puzzle) throw new Error(`Missing puzzle for ${game} level ${number}`);
  return puzzle;
}
export function completedLevels(attempts: Attempt[], game: GameId): Set<number> {
  return new Set(attempts.filter(a => a.game === game && a.levelNumber !== undefined && a.accuracy === 1).map(a => a.levelNumber ?? 0));
}
export function nextLevel(attempts: Attempt[], game: GameId): number {
  const completed = completedLevels(attempts, game);
  for (let number = 1; number <= LEVEL_COUNT; number++) if (!completed.has(number)) return number;
  return 1;
}
/** Session-safe fresh numeric seeds: round sequence never uses a finite level bank. */
export function freshNumberSeed(): number { return globalThis.crypto.getRandomValues(new Uint32Array(1))[0] ?? Date.now(); }