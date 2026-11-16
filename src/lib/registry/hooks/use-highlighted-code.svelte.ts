import {
  loadHighlighter,
  type HighlightChange,
  type Highlighter,
  type HighlightedLine,
  type HighlightSession,
} from "#lib/registry/lib/highlighter";

/**
 * Highlights `code` in `language`. `current` holds one entry per line: a plain
 * string until the highlighter loads, then the line's tokens, each
 * `{ content, class }`. Pass each one to the `code` prop of a `CodeBlock.Line`.
 * `settled` is true once nothing is loading: no highlighter, and no grammar
 * the code embeds (an HTML block's script, a Markdown fence).
 *
 * ```svelte
 * <script lang="ts">
 *   const lines = useHighlightedCode(() => code, () => "json");
 * </script>
 *
 * {#each lines.current as line, index (index)}
 *   <CodeBlock.Line code={line} />
 * {/each}
 * ```
 *
 * The code streams through one session: when the new text extends the old,
 * only the appended range is re-parsed and re-queried.
 */
export function useHighlightedCode(
  value: () => string,
  language: () => string,
) {
  let loaded = $state.raw<{
    language: string;
    highlighter: Highlighter | null;
  } | null>(null);
  // Bumped when a session's embedded grammar arrives, so the lines repaint.
  let version = $state(0);

  $effect(() => {
    const lang = language();
    let cancelled = false;

    loadHighlighter(lang)
      .then((next) => {
        if (!cancelled) {
          loaded = { language: lang, highlighter: next };
        }
      })
      .catch(() => {
        if (!cancelled) loaded = { language: lang, highlighter: null };
      });

    return () => {
      cancelled = true;
    };
  });

  /** The open session: its highlighter, the text it holds, and its listener. */
  let open: {
    highlighter: Highlighter;
    session: HighlightSession;
    text: string;
    stop: () => void;
  } | null = null;

  const close = () => {
    open?.stop();
    open?.session.dispose();
    open = null;
  };

  $effect(() => close);

  const state = $derived.by(
    (): {
      lines: HighlightedLine[];
      settled: boolean;
    } => {
      void version;
      const raw = value();
      // A trailing newline would render as an extra empty line.
      const code = raw.endsWith("\n") ? raw.slice(0, -1) : raw;
      const lang = language();
      const ready = loaded?.language === lang;
      const highlighter = ready ? loaded!.highlighter : null;

      if (!highlighter) {
        if (open) close();
        // Plain until the highlighter arrives; settled once it is known there is none.
        return { lines: code.split("\n"), settled: ready || !lang };
      }

      if (open?.highlighter !== highlighter) {
        close();
        const session = highlighter.session(code);
        const stop = session.onChange(() => {
          version++;
        });
        open = { highlighter, session, text: code, stop };
      } else if (open.text !== code) {
        const old = open.text;
        const change: HighlightChange = code.startsWith(old)
          ? {
              fromA: old.length,
              toA: old.length,
              fromB: old.length,
              toB: code.length,
            }
          : { fromA: 0, toA: old.length, fromB: 0, toB: code.length };
        open.session.update(code, [change]);
        open.text = code;
      }

      return {
        lines: open.session.lines().slice(),
        settled: open.session.settled,
      };
    },
  );

  return {
    get current() {
      return state.lines;
    },
    get settled() {
      return state.settled;
    },
  };
}
