<script lang="ts">
  import { tokenClasses } from "#lib/registry/lib/highlighter";
  import GrowingCode from "#lib/preview/growing-code.svelte";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // The twelve slots as swatches. The class names are written out so Tailwind
  // finds them in this file.
  const slots: [slot: string, semantic: string, swatch: string][] = [
    ["foreground", "foreground", "bg-code-foreground"],
    ["background", "muted", "bg-code-background"],
    ["keyword", "primary", "bg-code-keyword"],
    ["string", "success", "bg-code-string"],
    ["constant", "foreground", "bg-code-constant"],
    ["function", "foreground", "bg-code-function"],
    ["comment", "muted-foreground", "bg-code-comment"],
    ["link", "primary", "bg-code-link"],
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
  intro="One theme, thirty lines, whose every colour is a code token. On the server, highlightCode returns plain data for a load function. In the browser, loadHighlighter tokenises line by line as code streams. Nothing here moves until you press Start."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen
      caption="in the browser · Python, loaded on first use"
      class="w-full"
    >
      <GrowingCode code={sample} language="python" />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="The twelve slots, each a semantic colour, so the theme switch carries through. A token renders as the slot's text class; a token in the foreground slot carries no class at all."
>
  <div class="grid gap-8">
    <Specimen caption="the twelve --code-* slots" class="w-full">
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
    <Specimen caption="the class table · tokenClass(token)" class="w-full">
      <table class="w-full max-w-md text-sm">
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
      Every text slot passes 4.5:1 on the muted code ground in both themes:
      keywords are <code>primary</code>, strings <code>success</code>, comments
      <code>muted-foreground</code>, deletions <code>destructive</code>;
      numbers, constants, names and operators are the body's colour.
    </li>
    <li>
      A function or type name is told by weight, not colour: the theme marks it
      bold and it renders as <code>font-medium</code>. JetBrains Mono is
      monospaced across weights, so columns hold. No italic: only the upright
      face is installed.
    </li>
    <li>
      Colour is never the only sign in a diff: an added or removed line also
      carries its <code>+</code> or <code>−</code> marker and the opaque card step.
    </li>
    <li>
      Call <code>highlightCode</code> in a <code>load</code> function for static code:
      the page then holds the tokens and ships no Shiki. Load it in the browser only
      where code streams.
    </li>
  </ul>
</PreviewSection>
