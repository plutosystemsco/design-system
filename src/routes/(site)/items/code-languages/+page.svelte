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
  import { highlightLanguages } from "#lib/registry/lib/highlighter";
  import { CodeEditor } from "#lib/registry/ui/code-editor";
  import * as Field from "#lib/registry/ui/field";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import { Status } from "#lib/registry/ui/status";
  import { CODE_SAMPLES } from "#lib/preview/code-samples";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

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

  const kinds: Record<string, string> = {
    lezer: "Lezer grammar",
    svelte: "Lezer grammar, @replit/codemirror-lang-svelte",
    legacy: "legacy mode",
  };
  // 013 decision 16: the colour is the highlighter's, by engine.
  const engines = new Map(highlightLanguages.map((l) => [l.id, l.engine]));
</script>

<ItemHeader name="code-languages" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Choose a language and the editor loads its grammar, one dynamic import the first time, then swaps in that language's sample. CodeMirror's grammar keeps indentation, brackets and the rest; the colour is the highlighter's, so the editor colours each language exactly as a code block does."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen
      caption="loadLanguage(id) beside a base setup, reset() with the sample"
      class="w-full"
    >
      <div class="grid w-full gap-3" data-testid="keyboard-fixture">
        <Field.Field class="max-w-xs">
          <Field.Label>Language</Field.Label>
          <NativeSelect.Root bind:value={chosen} data-testid="language-select">
            {#each codeLanguages as language (language.id)}
              <NativeSelect.Option value={language.id}
                >{sampleOf(language.id)?.title ??
                  language.id}</NativeSelect.Option
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
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="The twenty-six"
  intro="Eighteen languages come with a Lezer grammar (Svelte's from a third-party package, released in 2022), eight as legacy modes: CodeMirror 5 tokenisers with no syntax tree, so no bracket matching or indentation by syntax. Every one takes its colour from the highlighter: tree-sitter for twenty-one, Shiki for five."
>
  <table class="w-full text-sm" data-testid="kinds-table">
    <thead>
      <tr class="text-muted-foreground">
        <th scope="col" class="py-2 text-start font-medium">id</th>
        <th scope="col" class="py-2 text-start font-medium">aliases</th>
        <th scope="col" class="py-2 text-start font-medium">kind</th>
        <th scope="col" class="py-2 text-start font-medium">colour</th>
      </tr>
    </thead>
    <tbody>
      {#each codeLanguages as language (language.id)}
        <tr class="groove align-top">
          <td class="py-2 pe-3"><code>{language.id}</code></td>
          <td class="py-2 pe-3 font-mono text-xs text-muted-foreground"
            >{language.aliases.join(" ") || "none"}</td
          >
          <td class="py-2 pe-3">{kinds[language.kind]}</td>
          <td class="py-2 text-muted-foreground"
            >{engines.get(language.id) ?? "none"}</td
          >
        </tr>
      {/each}
    </tbody>
  </table>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The editor is <code>code-editor</code>'s: one textbox named by
      <code>label</code>, one ring around the whole editor, Tab unbound. A
      language changes nothing a reader hears.
    </li>
    <li>
      <strong>What it costs.</strong> Installing this item installs
      <code>@codemirror/language-data</code>, which depends on every
      <code>@codemirror/lang-*</code> package and the legacy modes: about two
      megabytes unpacked on disk. In the bundle each language is its own chunk,
      loaded the first time <code>loadLanguage</code> asks for it. An app that
      edits Python alone does not install this item: <code>pythonSetup()</code>
      is enough.
    </li>
    <li>
      <strong>Two parsers per keystroke.</strong> CodeMirror's grammar for structure
      and tree-sitter for colour. Only the visible lines are queried, so a long document
      stays quick to type in.
    </li>
    <li>
      Svelte comes from <code>@replit/codemirror-lang-svelte</code> 6.0.0,
      released in 2022, for its structure; its colour, runes included, is the
      highlighter's. Python is the grammar <code>pythonSetup()</code> uses, so the
      editor's Python is one language everywhere.
    </li>
    <li>
      <code>loadLanguage</code> matches a name strictly, never by substring, and
      returns <code>null</code> for one the table does not hold, so an app falls back
      to plain text instead of a guessed grammar.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: the select, then the editor. The arrow keys change the language in the select; Tab enters the editor and Tab leaves it."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    The fixture is the specimen above: its select and its editor.
  </p>
</PreviewSection>
