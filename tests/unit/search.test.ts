/**
 * 015 decision 18, criterion 21: the index builder and the ranking, from
 * source. The source modules are found with node:fs, as the endpoint's glob
 * would find them.
 */
import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import * as Search from "../../src/lib/site/search.ts";
import { search } from "../../src/lib/site/search.ts";
import { buildIndex } from "../../src/lib/site/search/build-index.ts";
import type {
  SearchEntry,
  SearchSource,
} from "../../src/lib/site/search/types.ts";
import { SITEMAP } from "../../src/lib/site/sitemap.ts";

const DIR = "src/lib/site/search/sources";
const SOURCES: SearchSource[] = await Promise.all(
  readdirSync(DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((f) => import(path.resolve(DIR, f))),
);

describe("015: the search index", () => {
  const index = buildIndex(SOURCES);

  test("every module in search/sources/ loads under Bun", () => {
    expect(SOURCES.length).toBeGreaterThanOrEqual(1);
    for (const s of SOURCES) expect(typeof s.entries).toBe("function");
  });

  test("its page entries equal the page list, each path once", () => {
    const pages = index.filter((e) => !e.path.includes("#")).map((e) => e.path);
    expect(pages).toEqual(SITEMAP.map((p) => p.path));
    expect(new Set(index.map((e) => e.path)).size).toBe(index.length);
    expect(SITEMAP.filter((p) => p.spec === "015")).toHaveLength(81);
  });

  test('"dial" ranks Dialog first, and "but" ranks Button first', () => {
    expect(search(index, "dial")[0]?.title).toBe("Dialog");
    expect(search(index, "but")[0]?.title).toBe("Button");
  });

  test("matching is case-insensitive; a title's start, then a word's, then the summary", () => {
    expect(search(index, "DIAL")[0]?.title).toBe("Dialog");
    const r = search(index, "menu");
    expect(
      r[0]?.title.toLowerCase().startsWith("menu") ||
        r[0]?.title.toLowerCase().includes(" menu"),
    ).toBe(true);
    expect(search(index, "zzzz")).toEqual([]);
  });
});

describe("017 decision 10: the token entries", () => {
  const index = buildIndex(SOURCES);
  const anchors = index.filter((e) =>
    e.path.startsWith("/foundations/tokens/#"),
  );

  test("search/sources/ holds 2 modules, pages and tokens", () => {
    expect(
      readdirSync(DIR)
        .filter((f) => f.endsWith(".ts"))
        .sort(),
    ).toEqual(["pages.ts", "tokens.ts"]);
  });

  test("1 anchor entry for every theme role and every primitive, each once", async () => {
    const { readTokens } = await import("../../scripts/tokens.ts");
    const tokens = readTokens();
    const names = [
      ...Object.keys(tokens.primitives).map((n) => `primitive-${n}`),
      ...Object.keys(tokens.themes.light),
    ];
    expect(anchors.map((e) => e.path.split("#")[1]).sort()).toEqual(
      names.sort(),
    );
    for (const e of anchors) {
      expect(e.door).toBe("foundations");
      expect(e.summary).toMatch(/^[A-Z].*\.$/);
    }
  });
});

describe("018 decision 8: search that finds what was meant", () => {
  const index = buildIndex(SOURCES);
  const aliases = () => import("../../src/lib/site/search/aliases.ts");
  const fixture: { alias: string; path: string; title: string }[] = JSON.parse(
    readFileSync("tests/fixtures/search-aliases.json", "utf8"),
  );

  /** Where `q` starts a word of `text`: at its start, or after a non-letter, non-digit. */
  const startsAWord = (text: string, q: string) =>
    new RegExp(
      `(^|[^\\p{L}\\p{N}])${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "iu",
    ).test(text);

  test('"dia" returns Dialog and Alert dialog, and 0 entries matched only inside a word', () => {
    const r = Search.search(index, "dia");
    // Dialog and Alert dialog by title; others only where a summary word
    // starts with "dia" ("A small dialog…"), never "media" or "Meridian".
    expect(r.slice(0, 2).map((e) => e.title)).toEqual([
      "Dialog",
      "Alert dialog",
    ]);
    expect(r.slice(2).every((e) => e.rank === 4)).toBe(true);
    for (const gone of ["Item", "Highlighter", "Is mobile"])
      expect(r.map((e) => e.title)).not.toContain(gone);
    for (const e of r)
      expect(
        [e.title, ...(e.aliases ?? []), e.summary].some((t) =>
          startsAWord(t, "dia"),
        ),
      ).toBe(true);
  });

  test("a summary matches only where a word starts with the query", () => {
    // "media" and "Meridian" hold "dia" inside a word: neither entry returns.
    for (const e of Search.search(index, "ian"))
      expect(startsAWord(`${e.title} ${e.summary}`, "ian")).toBe(true);
    expect(
      Search.search(
        [{ path: "/x/", title: "X", door: null, summary: "Social media." }],
        "dia",
      ),
    ).toEqual([]);
  });

  test("the four ranks: title start, title word, alias, summary word", () => {
    const entries = [
      { path: "/d/", title: "Thing", door: null, summary: "A pane." },
      {
        path: "/c/",
        title: "Other",
        door: null,
        summary: "A pane.",
        aliases: ["panel"],
      },
      { path: "/b/", title: "Side pane", door: null, summary: "A thing." },
      { path: "/a/", title: "Panel", door: null, summary: "A thing." },
    ];
    const r = Search.search(entries, "pan");
    expect(r.map((e) => [e.title, e.rank])).toEqual([
      ["Panel", 1],
      ["Side pane", 2],
      ["Other", 3],
      ["Thing", 4],
    ]);
    expect(r[2]?.alias).toBe("panel");
    expect(r.filter((e) => e.alias)).toHaveLength(1);
  });

  test('"modal" returns Dialog first, with the alias "modal"', () => {
    const r = Search.search(index, "modal");
    expect(r[0]?.title).toBe("Dialog");
    expect(r[0]?.alias).toBe("modal");
    expect(Search.search(index, "MODAL")[0]?.alias).toBe("modal");
  });

  // 020 test 18: a renamed item's old name finds its new page.
  test('"pluto-theme" returns the Kuiper theme page first, with the alias "pluto-theme"', () => {
    const r = Search.search(index, "pluto-theme");
    expect(r[0]?.path).toBe("/components/kuiper-theme/");
    expect(r[0]?.title).toBe("Kuiper theme");
    expect(r[0]?.alias).toBe("pluto-theme");
    expect(fixture).toContainEqual({
      alias: "pluto-theme",
      path: "/components/kuiper-theme/",
      title: "Kuiper theme",
    });
  });

  // 018 checkpoint 2 drops "select": it starts a word of Native select.
  // 020 adds the old name of the renamed theme item.
  test("the aliases equal their fixture list of 5", async () => {
    const { ALIASES } = await aliases();
    expect(fixture).toHaveLength(5);
    expect(ALIASES.map(({ alias, path }) => ({ alias, path }))).toEqual(
      fixture.map(({ alias, path }) => ({ alias, path })),
    );
  });

  test("each alias's target is in SITEMAP, with the fixture's title", async () => {
    const { ALIASES } = await aliases();
    for (const a of ALIASES)
      expect(SITEMAP.find((p) => p.path === a.path)?.title).toBe(
        fixture.find((f) => f.alias === a.alias)?.title,
      );
  });

  test("no alias starts a word of any title", async () => {
    const { ALIASES } = await aliases();
    for (const a of ALIASES)
      for (const p of SITEMAP)
        expect(
          `${a.alias} in ${p.title}: ${startsAWord(p.title, a.alias)}`,
        ).toBe(`${a.alias} in ${p.title}: false`);
  });

  test("each alias's page entry carries it; no other entry carries one", async () => {
    const { ALIASES } = await aliases();
    for (const e of index)
      expect(e.aliases ?? []).toEqual(
        ALIASES.filter((a) => a.path === e.path).map((a) => a.alias),
      );
  });

  test("the index is at most 30 kB gzipped", () => {
    const body = new TextEncoder().encode(JSON.stringify(index));
    expect(Bun.gzipSync(body).length).toBeLessThanOrEqual(30 * 1024);
  });

  test("marks() wraps each word-start match, and no match inside a word", () => {
    expect(Search.marks("Alert dialog", "dia")).toEqual([
      { text: "Alert ", mark: false },
      { text: "dia", mark: true },
      { text: "log", mark: false },
    ]);
    expect(Search.marks("Dialog, a media dialog.", "DIA")).toEqual([
      { text: "Dia", mark: true },
      { text: "log, a media ", mark: false },
      { text: "dia", mark: true },
      { text: "log.", mark: false },
    ]);
    expect(Search.marks("Social media.", "dia")).toEqual([
      { text: "Social media.", mark: false },
    ]);
    expect(Search.marks("Anything", "  ")).toEqual([
      { text: "Anything", mark: false },
    ]);
  });

  test("groups follow the doors' order, with Site last; each keeps rank order", () => {
    const e = (path: string, door: SearchEntry["door"]) => ({
      path,
      title: "Pane",
      door,
      summary: "",
      rank: 1 as const,
    });
    const groups = Search.groupHits([
      e("/changelog/", null),
      e("/foundations/a/", "foundations"),
      e("/components/a/", "components"),
      e("/start/a/", "start"),
      e("/components/b/", "components"),
      e("/brand/a/", "brand"),
    ]);
    expect(groups.map((g) => [g.door, g.name])).toEqual([
      ["start", "Start"],
      ["components", "Components"],
      ["brand", "Brand"],
      ["foundations", "Foundations"],
      [null, "Site"],
    ]);
    expect(groups[1]?.hits.map((h) => h.path)).toEqual([
      "/components/a/",
      "/components/b/",
    ]);
  });

  test("a component result names its item; no other result does", () => {
    const at = (path: string) => ({ path, title: "", door: null, summary: "" });
    expect(Search.componentName(at("/components/button/"))).toBe("button");
    expect(Search.componentName(at("/components/native-select/"))).toBe(
      "native-select",
    );
    expect(Search.componentName(at("/components/"))).toBeNull();
    expect(Search.componentName(at("/start/install/"))).toBeNull();
    expect(Search.componentName(at("/foundations/tokens/#scrim"))).toBeNull();
  });

  test("the key legend: 3 spoken keys, or 4 on a component result, named for the platform", () => {
    expect(Search.keyLegend(false, false).map((k) => k.spoken)).toEqual([
      "Up and down arrows",
      "Enter",
      "Escape",
    ]);
    expect(Search.keyLegend(true, true).map((k) => k.spoken)).toEqual([
      "Up and down arrows",
      "Enter",
      "Escape",
      "Command C",
    ]);
    expect(Search.keyLegend(true, false).at(-1)?.spoken).toBe("Control C");
    for (const k of Search.keyLegend(true, true)) {
      expect(k.keys.length).toBeGreaterThan(0);
      expect(k.does).toMatch(/^[a-z]/);
    }
  });
});

// 018 change review, finding 1: the best match first, so Enter opens it.
describe("018 review: groups in the order of their best match", () => {
  const index = buildIndex(SOURCES);
  for (const [q, want] of [
    ["colour", ["/brand/colour/", "/foundations/colour/"]],
    ["type", ["/brand/type/", "/foundations/type/"]],
    ["motion", ["/brand/motion/", "/foundations/motion/"]],
    ["token", ["/foundations/tokens/"]],
    [
      "theme",
      ["/components/kuiper-theme/", "/components/theme/", "/start/theme/"],
    ],
  ] as const)
    test(`"${q}": the first shown hit is a best match (${want.join(" or ")})`, () => {
      const hits = Search.search(index, q);
      const groups = Search.groupHits(hits);
      const best = Math.min(...hits.map((h) => h.rank));
      const first = groups[0].hits[0];
      expect(first.rank as number).toBe(best);
      expect(want as readonly string[]).toContain(first.path);
      // Groups run by their best rank; within a group, by rank.
      const bests = groups.map((g) => Math.min(...g.hits.map((h) => h.rank)));
      expect(bests).toEqual([...bests].sort((a, b) => a - b));
    });
});
