/**
 * 006 decision 10, review finding 2: the fence splitter, `splitFences` in
 * `chat-text.svelte`'s module script, run as it is written: the script is
 * pure, so it is extracted and imported here without compiling the component.
 */
import { beforeAll, describe, expect, test } from "bun:test";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

type Segment =
  | { kind: "prose"; text: string }
  | { kind: "code"; language: string; code: string };
let splitFences: (text: string) => Segment[];
let paragraphs: (text: string) => string[];

beforeAll(async () => {
  const source = readFileSync(
    "src/lib/registry/components/chat-text.svelte",
    "utf8",
  );
  const script = /<script lang="ts" module>([\s\S]*?)<\/script>/.exec(source);
  expect(script).not.toBeNull();
  const dir = path.resolve(".svelte-kit", "pluto-tests");
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, "chat-text.module.ts");
  writeFileSync(file, script![1]!);
  const mod = await import(file);
  splitFences = mod.splitFences;
  paragraphs = mod.paragraphs;
});

const code = (language: string, text: string): Segment => ({
  kind: "code",
  language,
  code: text,
});
const prose = (text: string): Segment => ({ kind: "prose", text });

describe("splitFences", () => {
  test("a plain fence between prose", () => {
    expect(splitFences("A\n\n```python\nx = 1\n```\n\nB")).toEqual([
      prose("A\n"),
      code("python", "x = 1"),
      prose("\nB"),
    ]);
  });

  test("an info string with a hyphen and one with a plus keep the whole word as the language", () => {
    expect(splitFences("```shell-session\n$ ls\n```")).toEqual([
      code("shell-session", "$ ls"),
    ]);
    expect(splitFences("```c++\nint x;\n```")).toEqual([code("c++", "int x;")]);
  });

  test("a titled info string: the first word is the language", () => {
    expect(splitFences("```python title=x\ncode\n```")).toEqual([
      code("python", "code"),
    ]);
  });

  test("a fence line with a language inside an open block is content; only a bare closer closes", () => {
    expect(splitFences("```md\n```js\nlet x\n```\n```")).toEqual([
      code("md", "```js\nlet x"),
      code("", ""),
    ]);
    expect(splitFences("```js  \nlet x\n```  ")).toEqual([code("js", "let x")]);
  });

  test("a language-less fence", () => {
    expect(splitFences("A\n```\ncode\n```\nB")).toEqual([
      prose("A"),
      code("", "code"),
      prose("B"),
    ]);
  });

  test("CRLF text yields clean prose and code", () => {
    expect(splitFences("A\r\n\r\n```python\r\nx = 1\r\n```\r\nB\r\n")).toEqual([
      prose("A\n"),
      code("python", "x = 1"),
      prose("B\n"),
    ]);
    const text = splitFences("A\r\n\r\n```python\r\nx = 1\r\n```\r\nB\r\n");
    expect(JSON.stringify(text)).not.toContain("\\r");
  });

  test("an unclosed fence at the end is still a block, as a streaming reply shows it", () => {
    expect(splitFences("Here:\n```python\ndef f():\n    pass")).toEqual([
      prose("Here:"),
      code("python", "def f():\n    pass"),
    ]);
    expect(splitFences("Here:\n```python")).toEqual([
      prose("Here:"),
      code("python", ""),
    ]);
  });

  test("two fences in one reply", () => {
    expect(
      splitFences("One:\n```js\na\n```\nTwo:\n```py\nb\n```\nDone."),
    ).toEqual([
      prose("One:"),
      code("js", "a"),
      prose("Two:"),
      code("py", "b"),
      prose("Done."),
    ]);
  });

  test("a backtick in the info string, four backticks and inline backticks are prose", () => {
    expect(splitFences("````\ncode\n````")).toEqual([
      prose("````\ncode\n````"),
    ]);
    expect(splitFences("Use ``` in markdown.")).toEqual([
      prose("Use ``` in markdown."),
    ]);
    expect(splitFences("")).toEqual([]);
    expect(splitFences("\n\n")).toEqual([]);
  });

  test("paragraphs split prose on blank lines and drop empty ones", () => {
    expect(paragraphs("A\n\nB\n \n\nC\n")).toEqual(["A", "B", "C"]);
  });
});
