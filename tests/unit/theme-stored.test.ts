/**
 * 020 test 10, decision 5: the store's half of the carry-over. The head
 * script repeats the same steps; theme.spec.ts holds it to the same cases.
 */
import { describe, expect, test } from "bun:test";
import {
  OLD_THEME_KEY,
  readStoredTheme,
  THEME_KEY,
} from "../../src/lib/registry/ui/theme/stored.ts";

/** A Map behind the three Storage calls the read uses. */
function stub(initial: Record<string, string>) {
  const map = new Map(Object.entries(initial));
  return {
    map,
    getItem: (k: string) => map.get(k) ?? null,
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
  };
}

// [stored before, the choice, stored after]
const CASES: [
  string,
  Record<string, string>,
  "light" | "dark" | null,
  Record<string, string>,
][] = [
  [
    "an old dark, no new key",
    { "pluto-theme": "dark" },
    "dark",
    { "kuiper-theme": "dark" },
  ],
  [
    "an old light",
    { "pluto-theme": "light" },
    "light",
    { "kuiper-theme": "light" },
  ],
  ["an old blue", { "pluto-theme": "blue" }, null, {}],
  [
    "a new light beside an old dark",
    { "kuiper-theme": "light", "pluto-theme": "dark" },
    "light",
    { "kuiper-theme": "light" },
  ],
  [
    "a new blue, no old key",
    { "kuiper-theme": "blue" },
    null,
    { "kuiper-theme": "blue" },
  ],
  [
    "a new blue beside an old dark",
    { "kuiper-theme": "blue", "pluto-theme": "dark" },
    "dark",
    { "kuiper-theme": "dark" },
  ],
  ["neither", {}, null, {}],
];

describe("020 test 10: readStoredTheme", () => {
  test("the keys are kuiper-theme and, until 0.14.0, pluto-theme", () => {
    expect(THEME_KEY).toBe("kuiper-theme");
    expect(OLD_THEME_KEY).toBe("pluto-theme");
  });

  test.each(CASES)("%s", (_label, before, choice, after) => {
    const storage = stub(before);
    expect(readStoredTheme(storage)).toBe(choice);
    expect(Object.fromEntries(storage.map)).toEqual(after);
  });

  test("a storage whose every call throws gives no choice and throws nothing", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
      removeItem: () => {
        throw new Error("denied");
      },
    };
    expect(() => readStoredTheme(broken)).not.toThrow();
    expect(readStoredTheme(broken)).toBeNull();
  });
});
