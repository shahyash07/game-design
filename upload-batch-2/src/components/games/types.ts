import type { Call } from "@/lib/progress";

export interface GameResult {
  score: number;
  raw: string;
  accuracy: number;
  ms: number;
  hintUsed: boolean;
  tip: string;
  calls?: Call[];
}
export interface GameProps {
  level: 1 | 2 | 3;
  seed: number;
  levelNumber?: number;
  onFinish: (r: GameResult) => void;
}
