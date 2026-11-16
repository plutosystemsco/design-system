/**
 * 022 test 5, decision 11, criteria 8 and 9: the scripted set. Every
 * candidate re-derived from item source is in `SR_ITEMS` or `SR_EXCLUDED`;
 * each item in `SR_ITEMS` has its file, with a test per declared kind, each
 * test declaring `item`, `rules` and `hears`, each `hears` entry the item or
 * one of its transitive dependencies, and each part declared for its item.
 */
import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { declaredTests, kindsOf } from "../sr/declared.ts";
import { candidates, dependencies } from "../sr/derive.ts";
import { SR_EXCLUDED, SR_ITEMS } from "../sr/items.ts";
import { RULE_IDS } from "../sr/rules.ts";

const TESTS = declaredTests();

describe("022 test 5: the scripted set", () => {
  test("SR_ITEMS holds the 28 items of decision 11", () => {
    expect(Object.keys(SR_ITEMS).sort()).toEqual(
      [
        "status",
        "alert",
        "spinner",
        "error-summary",
        "message-log",
        "marker",
        "code-block",
        "composer",
        "stage-card",
        "live-console",
        "message",
        "code-editor",
        "sidebar",
        "marketing-bar",
        "tooltip",
        "popover",
        "alert-dialog",
        "dialog",
        "sheet",
        "dropdown-menu",
        "chart",
        "sign-in",
        "sign-up",
        "settings",
        "page-states",
        "app-shell",
        "chat",
        "product-home",
      ].sort(),
    );
  });

  test("every derived candidate, role maps included, is listed or excluded with a reason", () => {
    const loose = [...candidates().keys()].filter(
      (n) => !(n in SR_ITEMS) && !SR_EXCLUDED[n]?.trim(),
    );
    expect(loose).toEqual([]);
    // alert's role comes from its role map, not a literal role.
    expect(candidates().get("alert")).toContain("role map");
  });

  test("breadcrumb and input-group are excluded, with reasons; no item is in both lists", () => {
    expect(SR_EXCLUDED.breadcrumb).toBeTruthy();
    expect(SR_EXCLUDED["input-group"]).toBeTruthy();
    expect(Object.keys(SR_ITEMS).filter((n) => n in SR_EXCLUDED)).toEqual([]);
  });
});

describe("022 test 5: one file per item, a test per kind", () => {
  test("28 files, one per item in SR_ITEMS, and no other", () => {
    const files = [...new Set(TESTS.map((t) => t.file))].sort();
    expect(files).toEqual(
      Object.keys(SR_ITEMS)
        .map((n) => `${n}.sr.ts`)
        .sort(),
    );
    for (const f of files) expect(existsSync(`tests/sr/${f}`)).toBe(true);
  });

  test("each file's tests are of its item, and cover each declared kind", () => {
    const missing: string[] = [];
    for (const [item, kinds] of Object.entries(SR_ITEMS)) {
      const mine = TESTS.filter((t) => t.file === `${item}.sr.ts`);
      if (mine.some((t) => t.item !== item))
        missing.push(`${item}: a test names another item`);
      const covered = new Set(mine.flatMap((t) => kindsOf(t.rules)));
      for (const k of kinds)
        if (!covered.has(k)) missing.push(`${item}: no ${k} test`);
    }
    expect(missing).toEqual([]);
  });

  test("every test declares item, rules and hears; each rule is known", () => {
    const bad = TESTS.filter(
      (t) =>
        !t.item ||
        !t.rules.length ||
        !t.hears.length ||
        t.rules.some((r) => !RULE_IDS.includes(r as never)),
    ).map((t) => `${t.file} › ${t.title}`);
    expect(bad).toEqual([]);
    expect(TESTS.length).toBeGreaterThanOrEqual(28);
  });

  test("each hears entry is the item or one of its transitive dependencies, and each part is declared", () => {
    const bad: string[] = [];
    for (const t of TESTS) {
      const deps = dependencies(t.item);
      for (const h of t.hears) {
        const [item, part] = h.split(":");
        if (item !== t.item && !deps.has(item!))
          bad.push(
            `${t.file} › ${t.title}: ${item} is not ${t.item} or a dependency`,
          );
        if (part !== undefined) {
          const parts =
            TESTS.find((x) => x.file === `${item}.sr.ts`)?.parts ?? [];
          if (!/^[a-z]+$/.test(part) || !parts.includes(part))
            bad.push(
              `${t.file} › ${t.title}: ${h}'s part is not declared in ${item}.sr.ts`,
            );
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
