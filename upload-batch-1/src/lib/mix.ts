import type { GameId } from "./progress";

export const MIN_MIX = 10;

export const validMix = (pool: readonly string[] | undefined): pool is GameId[] => !!pool && new Set(pool).size >= MIN_MIX;

/** Pick a hidden next game from the pool, never repeating the current or the last few played. */
export function nextMystery(pool: readonly GameId[], recent: readonly GameId[], rand: () => number = Math.random): GameId {
  if (!pool.length) throw new Error("Mix pool is empty");
  const avoid = new Set(recent.slice(-Math.min(3, pool.length - 1)));
  const options = pool.filter((g) => !avoid.has(g));
  const list = options.length ? options : [...pool];
  const pick = list[Math.floor(rand() * list.length)];
  if (!pick) throw new Error("No mystery game available");
  return pick;
}
