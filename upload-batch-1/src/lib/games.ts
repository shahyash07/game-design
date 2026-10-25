import { at } from "@/lib/at";
import type { Attempt, GameId, Skill } from "./progress";
import { skillRating, daySeed, rng } from "./progress";

export interface GameMeta {
  id: GameId;
  name: string;
  skill: Skill;
  minutes: number;
  tagline: string;
  inspired?: string;
}

export const GAMES: GameMeta[] = [
  { id: "2048", name: "2048", skill: "logic", minutes: 5, tagline: "Slide. Merge. Reach the 2048 tile." },
  { id: "sprint", name: "Number Sprint", skill: "math", minutes: 1, tagline: "As many as you can in 30 seconds." },
  { id: "fifty", name: "50 Correct", skill: "math", minutes: 3, tagline: "Fifty right answers. Beat the clock." },
  { id: "queens", name: "Crowns", skill: "logic", minutes: 3, tagline: "One crown per row, column and colour.", inspired: "Queens" },
  { id: "tango", name: "Sun & Moon", skill: "logic", minutes: 3, tagline: "Balance the grid. No three in a row.", inspired: "Tango" },
  { id: "deduce", name: "Deduction", skill: "logic", minutes: 2, tagline: "Short logic puzzles. Reason it out." },
  { id: "data", name: "Data Detective", skill: "data", minutes: 3, tagline: "Spot the misleading metric." },
  { id: "aicheck", name: "AI Reality Check", skill: "ai", minutes: 3, tagline: "Find what the AI got wrong." },
  { id: "path", name: "Zip Trail", skill: "logic", minutes: 3, tagline: "One path. Every cell. Numbers in order.", inspired: "Zip" },
  { id: "category", name: "Common Thread", skill: "logic", minutes: 2, tagline: "Five clues. One hidden connection.", inspired: "Pinpoint" },
  { id: "ladder", name: "Word Ladder", skill: "logic", minutes: 3, tagline: "Solve clues. Climb one letter at a time.", inspired: "Crossclimb" },
  { id: "sudoku", name: "Mini Sudoku", skill: "math", minutes: 4, tagline: "Six digits. Rows, columns and boxes.", inspired: "Mini Sudoku" },
  { id: "patches", name: "Patchwork", skill: "logic", minutes: 3, tagline: "Divide the board into clue-sized rectangles.", inspired: "Patches" },
  { id: "wordtrail", name: "Word Trails", skill: "logic", minutes: 3, tagline: "Find the hidden words. Use every letter.", inspired: "Wend" },
];

export const SKILLS: Record<Skill, { label: string; color: string }> = {
  math: { label: "Calculation", color: "bg-skill-math" },
  logic: { label: "Logic", color: "bg-skill-logic" },
  data: { label: "Data reasoning", color: "bg-skill-data" },
  ai: { label: "AI judgment", color: "bg-skill-ai" },
};

export const gameById = (id: string) => GAMES.find((g) => g.id === id);

/** Daily SmartSet: 3 games, one per different skill, including the weakest skill. */
export function smartSet(attempts: Attempt[], date?: string): GameMeta[] {
  const r = rng(daySeed(date));
  const skills: Skill[] = ["math", "logic", "data", "ai"];
  const weakest = [...skills].sort((a, b) => skillRating(attempts, a) - skillRating(attempts, b)).at(0) ?? "math";
  const others = skills.filter((s) => s !== weakest).sort(() => r() - 0.5).slice(0, 2);
  return [weakest, ...others].map((s) => {
    const opts = GAMES.filter((g) => g.skill === s);
    return at(opts, Math.floor(r() * opts.length));
  });
}
