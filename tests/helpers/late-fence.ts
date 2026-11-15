/**
 * 013 decision 14: a session opened while a fence's grammar loads, in a fresh
 * process so the grammar is truly not loaded. Prints JSON: how many times
 * onChange fired, whether the session settled, and whether its lines then
 * equal highlightCode's.
 */
import {
  highlightCode,
  loadHighlighter,
} from "../../src/lib/registry/lib/highlighter.ts";

const code = '# Notes\n\n```json\n{ "port": 8080, "on": true }\n```\n\nDone.\n';
const markdown = (await loadHighlighter("markdown"))!;
const session = markdown.session(code);
const first = JSON.stringify(session.lines());
const pendingAtFirst = !session.settled;
let fired = 0;
await new Promise<void>((resolve) => {
  session.onChange(() => {
    fired++;
    setTimeout(resolve, 200);
  });
  setTimeout(resolve, 5000);
});
const after = JSON.stringify(session.lines());
const expected = JSON.stringify(await highlightCode(code, "markdown"));
console.log(
  JSON.stringify({
    fired,
    pendingAtFirst,
    settled: session.settled,
    changed: first !== after,
    equal: after === expected,
  }),
);
