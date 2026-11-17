/**
 * 020d decision 7: the one way a test reads a changelog entry by text. A
 * slice from `indexOf("## x")` to `indexOf("\n## y")` runs to the file's end
 * when `y` is gone, and its test still passes, reading nothing it meant to.
 * These throw instead. The guard (`never-released.test.ts`) allows that
 * slice in this file alone.
 */

/** The line that splits the 0.13.0 entry into its two parts (020d decision 3). */
export const SPLIT = "Also since 0.11.0:";

/**
 * The text from the heading `## <version>` to the next `\n## `. Throws,
 * naming the heading, if the heading is missing or nothing follows it.
 */
export function releaseEntry(log: string, version: string): string {
  const heading = `## ${version}`;
  const found = new RegExp(
    `^${heading.replaceAll(".", "\\.")}(?![\\w.])`,
    "m",
  ).exec(log);
  if (!found) throw new Error(`CHANGELOG.md has no "${heading}" heading`);
  const end = log.indexOf("\n## ", found.index + 1);
  if (end === -1)
    throw new Error(`CHANGELOG.md has no heading after "${heading}"`);
  return log.slice(found.index, end);
}

/**
 * The 0.13.0 entry, split at the "Also since 0.11.0" line, which neither
 * part holds. `first` is 0.13.0's own entry, from its heading; `second` is
 * the earlier work since 0.11.0, folded in. Throws if the line is missing, or there is more
 * than one.
 */
export function foldedParts(log: string): { first: string; second: string } {
  const entry = releaseEntry(log, "0.13.0");
  const lines = entry.split("\n");
  const at = lines.flatMap((l, i) => (l.startsWith(SPLIT) ? [i] : []));
  if (at.length === 0)
    throw new Error(`the 0.13.0 entry has no "${SPLIT}" line`);
  if (at.length > 1)
    throw new Error(
      `the 0.13.0 entry has ${at.length} "${SPLIT}" lines; it needs one`,
    );
  return {
    first: lines.slice(0, at[0]).join("\n"),
    second: lines.slice(at[0]! + 1).join("\n"),
  };
}

/** A part's bullets, `- ` lines, in order. */
export function bulletsOf(part: string): string[] {
  return part.split("\n").filter((l) => l.startsWith("- "));
}

/** A bullet's head: its text before the first colon, without `**`. */
export function headOf(bullet: string): string {
  return bullet.slice(2, bullet.indexOf(":")).replaceAll("**", "");
}
