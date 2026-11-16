/**
 * 025 decision 11: every run setting, in one hashed file. `run.ts` parses
 * flags and holds none of these. A change here changes every item's size
 * hash and runtime hash, so it forces a full run (decision 13).
 */
export const SETTINGS = {
  /** Chromium's main thread is slowed this many times (`Emulation.setCPUThrottlingRate`). */
  cpu: 4,
  /** Browser processes per run. */
  launches: 6,
  /** One block per item per launch: F is a floor trial, I an item trial. */
  block: "FIFIFIF",
  /** Discarded loads of the floor at the start of each launch. */
  warmups: 1,
  /** The viewport an entry runs at unless it says otherwise. */
  viewport: "1280x800",
  /** gzip's level for every size figure. */
  gzipLevel: 9,
  /** Brotli's quality, recorded beside each gzipped figure and not budgeted. */
  brotliQuality: 11,
  /** The seed of the block order; each launch adds its index. */
  seed: 25,
  /** Builds at once in the size phase. Nothing runs beside the runtime phase. */
  buildsAtOnce: 4,
  timeouts: {
    /** Criterion 22: a lone offline `add` finishes inside this (measured at 2.08 s). */
    addMs: 10_000,
    /**
     * The harness fails an item whose `add` takes longer, twice. A missing
     * OFFLINE_ENV makes every add about 72 s; a machine at a load of 160
     * makes a 2 s add take 11. So the line sits between them.
     */
    addFailMs: 30_000,
    /** A page's load and hydration mark. */
    loadMs: 30_000,
    /** A fixture's `cost:settled` mark. */
    settledMs: 10_000,
    /** The pause after hydration, before an interaction is armed. */
    pauseMs: 300,
    /** An armed interaction must resolve within this. */
    measureMs: 8_000,
  },
  /** Before the runtime phase: wait for the one-minute load average to fall below the core count. */
  loadWait: { maxMs: 180_000, sampleMs: 10_000 },
  /** A run's floor hydration and no-op click must fall within this share of the committed values. */
  instrumentBand: 0.15,
  /** `_calibrate.svelte`'s handler blocks for this long. */
  calibrateMs: 50,
  /** No response time and no response-time budget may exceed this (INP's "good" line). */
  ceilingMs: 200,
  /** Decision 15's margins for a first budget. */
  margins: {
    size: { ratio: 0.05, min: 1_000, step: 100 },
    hydrateMs: { ratio: 0.25, min: 8, step: 1 },
    interactionMs: { ratio: 0.25, min: 16, step: 1 },
  },
} as const;

/** The viewport string `1280x800` as Playwright takes it. */
export function viewportOf(v: string): { width: number; height: number } {
  const [width, height] = v.split("x").map(Number);
  return { width: width!, height: height! };
}
