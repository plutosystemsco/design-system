import { Prec, RangeSetBuilder, type Extension } from "@codemirror/state";
import {
  Decoration,
  ViewPlugin,
  type DecorationSet,
  type EditorView,
  type ViewUpdate,
} from "@codemirror/view";
import {
  CODE_ROLES,
  loadHighlighter,
  roleClasses,
  type CodeRole,
  type HighlightChange,
  type HighlightSession,
} from "#lib/registry/lib/highlighter";

/** One mark per role, with the classes a code block renders. */
const MARKS = Object.fromEntries(
  CODE_ROLES.filter((role) => role !== "text").map((role) => [
    role,
    Decoration.mark({ class: roleClasses[role] }),
  ]),
) as Record<Exclude<CodeRole, "text">, Decoration>;

/**
 * The editor's colour, from the highlighter (013 decision 16): the same
 * session a code block streams through, so the editor colours code exactly as
 * the block does. One view plugin, at the highest precedence, so its span is
 * innermost and its class decides the colour.
 *
 * It loads the language, then opens a session on the document as it is
 * then. Each committed update passes its changes to the session, which
 * re-parses once; the marks cover the visible ranges only. Until the
 * language loads the editor shows plain text, as the prerendered fallback
 * does. Lezer, or a legacy mode, keeps indentation, brackets and the rest.
 */
export function codeHighlighting(language: string): Extension {
  return Prec.highest(
    ViewPlugin.fromClass(
      class {
        decorations: DecorationSet = Decoration.none;
        session: HighlightSession | null = null;
        stop: (() => void) | null = null;
        destroyed = false;

        constructor(readonly view: EditorView) {
          void loadHighlighter(language)
            .then((highlighter) => {
              if (!highlighter || this.destroyed) return;
              const session = highlighter.session(
                this.view.state.doc.toString(),
              );
              this.session = session;
              this.stop = session.onChange(() => this.repaint());
              this.repaint();
            })
            .catch(() => {});
        }

        /** Rebuilds the marks and asks the view to redraw once. */
        repaint() {
          if (this.destroyed || !this.session) return;
          this.decorations = this.build();
          this.view.dispatch({});
        }

        build(): DecorationSet {
          const builder = new RangeSetBuilder<Decoration>();
          if (!this.session) return builder.finish();
          for (const { from, to } of this.view.visibleRanges)
            for (const range of this.session.ranges(from, to))
              builder.add(
                range.from,
                range.to,
                MARKS[range.role as Exclude<CodeRole, "text">],
              );
          return builder.finish();
        }

        update(update: ViewUpdate) {
          if (!this.session) return;
          if (update.docChanged) {
            // `update.changes` composes every transaction the view committed
            // since the last update, so one update parses once.
            const changes: HighlightChange[] = [];
            update.changes.iterChanges((fromA, toA, fromB, toB) =>
              changes.push({ fromA, toA, fromB, toB }),
            );
            this.session.update(update.state.doc.toString(), changes);
          }
          if (update.docChanged || update.viewportChanged)
            this.decorations = this.build();
        }

        destroy() {
          this.destroyed = true;
          this.stop?.();
          this.session?.dispose();
          this.session = null;
        }
      },
      { decorations: (plugin) => plugin.decorations },
    ),
  );
}
