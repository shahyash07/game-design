import type { Attempt } from "./progress";
import { streak } from "./progress";

export interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
}

/** Achievements derived purely from saved attempts, so they work signed in or out. */
export function computeBadges(attempts: Attempt[], now = new Date()): Badge[] {
  const games = new Set(attempts.map((a) => a.game));
  const days = new Set(attempts.map((a) => a.date));
  const noHint = attempts.filter((a) => !a.hintUsed).length;
  const best = attempts.reduce((m, a) => Math.max(m, a.score), 0);
  const s = streak(attempts, now);
  const list: Omit<Badge, "earned">[] = [];
  const earned: boolean[] = [];
  const add = (id: string, icon: string, name: string, description: string, ok: boolean) => {
    list.push({ id, icon, name, description });
    earned.push(ok);
  };
  add("first", "🌱", "First rep", "Finish your first game.", attempts.length >= 1);
  add("ten", "🏋️", "Warmed up", "Finish 10 games.", attempts.length >= 10);
  add("fifty", "🧱", "Regular", "Finish 50 games.", attempts.length >= 50);
  add("explorer", "🧭", "Explorer", "Try 5 different games.", games.size >= 5);
  add("allround", "🎯", "All-rounder", "Try 10 different games.", games.size >= 10);
  add("streak3", "🔥", "On fire", "Reach a 3-day streak.", s >= 3);
  add("streak7", "📅", "Week strong", "Reach a 7-day streak.", s >= 7);
  add("days30", "🗓️", "Habit formed", "Play on 30 different days.", days.size >= 30);
  add("thinker", "🧠", "Think first", "Solve 10 games without a hint.", noHint >= 10);
  add("perfect", "💯", "Perfect", "Score 100 in any game.", best >= 100);
  return list.map((b, i) => ({ ...b, earned: earned[i] === true }));
}

/** Best previous score for a game, ignoring the attempt just recorded. */
export function personalBest(attempts: Attempt[], game: string, excludeAt?: number): number | null {
  const xs = attempts.filter((a) => a.game === game && a.at !== excludeAt);
  if (!xs.length) return null;
  return xs.reduce((m, a) => Math.max(m, a.score), 0);
}
