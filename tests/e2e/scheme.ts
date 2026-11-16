/**
 * 022 decision 2: a project's name is `<engine>-<scheme>`, so no spec reads
 * it. The scheme is read from the project's `use`; the name only labels a
 * message. This is the one file in `tests/e2e/` that reads the name.
 */
import type { TestInfo } from "@playwright/test";

export type Scheme = "light" | "dark";

/** The project's colour scheme, `"light"` or `"dark"`. Throws on anything else. */
export function scheme(info: Pick<TestInfo, "project">): Scheme {
  const s = info.project.use.colorScheme;
  if (s !== "light" && s !== "dark")
    throw new Error(
      `project ${info.project.name} has colorScheme ${JSON.stringify(s)}; expected "light" or "dark"`,
    );
  return s;
}

/** The project's name, for a message's label only. */
export function projectLabel(info: Pick<TestInfo, "project">): string {
  return info.project.name;
}
