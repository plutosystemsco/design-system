/**
 * 026 tests 30 to 36: what an announcer says, and the word count that sets
 * a timed toast's time (026 decisions 5 and 10).
 */
import { afterEach, describe, expect, test } from "bun:test";
import {
  channelOf,
  countWords,
  DEFAULT_STRINGS,
  spokenText,
  type ToasterStrings,
} from "../../src/lib/registry/ui/toast/toast-words.ts";
import { createToastQueue } from "../../src/lib/registry/ui/toast/toast-queue.ts";

const KINDS = ["info", "success", "caution", "error", "loading"] as const;
const say = (t: Parameters<typeof spokenText>[0], hotkey = "F8") =>
  spokenText(t, DEFAULT_STRINGS, hotkey);

describe("026: what the announcers say", () => {
  test("30. kind words", () => {
    expect(say({ kind: "error", title: "Couldn't save" })).toBe(
      "Error: Couldn't save.",
    );
    expect(say({ kind: "caution", title: "Low on space" })).toBe(
      "Warning: Low on space.",
    );
    expect(say({ kind: "success", title: "Saved" })).toBe("Success: Saved.");
    expect(say({ kind: "info", title: "Sent" })).toBe("Sent.");
    expect(say({ kind: "loading", title: "Saving…" })).toBe("Saving…");
  });

  test("31. stops", () => {
    expect(say({ kind: "info", title: "Saved" })).toBe("Saved.");
    expect(say({ kind: "info", title: "Saved!" })).toBe("Saved!");
    expect(say({ kind: "info", title: "Saving…" })).toBe("Saving…");
    expect(say({ kind: "info", title: "Saved?" })).toBe("Saved?");
    expect(
      say({
        kind: "error",
        title: "Couldn't save",
        description: "Check your connection",
      }),
    ).toBe("Error: Couldn't save. Check your connection.");
  });

  test("32. the action's hint names the hotkey, the region and the label", () => {
    const t = {
      kind: "info" as const,
      title: "Message deleted",
      action: { label: "Undo", onclick() {} },
    };
    expect(say(t)).toBe(
      "Message deleted. Press F8, or go to Notifications, to reach Undo.",
    );
    expect(say(t, "F6")).toContain("Press F6");
  });

  test("33. strings replace every word", () => {
    const fr: ToasterStrings = {
      region: "Avis",
      list: "Les plus récents d'abord",
      dismiss: "Fermer",
      success: "Réussi",
      caution: "Attention",
      error: "Erreur",
      more: (n) => `${n} de plus`,
      hidden: (n) => `${n} masqué${n > 1 ? "s" : ""}`,
      reach: (action, key, region) =>
        `Appuyez sur ${key}, ou allez à ${region}, pour atteindre ${action}.`,
    };
    const english = new Set(
      [
        "Notifications",
        "Newest",
        "first",
        "Dismiss",
        "Success",
        "Warning",
        "Error",
        "more",
        "hidden",
        "Press",
        "go",
        "reach",
      ].map((w) => w.toLowerCase()),
    );
    for (const kind of KINDS) {
      const text = spokenText(
        {
          kind,
          title: "Message supprimé",
          description: "Il est dans la corbeille",
          action: { label: "Annuler", onclick() {} },
        },
        fr,
        "F8",
      );
      const left = text
        .split(/[^\p{L}]+/u)
        .filter((w) => english.has(w.toLowerCase()));
      expect(left, text).toEqual([]);
    }
    expect(Object.keys(DEFAULT_STRINGS).sort()).toEqual(Object.keys(fr).sort());
  });

  test("34. never 'Dismiss'", () => {
    for (const kind of KINDS)
      for (const action of [undefined, { label: "Undo", onclick() {} }])
        for (const description of [undefined, "More text"])
          expect(
            say({ kind, title: "Title", description, action }),
          ).not.toContain(DEFAULT_STRINGS.dismiss);
  });

  test("35. channels", () => {
    expect(channelOf("error")).toBe("assertive");
    for (const kind of ["info", "success", "caution", "loading"] as const)
      expect(channelOf(kind)).toBe("polite");
  });
});

describe("026: the word count", () => {
  const Segmenter = Intl.Segmenter;
  afterEach(() => {
    (Intl as { Segmenter?: unknown }).Segmenter = Segmenter;
  });

  test("36. words are counted by Intl.Segmenter, in the language passed in", () => {
    const ja = "保存しました。接続を確認してください。";
    expect(countWords("Project saved")).toBe(2);
    expect(countWords(ja, "ja")).toBeGreaterThan(2);

    // The queue counts in the language the toaster passes it.
    const timeOf = (lang: string | undefined) => {
      let t = 0;
      const timers: { at: number; fn: () => void }[] = [];
      const q = createToastQueue({
        now: () => t,
        setTimeout: (fn, ms) => timers.push({ at: t + ms, fn }),
        clearTimeout: () => {},
        frame: () => {},
      });
      q.subscribe(
        () => {},
        () => {},
      );
      q.setLang(lang);
      q.raise("success", ja.repeat(4));
      return q.entries().showing[0]!.remaining;
    };
    expect(timeOf("ja")).toBeGreaterThan(6000);

    // Without Intl.Segmenter, whitespace splits.
    (Intl as { Segmenter?: unknown }).Segmenter = undefined;
    expect(countWords("Project saved")).toBe(2);
    expect(countWords(ja, "ja")).toBe(1);
  });
});
