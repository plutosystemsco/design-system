/**
 * What a toast's announcer says, built from its strings alone, and the word
 * count that sets a timed toast's time. Pure: no DOM, no runes.
 */
import type { ToastAction, ToastKind } from "./toast-queue.js";

/** Every word the toaster says or shows, so an app can translate them. */
export type ToasterStrings = {
  /** The region's name, a landmark: "Notifications". */
  region: string;
  /** The list's name, heard when F8 lands on it: "Newest first". */
  list: string;
  /** Each toast's close button: "Dismiss". Never spoken on arrival. */
  dismiss: string;
  /** Said before a success's title: "Success". */
  success: string;
  /** Said before a caution's title: "Warning". */
  caution: string;
  /** Said before an error's title: "Error". */
  error: string;
  /** The count of toasts waiting behind a full stack: "2 more". */
  more: (n: number) => string;
  /** The count of toasts stepped aside from the focus: "1 hidden". */
  hidden: (n: number) => string;
  /** The hint an action toast ends with, naming its key, its region and its action. */
  reach: (action: string, key: string, region: string) => string;
};

/** The English strings every `ToasterStrings` falls back to. */
export const DEFAULT_STRINGS: ToasterStrings = {
  region: "Notifications",
  list: "Newest first",
  dismiss: "Dismiss",
  success: "Success",
  caution: "Warning",
  error: "Error",
  more: (n) => `${n} more`,
  hidden: (n) => `${n} hidden`,
  reach: (action, key, region) =>
    `Press ${key}, or go to ${region}, to reach ${action}.`,
};

/** The word said before a kind's title, if it has one: success, caution and error do. */
export function kindWord(
  kind: ToastKind,
  strings: ToasterStrings,
): string | undefined {
  if (kind === "success") return strings.success;
  if (kind === "caution") return strings.caution;
  if (kind === "error") return strings.error;
  return undefined;
}

/** A sentence with a full stop, unless it already ends in one of `.`, `!`, `?` or `…`. */
export function withStop(text: string): string {
  const t = text.trim();
  return /[.!?…]$/.test(t) ? t : `${t}.`;
}

/** Which announcer speaks a kind: errors interrupt; the rest wait their turn. */
export function channelOf(kind: ToastKind): "polite" | "assertive" {
  return kind === "error" ? "assertive" : "polite";
}

/**
 * What the announcer says for a toast: its kind's word, its title, its
 * description and, for an action, the hint that names the key, the region
 * and the action. Never the Dismiss button's name.
 */
export function spokenText(
  t: {
    kind: ToastKind;
    title: string;
    description?: string;
    action?: ToastAction;
  },
  strings: ToasterStrings,
  hotkey: string,
): string {
  const word = kindWord(t.kind, strings);
  const parts = [`${word ? `${word}: ` : ""}${withStop(t.title)}`];
  if (t.description) parts.push(withStop(t.description));
  if (t.action)
    parts.push(strings.reach(t.action.label, hotkey, strings.region));
  return parts.join(" ");
}

/**
 * How many words a text holds, in `lang`. `Intl.Segmenter` splits Chinese,
 * Japanese and Thai, which whitespace cannot; where it is missing,
 * whitespace splits.
 */
export function countWords(text: string, lang?: string): number {
  const Segmenter = (
    Intl as {
      Segmenter?: typeof Intl.Segmenter;
    }
  ).Segmenter;
  if (Segmenter) {
    let locale: string | undefined = lang || undefined;
    try {
      if (locale) Intl.getCanonicalLocales(locale);
    } catch {
      locale = undefined;
    }
    let n = 0;
    for (const s of new Segmenter(locale, { granularity: "word" }).segment(
      text,
    ))
      if (s.isWordLike) n++;
    return n;
  }
  return text.split(/\s+/).filter(Boolean).length;
}
