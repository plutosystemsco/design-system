/**
 * 025 decision 11: the statistics. A launch-level figure is a block's item
 * trials' median minus its floor trials' median (hydration), or its item
 * trials' median (response time). A figure is the median of the launch-level
 * figures, with their lowest and highest beside it.
 */

/** The median: the middle value, or the mean of the two middle values. */
export function median(xs: readonly number[]): number {
  if (xs.length === 0) throw new Error("median of no values");
  const a = [...xs].sort((x, y) => x - y);
  const mid = a.length >> 1;
  return a.length % 2 ? a[mid]! : (a[mid - 1]! + a[mid]!) / 2;
}

/** One block's trials: the floor's and the item's, in milliseconds. */
export type Block = { floor: readonly number[]; item: readonly number[] };

/** A block's launch-level difference: the item trials' median minus the floor trials'. */
export function launchDifference(block: Block): number {
  return median(block.item) - median(block.floor);
}

/** A figure from its launch-level values: their median, and their lowest and highest. */
export function launchFigure(values: readonly number[]): {
  ms: number;
  spread: [number, number];
} {
  return {
    ms: median(values),
    spread: [Math.min(...values), Math.max(...values)],
  };
}

/**
 * The Hodges–Lehmann estimate of a sample's centre: the median of its Walsh
 * averages, (x_i + x_j) / 2 for every i <= j.
 */
export function hodgesLehmann(xs: readonly number[]): number {
  const averages: number[] = [];
  for (let i = 0; i < xs.length; i++)
    for (let j = i; j < xs.length; j++) averages.push((xs[i]! + xs[j]!) / 2);
  return median(averages);
}

/** A figure rounded to a tenth of a millisecond, as the report stores it. */
export function tenth(ms: number): number {
  return Math.round(ms * 10) / 10;
}

/** A seeded pseudo-random generator (mulberry32), for the block order. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A copy of `xs` in an order shuffled by `random` (Fisher–Yates). */
export function shuffled<T>(xs: readonly T[], random: () => number): T[] {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
