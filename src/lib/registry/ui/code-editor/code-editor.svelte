<script lang="ts">
  import { onMount } from "svelte";
  import {
    Compartment,
    EditorState,
    Prec,
    type Extension,
  } from "@codemirror/state";
  import { EditorView, keymap } from "@codemirror/view";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { codeTheme } from "./code-editor-theme";

  let {
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    label,
    describedby,
    readonly = false,
    disabled = false,
    extensions = [],
    onrun,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** The document. Bound both ways: edits flow out, a new value replaces the document. */
    value?: string;
    /** The accessible name, set as `aria-label` on the editor's content. Required. */
    label: string;
    /** The id of visible text that describes the editor, set as `aria-describedby`. */
    describedby?: string;
    /** Read-only: the editor keeps its stop and says `aria-readonly`; typing changes nothing. */
    readonly?: boolean;
    /** Disabled: `contenteditable="false"`, and the editor leaves the tab order. */
    disabled?: boolean;
    /** The language and keymaps, such as `pythonSetup()`. Reconfigured when it changes. */
    extensions?: Extension;
    /** Called with the document on Ctrl Enter (and Cmd Enter). */
    onrun?: (doc: string) => void;
  } = $props();

  let view: EditorView | undefined;
  let mounted = $state(false);

  // Compartments: CodeMirror's units of reconfigurable state.
  const editable = new Compartment();
  const attributes = new Compartment();
  const extra = new Compartment();

  const editableOf = (readonly: boolean, disabled: boolean): Extension => [
    EditorState.readOnly.of(readonly || disabled),
    EditorView.editable.of(!disabled),
  ];

  // tabindex: axe asks that a scrollable region be reachable by keyboard, and
  // the content is the one stop; a disabled editor leaves the tab order.
  const attributesOf = (
    label: string,
    describedby: string | undefined,
    disabled: boolean,
  ): Extension =>
    EditorView.contentAttributes.of({
      "aria-label": label,
      ...(describedby ? { "aria-describedby": describedby } : {}),
      tabindex: disabled ? "-1" : "0",
    });

  // Highest precedence, so the default Mod-Enter (insertBlankLine) is
  // suppressed, and bound beside Ctrl-Enter so the key works on every platform.
  function run(current: EditorView): boolean {
    onrun?.(current.state.doc.toString());
    return true;
  }

  function makeState(doc: string): EditorState {
    return EditorState.create({
      doc,
      extensions: [
        codeTheme,
        Prec.highest(
          keymap.of([
            { key: "Mod-Enter", run },
            { key: "Ctrl-Enter", run },
          ]),
        ),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) value = update.state.doc.toString();
        }),
        editable.of(editableOf(readonly, disabled)),
        attributes.of(attributesOf(label, describedby, disabled)),
        extra.of(extensions),
      ],
    });
  }

  // A view is created once, so in onMount, not an effect. The server renders
  // the fallback pre; the view takes its place on mount.
  onMount(() => {
    if (!ref) return;
    mounted = true;
    view = new EditorView({ state: makeState(value), parent: ref });
    return () => {
      view?.destroy();
      view = undefined;
    };
  });

  // Parent to editor: a whole-document change only when the two differ. After
  // an edit the listener has already made them equal, so nothing loops.
  $effect(() => {
    const next = value;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== next)
      view.dispatch({
        changes: { from: 0, to: current.length, insert: next },
      });
  });

  $effect(() => {
    const config = editableOf(readonly, disabled);
    view?.dispatch({ effects: editable.reconfigure(config) });
  });

  $effect(() => {
    const config = attributesOf(label, describedby, disabled);
    view?.dispatch({ effects: attributes.reconfigure(config) });
  });

  $effect(() => {
    const config = extensions;
    view?.dispatch({ effects: extra.reconfigure(config) });
  });

  /** Moves focus into the editor. */
  export function focus(): void {
    view?.focus();
  }

  /** Replaces the document with a new state, so the history is cleared. */
  export function reset(text: string): void {
    value = text;
    view?.setState(makeState(text));
  }

  /** The CodeMirror view, for an app that needs more. Undefined before mount. */
  export function getView(): EditorView | undefined {
    return view;
  }
</script>

<!--
  The root shares the code block's muted ground and carries no overflow-hidden:
  the focus indicator sits outside .cm-editor, which fills the root, and a
  clip would hide it. The theme rounds the editor and its scroller instead. The
  fallback pre is the editor's type and padding in Tailwind's terms; its 32 px
  start padding sits a few pixels short of the gutter. It is a named
  group: ARIA in HTML prohibits a name on a bare pre, and a group may carry one.
-->
<div
  bind:this={ref}
  data-slot="code-editor"
  class={cn("rounded bg-muted", className)}
  {...restProps}
>
  {#if !mounted}
    <pre
      data-slot="code-editor-fallback"
      role="group"
      aria-label={label}
      class="overflow-x-auto py-3 ps-8 font-mono text-sm">{value}</pre>
  {/if}
</div>
