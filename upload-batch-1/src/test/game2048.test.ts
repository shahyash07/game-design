import { beforeEach, describe, expect, it } from 'vitest';
import { Direction, new2048, result2048 } from '@/lib/game2048';
import { load, recordAttempt } from '@/lib/progress';
import { gameById } from '@/lib/games';

function boardGame(values: number[][]) {
  const game = new2048(42);
  game.currentState = { board: values.map((row, y) => row.map((value, x) => value ? { value, id: y * 4 + x + 1 } : null)), score: 0, rngNumber: 42, totalTileCount: 16, status: { hasPossibleMoves: true, isWon: false } };
  return game;
}
describe('2048 classic rules', () => {
  it('starts a reproducible 4×4 round with exactly two 2 or 4 tiles', () => {
    const a = new2048(42), b = new2048(42);
    expect(a.currentState.board).toHaveLength(4);
    expect(a.currentState.board.every(row => row.length === 4)).toBe(true);
    const tiles = a.currentState.board.flat().filter(t => t !== null);
    expect(tiles).toHaveLength(2);
    expect(tiles.every(t => t.value === 2 || t.value === 4)).toBe(true);
    expect(a.currentState).toEqual(b.currentState);
  });
  it('merges pairs once per move, scores merged values, and adds one tile', () => {
    const game = boardGame([[2,2,2,2],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    const next = game.move(Direction.LEFT);
    expect(next.board[0]?.slice(0,2).map(t => t?.value)).toEqual([4,4]);
    expect(next.score).toBe(8);
    expect(next.board.flat().filter(t => t !== null)).toHaveLength(3);
    expect(game.moveLog).toHaveLength(1);
  });
  it('does not spawn a tile or count an unchanged move', () => {
    const game = boardGame([[2,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    const previous = game.currentState;
    expect(game.move(Direction.LEFT)).toBe(previous);
    expect(game.moveLog).toHaveLength(0);
  });
  it('merges toward the requested direction', () => {
    const game = boardGame([[2,0,0,0],[2,0,0,0],[0,0,0,0],[0,0,0,0]]);
    expect(game.move(Direction.DOWN).board[3]?.[0]?.value).toBe(4);
    const right = boardGame([[2,0,2,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    expect(right.move(Direction.RIGHT).board[0]?.[3]?.value).toBe(4);
  });
  it('wins at 2048 and allows continued moves', () => {
    const game = boardGame([[1024,1024,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    expect(game.move(Direction.LEFT).status.isWon).toBe(true);
    expect(game.currentState.score).toBe(2048);
    expect(result2048(game, 500).accuracy).toBe(1);
    game.move(Direction.DOWN);
    expect(game.moveLog.length).toBe(2);
  });
  it('detects a full board without any adjacent equal tiles', () => {
    const game = boardGame([[0,2,4,8],[16,32,64,128],[32,64,128,256],[64,128,256,512]]);
    game.move(Direction.LEFT);
    expect(game.currentState.status.hasPossibleMoves).toBe(false);
  });
});
describe('2048 progress', () => {
  beforeEach(() => localStorage.clear());
  it('joins the catalog and saves points and highest tile without a finite level', () => {
    expect(gameById('2048')?.skill).toBe('logic');
    const game = boardGame([[1024,1024,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]);
    game.move(Direction.LEFT);
    recordAttempt({ game: '2048', skill: 'logic', ...result2048(game, 500), thoughtFirst: true });
    expect(load().attempts[0]?.raw).toBe('2048 points · 2048 tile · 1 moves');
    expect(load().attempts[0]?.score).toBe(100);
    expect(load().attempts[0]?.levelNumber).toBeUndefined();
  });
});