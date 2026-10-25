import { createGame, Direction, type Game } from '2048-engine';
import type { GameResult } from '@/components/games/types';

export { Direction };
export function new2048(seed: number): Game {
  return createGame({ randomSeed: seed, boardMeta: { rows: 4, cols: 4 }, moveLog: [] });
}
export function result2048(game: Game, ms: number): GameResult {
  const highest = Math.max(2, ...game.currentState.board.flat().map(t => t?.value ?? 0));
  return {
    score: Math.min(100, Math.round(Math.log2(highest) / 11 * 100)),
    raw: `${game.currentState.score} points · ${highest} tile · ${game.moveLog.length} moves`,
    accuracy: Math.min(1, highest / 2048), ms, hintUsed: false,
    tip: 'Keep your largest tile in a corner and build descending rows toward it.',
  };
}