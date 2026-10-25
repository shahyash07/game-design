/** Read an expected puzzle entry, rejecting malformed content instead of returning undefined. */
export function at<T>(items: readonly T[], index: number): T {
  const value = items[index];
  if (value === undefined) throw new Error(`Missing puzzle entry at ${index}`);
  return value;
}