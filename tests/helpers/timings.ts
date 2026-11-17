/**
 * 013 decision 20: the 18 workbench specimens highlighted in a fresh process,
 * so no module is cached: the first pass, then warm ones. Prints JSON.
 *
 * 022ab: each pass is timed in the main thread's CPU time, which a loaded
 * machine does not stretch, beside its wall time, which is printed only.
 * `warm` is the fastest of five warm passes.
 */
import { highlightCode } from "../../src/lib/registry/lib/highlighter.ts";
import { SPECIMENS } from "../fixtures/highlight/specimens.ts";

/** This thread's CPU time, and the wall clock, in ms. */
function now(): { cpu: number; wall: number } {
  const { user, system } = process.threadCpuUsage();
  return { cpu: (user + system) / 1000, wall: performance.now() };
}

async function pass(): Promise<{ cpu: number; wall: number }> {
  const t0 = now();
  for (const s of SPECIMENS) await highlightCode(s.code, s.language);
  const t1 = now();
  return { cpu: t1.cpu - t0.cpu, wall: t1.wall - t0.wall };
}

const first = await pass();
const warms = [];
for (let i = 0; i < 5; i++) warms.push(await pass());
console.log(
  JSON.stringify({
    first: first.cpu,
    warm: Math.min(...warms.map((w) => w.cpu)),
    firstWall: first.wall,
    warmWall: Math.min(...warms.map((w) => w.wall)),
  }),
);
