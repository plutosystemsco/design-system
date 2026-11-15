/**
 * 013 decision 20: the 18 workbench specimens highlighted in a fresh process,
 * so no module is cached: the first pass, then a warm one. Prints JSON.
 */
import { highlightCode } from "../../src/lib/registry/lib/highlighter.ts";
import { SPECIMENS } from "../fixtures/highlight/specimens.ts";

const t0 = performance.now();
for (const s of SPECIMENS) await highlightCode(s.code, s.language);
const first = performance.now() - t0;
const t1 = performance.now();
for (const s of SPECIMENS) await highlightCode(s.code, s.language);
const warm = performance.now() - t1;
console.log(JSON.stringify({ first, warm }));
