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
  import { CodeEditor, codeHighlight } from "#lib/registry/ui/code-editor";
  import * as Field from "#lib/registry/ui/field";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import { Status } from "#lib/registry/ui/status";
  import { CODE_SAMPLES } from "#lib/preview/code-samples";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // A base setup for any language: everything pythonSetup() has but the
  // language and the roles plugin. An app writes its own beside the item.
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
      codeHighlight,
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
  // The gaps the palette memo found per language, where there is one.
  const gaps: Record<string, string> = {
    python: "self, the built-ins and docstrings come from the roles plugin",
    css: "selectors are className to Lezer, so they take the type colour, not tag; var() and calc() are keywords",
    yaml: "plain scalars are untagged: values take the body colour",
    jsx: "JSX braces take the body colour",
    tsx: "JSX braces take the body colour",
    html: "entities such as &amp; take the body colour",
    go: "len and make are plain calls",
    rust: "a lifetime takes the body colour; #[derive] is one meta token",
    java: "@Override is untagged",
    cpp: "[[nodiscard]] takes the body colour",
    php: "#[Attribute] and $this take the body colour",
    shellscript: "keywords, strings, numbers, comments and $variables; no tree",
    toml: "a [table] reads as a constant; no tree",
    diff: "the @@ line reads as a decorator; headers are untagged; no tree",
    docker: "keywords, strings and comments; no tree",
    ruby: "Shop::Item reads as a tag; no tree",
    swift: "no decorator, no calls; no tree",
    kotlin: "no calls, no ${} parts; no tree",
    csharp:
      "keywords, three types and strings; no numbers, attributes or this; no tree",
  };
</script>

<ItemHeader name="code-languages" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Choose a language and the editor loads its grammar, one dynamic import the first time, then swaps in that language's sample. The twenty-one slots colour every grammar the same way; a language with a Lezer grammar gets the full palette, a legacy mode its keywords, strings, numbers and comments."
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
  intro="Eighteen languages come with a Lezer grammar (Svelte's from a third-party package, four years old), eight as legacy modes: CodeMirror 5 tokenisers with no syntax tree, so no bracket matching or indentation by syntax, and a coarser palette."
>
  <table class="w-full text-sm" data-testid="kinds-table">
    <thead>
      <tr class="text-muted-foreground">
        <th scope="col" class="py-2 text-start font-medium">id</th>
        <th scope="col" class="py-2 text-start font-medium">aliases</th>
        <th scope="col" class="py-2 text-start font-medium">kind</th>
        <th scope="col" class="py-2 text-start font-medium">gaps</th>
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
            >{gaps[language.id] ?? "none found"}</td
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
      <strong>One copy of <code>@lezer/highlight</code>.</strong> The highlight style
      and the grammars it colours must share one instance of that package, or the
      modified tags mismatch by id and a function name reads as an escape. The lock
      file pins it once; an app that installs a language package of its own checks
      that it still does.
    </li>
    <li>
      Svelte comes from <code>@replit/codemirror-lang-svelte</code> 6.0.0,
      released in 2022: runes such as <code>$props()</code> parse as calls.
      Python is the configured grammar <code>pythonSetup()</code> uses, so the editor's
      Python is one language everywhere; the roles plugin stays in the preset's hands.
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
