<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Choose a language and the editor loads its grammar, one dynamic import the first time, then swaps in that language's sample. CodeMirror's grammar keeps indentation, brackets and the rest; the colour is the highlighter's, so the editor colours each language exactly as a code block does.",
  };
</script>

<script lang="ts">
  import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
  import { bracketMatching, indentOnInput } from "@codemirror/language";
  import type { Extension } from "@codemirror/state";
  import {
    highlightActiveLine,
    highlightActiveLineGutter,
    keymap,
    lineNumbers,
  } from "@codemirror/view";
  import {
    codeLanguages,
    loadLanguage,
  } from "#lib/registry/lib/code-languages";
  import { CodeEditor } from "#lib/registry/ui/code-editor";
  import * as Field from "#lib/registry/ui/field";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import { Status } from "#lib/registry/ui/status";
  import { CODE_SAMPLES } from "./samples";

  // A base setup for any language: everything pythonSetup() has but the
  // language and its colour, which loadLanguage brings. An app writes its
  // own beside the item.
  function baseSetup(): Extension[] {
    return [
      lineNumbers(),
      history(),
      keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap]),
      closeBrackets(),
      bracketMatching(),
      indentOnInput(),
      highlightActiveLine(),
      highlightActiveLineGutter(),
    ];
  }

  const base = baseSetup();
  const samples = new Map(CODE_SAMPLES.map((s) => [s.language, s]));
  const sampleOf = (id: string) => samples.get(id);

  let chosen = $state("python");
  let value = $state(sampleOf("python")?.code ?? "");
  let editor: CodeEditor | undefined = $state();
  let extensions: Extension = $state(base);
  let loaded = $state("");

  // The chosen language loads through loadLanguage; the editor reconfigures
  // and the sample's text comes in through reset(), so the history is clear.
  $effect(() => {
    const id = chosen;
    let cancelled = false;
    loadLanguage(id).then((support) => {
      if (cancelled) return;
      extensions = support ? [...base, support] : base;
      editor?.reset(sampleOf(id)?.code ?? "");
      loaded = support ? `${sampleOf(id)?.title ?? id} loaded` : "Not listed";
    });
    return () => {
      cancelled = true;
    };
  });
</script>

<div class="grid max-w-2xl gap-3" data-testid="keyboard-fixture">
  <Field.Field class="max-w-xs">
    <Field.Label>Language</Field.Label>
    <NativeSelect.Root bind:value={chosen} data-testid="language-select">
      {#each codeLanguages as language (language.id)}
        <NativeSelect.Option value={language.id}
          >{sampleOf(language.id)?.title ?? language.id}</NativeSelect.Option
        >
      {/each}
    </NativeSelect.Root>
  </Field.Field>
  <CodeEditor
    bind:this={editor}
    bind:value
    label="Language example"
    {extensions}
  />
  <Status
    visible
    data-testid="language-loaded"
    class="font-mono text-xs text-muted-foreground"
    text={loaded}
  />
</div>
