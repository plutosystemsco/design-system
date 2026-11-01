<script lang="ts">
  import { tokenClasses } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import GrowingCode from "#lib/preview/growing-code.svelte";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // The twenty-one slots as swatches, in the token file's order. The class
  // names are written out so Tailwind finds them in this file.
  const slots: [slot: string, semantic: string, swatch: string][] = [
    ["foreground", "foreground", "bg-code-foreground"],
    ["background", "muted", "bg-code-background"],
    ["comment", "muted-foreground", "bg-code-comment"],
    ["keyword", "primary", "bg-code-keyword"],
    ["constant", "primary", "bg-code-constant"],
    ["string", "success", "bg-code-string"],
    ["number", "syntax-orange", "bg-code-number"],
    ["escape", "syntax-orange", "bg-code-escape"],
    ["function", "syntax-amber", "bg-code-function"],
    ["builtin", "syntax-purple", "bg-code-builtin"],
    ["type", "syntax-teal", "bg-code-type"],
    ["tag", "syntax-teal", "bg-code-tag"],
    ["property", "syntax-cyan", "bg-code-property"],
    ["decorator", "syntax-purple", "bg-code-decorator"],
    ["self", "syntax-purple", "bg-code-self"],
    ["link", "primary", "bg-code-link"],
    ["invalid", "destructive", "bg-code-invalid"],
    ["inserted", "success", "bg-code-inserted"],
    ["deleted", "destructive", "bg-code-deleted"],
    ["changed", "primary", "bg-code-changed"],
    ["active-line", "card", "bg-code-active-line"],
  ];

  const table = Object.entries(tokenClasses).map(([colour, cls]) => ({
    slot: colour.replace(/^var\(--code-(.*)\)$/, "$1"),
    cls,
  }));

  const sample = `import numpy as np

def mean(values: list[float]) -> float:
    """The arithmetic mean."""
    total = sum(values)  # no numpy needed here
    return total / len(values)

print(mean([1.5, 2.5, 3.5]), np.__version__)`;
</script>

<ItemHeader name="highlighter" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One theme, about thirty rules, whose every colour is a code token. On the server, highlightCode returns plain data for a load function. In the browser, loadHighlighter tokenises line by line as code streams. Nothing here moves until you press Start."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen
      caption="in the browser, Python loaded on first use"
      class="w-full"
    >
      <GrowingCode code={sample} language="python" />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="languages"
  title="Twenty-six languages"
  intro="Every slot is a role that holds in any language: a type name, a key, a decorator. One theme colours every grammar the highlighter lists. Each sample below was highlighted when this page was built, with the strict engine, and shipped no highlighter."
>
  <div class="grid gap-8 lg:grid-cols-2" data-testid="gallery">
    {#each data.gallery as sample (sample.language)}
      <Specimen caption={sample.language} class="w-full min-w-0">
        <CodeBlock.Root data-language={sample.language}>
          <CodeBlock.Header>
            <CodeBlock.Title>{sample.title}</CodeBlock.Title>
          </CodeBlock.Header>
          <CodeBlock.Content lines={sample.lines} />
        </CodeBlock.Root>
      </Specimen>
    {/each}
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="The twenty-one slots, each a semantic colour, so the theme switch carries through. A token renders as the slot's text class; a token in the foreground slot carries no class at all."
>
  <div class="grid gap-8">
    <Specimen caption="the twenty-one --code-* slots" class="w-full">
      <ul class="grid w-full gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each slots as [slot, semantic, swatch] (slot)}
          <li class="flex items-center gap-3">
            <span
              aria-hidden="true"
              class="size-8 shrink-0 rounded border border-input {swatch}"
            ></span>
            <span class="flex flex-col">
              <code class="text-sm">--code-{slot}</code>
              <span class="font-mono text-xs text-muted-foreground"
                >var(--{semantic})</span
              >
            </span>
          </li>
        {/each}
      </ul>
    </Specimen>
    <Specimen caption="the class table, tokenClass(token)" class="w-full">
      <table class="w-full max-w-md text-sm" data-testid="slot-table">
        <thead>
          <tr class="text-start text-muted-foreground">
            <th scope="col" class="py-2 text-start font-medium">slot</th>
            <th scope="col" class="py-2 text-start font-medium">class</th>
          </tr>
        </thead>
        <tbody>
          <tr class="groove">
            <td class="py-2"><code>foreground</code></td>
            <td class="py-2 text-muted-foreground">none</td>
          </tr>
          {#each table as row (row.slot)}
            <tr class="groove">
              <td class="py-2"><code>{row.slot}</code></td>
              <td class="py-2"><code>{row.cls}</code></td>
            </tr>
          {/each}
          <tr class="groove">
            <td class="py-2">bold</td>
            <td class="py-2"><code>font-medium</code></td>
          </tr>
          <tr class="groove">
            <td class="py-2">underline</td>
            <td class="py-2"><code>underline</code></td>
          </tr>
        </tbody>
      </table>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      Every text slot passes 4.5:1 on all six code grounds in both themes:
      keywords and constants are <code>primary</code>, strings
      <code>success</code>, comments <code>muted-foreground</code>, invalid text
      and deletions <code>destructive</code>; numbers and escapes, functions,
      built-ins, types and keys take the five syntax colours, each derived to
      the same lightness target as the brand's text colours. Names, parameters,
      operators and brackets are the body's colour.
    </li>
    <li>
      A definition is told by weight as well as colour: the theme marks it bold
      and it renders as <code>font-medium</code>; a call takes the colour alone.
      JetBrains Mono is monospaced across weights, so columns hold. No italic:
      only the upright face is installed.
    </li>
    <li>
      Colour is never the only sign in a diff: an added or removed line also
      carries its <code>+</code> or <code>−</code> marker and the opaque card step.
    </li>
    <li>
      Call <code>highlightCode</code> in a <code>load</code> function for static code:
      the page then holds the tokens and ships no Shiki. Load it in the browser only
      where code streams. The engine is strict: every one of the twenty-six grammars
      compiles under it, so a grammar that did not would fail the build, not a page.
    </li>
  </ul>
</PreviewSection>
