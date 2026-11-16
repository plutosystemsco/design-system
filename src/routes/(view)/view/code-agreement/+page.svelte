<script lang="ts">
  import { onMount } from "svelte";
  import { closeBrackets } from "@codemirror/autocomplete";
  import { history } from "@codemirror/commands";
  import { bracketMatching } from "@codemirror/language";
  import type { Extension } from "@codemirror/state";
  import { EditorView, lineNumbers } from "@codemirror/view";
  import { loadLanguage } from "#lib/registry/lib/code-languages";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { CodeEditor } from "#lib/registry/ui/code-editor";
  import { SPECIMENS } from "../../../../../tests/fixtures/highlight/specimens";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // The two editors of 013 decision 21: a full-height one that E6 loads each
  // text into, and a 20-line one on a 2,000-line Ruby file for the windowed
  // case (and E7's timings). Each has a mirror block: a fresh block of the
  // editor's current text, re-created whenever the text changes.
  const base: Extension[] = [
    lineNumbers(),
    history(),
    closeBrackets(),
    bracketMatching(),
  ];
  const ruby = SPECIMENS.find((s) => s.language === "ruby")!.code.split("\n");
  const RUBY = Array.from(
    { length: 2000 },
    (_, i) => ruby[i % ruby.length],
  ).join("\n");

  type Pane = {
    language: string;
    value: string;
    extensions: Extension;
    editor: CodeEditor | undefined;
  };
  const full: Pane = $state({
    language: "",
    value: "",
    extensions: base,
    editor: undefined,
  });
  // Twenty lines tall: the editor scrolls inside itself.
  const twenty = EditorView.theme({
    "&": { height: "30rem" },
    ".cm-scroller": { overflow: "auto" },
  });
  const windowed: Pane = $state({
    language: "ruby",
    value: RUBY,
    extensions: base,
    editor: undefined,
  });
  // 022m: an editor with no setup at all, the item's default `extensions`.
  let bare: CodeEditor | undefined = $state();
  let ready = $state(false);
  // The mirror blocks render only when a test asks for them, so E7's typing
  // times the editor alone.
  let mirror = $state(false);

  /** Loads a text into an editor, in a language: the support, then reset(). */
  async function set(pane: Pane, language: string, code: string) {
    const support = await loadLanguage(language);
    const own = pane === windowed ? [...base, twenty] : base;
    pane.extensions = support ? [...own, support] : own;
    pane.language = language;
    pane.editor?.reset(code);
    pane.value = code;
  }

  onMount(() => {
    const panes = { full, windowed };
    (window as unknown as { agreement: unknown }).agreement = {
      set: (which: "full" | "windowed", language: string, code: string) =>
        set(panes[which], language, code),
      view: (which: "full" | "windowed" | "bare") =>
        (which === "bare" ? bare : panes[which].editor)?.getView(),
      mirror: (on: boolean) => (mirror = on),
    };
    void set(windowed, "ruby", RUBY).then(() => (ready = true));
  });
</script>

<svelte:head>
  <title>Code agreement</title>
</svelte:head>

<!--
  013 decision 21: a test surface, not a page of the site. Each gallery
  sample twice, once from prerendered lines and once from code and language
  through the hook, then the eighteen specimens as live blocks.
-->
<div class="grid gap-10 p-6">
  <h1 class="text-xl">Code agreement</h1>

  <section aria-labelledby="gallery" class="grid gap-6">
    <h2 id="gallery" class="text-lg">The gallery, twice</h2>
    {#each data.gallery as sample (sample.language)}
      <div
        class="grid min-w-0 gap-4 lg:grid-cols-2"
        data-sample={sample.language}
      >
        <CodeBlock.Root
          data-copy="prerendered"
          aria-label="{sample.title}, prerendered"
        >
          <CodeBlock.Content lines={sample.lines} />
        </CodeBlock.Root>
        <CodeBlock.Root data-copy="live" aria-label="{sample.title}, live">
          <CodeBlock.Content code={sample.code} language={sample.language} />
        </CodeBlock.Root>
      </div>
    {/each}
  </section>

  <section
    aria-labelledby="editors"
    class="grid gap-6"
    data-editors-ready={ready || undefined}
  >
    <h2 id="editors" class="text-lg">The editors</h2>
    <div class="grid min-w-0 gap-4 lg:grid-cols-2">
      <CodeEditor
        bind:this={full.editor}
        bind:value={full.value}
        label="The full-height editor"
        extensions={full.extensions}
        data-editor="full"
      />
      {#if mirror}
        {#key full.value + full.language}
          <CodeBlock.Root
            data-mirror="full"
            aria-label="The full-height editor's text"
          >
            <CodeBlock.Content
              code={full.value}
              language={full.language || undefined}
            />
          </CodeBlock.Root>
        {/key}
      {/if}
    </div>
    <div class="grid min-w-0 gap-4 lg:grid-cols-2">
      <CodeEditor
        bind:this={windowed.editor}
        bind:value={windowed.value}
        label="The 20-line editor"
        extensions={windowed.extensions}
        data-editor="windowed"
      />
      {#if mirror}
        {#key windowed.value + windowed.language}
          <CodeBlock.Root
            data-mirror="windowed"
            class="h-[calc(20lh+1.5rem)] text-sm"
            aria-label="The 20-line editor's text"
          >
            <CodeBlock.Content
              code={windowed.value}
              language={windowed.language}
            />
          </CodeBlock.Root>
        {/key}
      {/if}
    </div>
    <CodeEditor
      bind:this={bare}
      value={"first\nlast"}
      label="The editor with no setup"
      data-editor="bare"
    />
  </section>

  <section aria-labelledby="specimens" class="grid gap-6">
    <h2 id="specimens" class="text-lg">The specimens</h2>
    {#each SPECIMENS as specimen (specimen.id)}
      <CodeBlock.Root data-specimen={specimen.id} aria-label={specimen.title}>
        <CodeBlock.Content code={specimen.code} language={specimen.language} />
      </CodeBlock.Root>
    {/each}
  </section>
</div>
