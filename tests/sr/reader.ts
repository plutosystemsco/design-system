/**
 * 022 decision 10: which reader this run drives. In CI the job must say,
 * through `SR_READER`, and only VoiceOver and NVDA are evidence. Locally it
 * defaults to the platform's reader; `SR_READER=orca` is the container
 * rehearsal's (022 Q9), never evidence.
 */
export const READERS = ["voiceover", "nvda"] as const;
export type Reader = (typeof READERS)[number];

export function reader(env = process.env, platform = process.platform): string {
  const given = env.SR_READER;
  if (env.CI) {
    if (!READERS.includes(given as Reader))
      throw new Error(
        `SR_READER must be "voiceover" or "nvda" in CI, not ${JSON.stringify(given)}`,
      );
    if (env.SR_DRY) throw new Error("SR_DRY is local only; CI drives a reader");
    return given!;
  }
  if (env.SR_DRY) return "dry";
  if (given) return given;
  if (platform === "darwin") return "voiceover";
  if (platform === "win32") return "nvda";
  return "orca";
}
