import type { Attempt, Call } from "./progress";

export type { Call };

/** Mean squared gap between stated confidence and outcome. 0 is perfect; 0.25 is guessing at 50%. */
export function brier(calls: Call[]): number | null {
  if (!calls.length) return null;
  return calls.reduce((s, c) => s + (c.confidence - (c.correct ? 1 : 0)) ** 2, 0) / calls.length;
}

/** Calls made at or above the threshold, split by outcome. */
export function confidentCalls(calls: Call[], threshold = 0.8) {
  const sure = calls.filter((c) => c.confidence >= threshold);
  return { right: sure.filter((c) => c.correct).length, wrong: sure.filter((c) => !c.correct).length };
}

export const callsSince = (attempts: Attempt[], fromDate: string): Call[] =>
  attempts.filter((a) => a.date >= fromDate).flatMap((a) => a.calls ?? []);
