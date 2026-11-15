import { readTokens } from "../../../../../scripts/tokens.ts";
import { highlightCode } from "#lib/registry/lib/highlighter";
import { highlightLanguages } from "#lib/registry/lib/highlight/languages";
import { codeRows } from "#lib/site/foundations/tables";
import type { PageServerLoad } from "./$types";

// One sample that shows most roles at once.
const SAMPLE = `import { readFile } from "node:fs/promises";

// Count the lines of a file.
export async function count(path: string): Promise<number> {
  const text = await readFile(path, "utf8");
  return text.split("\\n").length - 1;
}

const LIMIT = 1_000;
`;

/** The code roles, the languages and a sample, generated at prerender. */
export const load: PageServerLoad = async () => {
  const tokens = readTokens();
  return {
    rows: codeRows(tokens),
    languages: highlightLanguages,
    sample: { code: SAMPLE, lines: await highlightCode(SAMPLE, "typescript") },
  };
};
