/**
 * `bun scripts/site/citations.ts`: prints every line and comment block of a
 * published item file that matches a citation pattern
 * (`src/lib/site/citations.ts`): the item, the file's path, the line or
 * lines, and the pattern. It exits 1 when it finds any, so it can guard a
 * release by hand.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { findCitations } from "../../src/lib/site/citations.ts";

type Item = { name: string; files: { path: string }[] };

const root = path.resolve(import.meta.dir, "../..");
const registry = JSON.parse(
  readFileSync(path.join(root, "registry.json"), "utf8"),
) as {
  items: Item[];
};

let count = 0;
const files = new Set<string>();
for (const item of registry.items) {
  for (const file of item.files) {
    const text = readFileSync(path.join(root, file.path), "utf8");
    for (const hit of findCitations(text, file.path)) {
      count++;
      files.add(file.path);
      const lines =
        hit.startLine === hit.endLine
          ? `${hit.startLine}`
          : `${hit.startLine}-${hit.endLine}`;
      console.log(
        `${item.name}\t${file.path}:${lines}\t[${hit.patterns.join(", ")}] (${hit.via})`,
      );
      for (const l of hit.text.split("\n")) console.log(`    ${l.trim()}`);
    }
  }
}
console.log(`\n${count} matches in ${files.size} files`);
process.exit(count ? 1 : 0);
