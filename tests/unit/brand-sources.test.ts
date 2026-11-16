/**
 * 017 criterion 11, from source: on the nine Brand pages and the Brand
 * components they render, every p, li, td and figcaption carries data-claim,
 * and every claim that is not "none" has a source comment beside it naming a
 * decision or a specification. The built pages are checked in
 * build-output.spec.ts.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "svelte/compiler";
import { SITEMAP } from "../../src/lib/site/sitemap.ts";

const PAGES = SITEMAP.filter((p) => p.spec === "017" && p.door === "brand");
const pageFile = (p: string) =>
  path.join("src/routes/(site)", p, "+page.svelte");
const COMPONENTS = readdirSync("src/lib/site/brand")
  .filter((f) => f.endsWith(".svelte"))
  .map((f) => path.join("src/lib/site/brand", f));
const FILES = [...PAGES.map((p) => pageFile(p.path)), ...COMPONENTS];

/** A source comment: "source:", then a decision, a specification or decisions.md. */
const SOURCE =
  /^\s*source:.*(decisions\.md|\b0\d\d\b|\bconstitution\b|\btokens\/kuiper\.tokens\.json\b)/;

type Node = {
  type: string;
  name?: string;
  data?: string;
  attributes?: { type: string; name: string; value: unknown }[];
  fragment?: { nodes: Node[] };
  [k: string]: unknown;
};

/** Every p, li, td or figcaption, with the comment nearest before it among its siblings. */
function claims(source: string) {
  const ast = parse(source, { modern: true }) as unknown as {
    fragment: { nodes: Node[] };
  };
  const out: { name: string; claim: string | null; comment: string | null }[] =
    [];
  function walkList(nodes: Node[]) {
    let comment: string | null = null;
    for (const n of nodes) {
      if (n.type === "Comment") {
        comment = n.data ?? "";
        continue;
      }
      if (n.type === "Text" && !(n.data ?? "").trim()) continue;
      if (
        n.type === "RegularElement" &&
        ["p", "li", "td", "figcaption"].includes(n.name!)
      ) {
        const attr = n.attributes?.find(
          (a) => a.type === "Attribute" && a.name === "data-claim",
        );
        const v = attr?.value;
        const claim = !attr
          ? null
          : Array.isArray(v)
            ? v.map((x: { data?: string }) => x.data ?? "").join("")
            : String(v);
        out.push({ name: n.name!, claim, comment });
      }
      comment = null;
      walk(n);
    }
  }
  function walk(n: Node) {
    for (const v of Object.values(n)) {
      if (
        v &&
        typeof v === "object" &&
        "nodes" in (v as object) &&
        Array.isArray((v as { nodes: unknown }).nodes)
      )
        walkList((v as { nodes: Node[] }).nodes);
    }
  }
  walkList(ast.fragment.nodes);
  return out;
}

describe("017 criterion 11: settled only, from source", () => {
  test("the nine Brand pages each have a source file", () => {
    expect(PAGES).toHaveLength(9);
    for (const p of PAGES)
      expect(() => readFileSync(pageFile(p.path))).not.toThrow();
  });

  test("0 p, li, td or figcaption lack data-claim", () => {
    const missing = FILES.flatMap((f) =>
      claims(readFileSync(f, "utf8"))
        .filter((c) => c.claim === null)
        .map((c) => `${f}: <${c.name}>`),
    );
    expect(missing).toEqual([]);
  });

  test("every claim that is not none has a source comment naming a decision or a specification", () => {
    const bare = FILES.flatMap((f) =>
      claims(readFileSync(f, "utf8"))
        .filter((c) => c.claim !== null && c.claim !== "none")
        .filter((c) => !SOURCE.test(c.comment ?? ""))
        .map((c) => `${f}: <${c.name} data-claim="${c.claim}">`),
    );
    expect(bare).toEqual([]);
  });

  test("the products page says the icons are not drawn yet", () => {
    expect(readFileSync(pageFile("/brand/products/"), "utf8")).toContain(
      "The icons themselves are not drawn yet.",
    );
  });

  test("0 pages mention a signature device", () => {
    for (const f of FILES)
      expect(readFileSync(f, "utf8")).not.toMatch(/signature/i);
  });
});
