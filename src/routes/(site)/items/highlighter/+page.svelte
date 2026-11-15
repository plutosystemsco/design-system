<script lang="ts">
  import { CODE_ROLES, roleClasses } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import GrowingCode from "#lib/preview/growing-code.svelte";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // The code map's sixteen entries as swatches, in the token file's order:
  // fourteen text roles and the two grounds. The class names are written out
  // so Tailwind finds them in this file.
  const roles: [role: string, semantic: string, swatch: string][] = [
    ["text", "syntax-ink", "bg-code-text"],
    ["comment", "syntax-grey", "bg-code-comment"],
    ["keyword", "syntax-violet", "bg-code-keyword"],
    ["function", "syntax-blue", "bg-code-function"],
    ["type", "syntax-navy", "bg-code-type"],
    ["string", "syntax-green", "bg-code-string"],
    ["number", "syntax-yellow", "bg-code-number"],
    ["constant", "syntax-orange", "bg-code-constant"],
    ["meta", "syntax-plum", "bg-code-meta"],
    ["special", "syntax-red", "bg-code-special"],
    ["link", "syntax-blue", "bg-code-link"],
    ["inserted", "syntax-green", "bg-code-inserted"],
    ["deleted", "syntax-red", "bg-code-deleted"],
    ["changed", "syntax-blue", "bg-code-changed"],
    ["background", "syntax-ground", "bg-code-background"],
    ["active-line", "syntax-active-line", "bg-code-active-line"],
  ];

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
  intro="One engine labels code: tree-sitter parses it and this system's own queries name each node's role. On the server, highlightCode returns plain data for a load function. In the browser, a session re-parses only what changed as code streams. Nothing here moves until you press Start."
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
  intro="Twenty-one languages parse with a tree-sitter grammar and our queries; Markdown, diff, SQL, Swift and Dockerfile highlight with Shiki, which also stands behind every other language. Each sample below was highlighted when this page was built and shipped no engine."
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
  intro="Meridian's roles: colour carries meaning, not syntax. Fourteen text roles and the two grounds, each a semantic colour, so the theme switch carries through. A token renders as its role's class; a token in the body carries no class at all."
>
  <div class="grid gap-8">
    <Specimen caption="the sixteen --code-* roles" class="w-full">
      <ul class="grid w-full gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {#each roles as [role, semantic, swatch] (role)}
          <li class="flex items-center gap-3">
            <span
              aria-hidden="true"
              class="size-8 shrink-0 rounded border border-input {swatch}"
            ></span>
            <span class="flex flex-col">
              <code class="text-sm">--code-{role}</code>
              <span class="font-mono text-xs text-muted-foreground"
                >var(--{semantic})</span
              >
            </span>
          </li>
        {/each}
      </ul>
    </Specimen>
    <Specimen caption="the role table, tokenClass(role)" class="w-full">
      <table class="w-full max-w-md text-sm" data-testid="role-table">
        <thead>
          <tr class="text-start text-muted-foreground">
            <th scope="col" class="py-2 text-start font-medium">role</th>
            <th scope="col" class="py-2 text-start font-medium">class</th>
          </tr>
        </thead>
        <tbody>
          {#each CODE_ROLES as role (role)}
            <tr class="groove">
              <td class="py-2"><code>{role}</code></td>
              <td class="py-2">
                {#if roleClasses[role]}<code>{roleClasses[role]}</code
                  >{:else}<span class="text-muted-foreground">none</span>{/if}
              </td>
            </tr>
          {/each}
          <tr class="groove">
            <td class="py-2"><code>background</code></td>
            <td class="py-2"><code>bg-code-background</code></td>
          </tr>
          <tr class="groove">
            <td class="py-2"><code>active-line</code></td>
            <td class="py-2"><code>bg-code-active-line</code></td>
          </tr>
        </tbody>
      </table>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      Every text role reads 4.5:1 or more on every code ground and the active
      line in both themes, comments included. Dark colours sit between 6.5:1 and
      9.5:1 on the dark code ground; the dark number reads higher, 10.41:1 on
      the active line and 11.66:1 inside an ink surface.
    </li>
    <li>
      No token is bold or italic: comments recede by colour alone, grey among
      eight hues. A link is underlined, the one style in the palette.
    </li>
    <li>
      For a reader with protanopia, light-mode numbers and constants are one
      colour. Numbers are digits and constants are words (<code>3</code>,
      <code>0x2A</code> against <code>True</code>, <code>None</code>), so their
      shape tells them apart.
    </li>
    <li>
      Colour is never the only sign in a diff: an added or removed line also
      carries its <code>+</code> or <code>−</code> marker and the active line.
    </li>
    <li>
      Call <code>highlightCode</code> in a <code>load</code> function for static code:
      the page then holds the tokens and fetches no engine. A block highlighted in
      the browser fetches the tree-sitter runtime (about 115 kB gzipped) and each
      grammar it shows, once; an HTML block also loads JavaScript and CSS, a Svelte
      block TypeScript and CSS. Every client build carries all twenty grammar files
      and the runtime, about 23.5 MB raw (2.15 MB gzipped).
    </li>
    <li>
      A strict Content Security Policy needs <code>'wasm-unsafe-eval'</code>:
      the runtime compiles WebAssembly.
    </li>
  </ul>
</PreviewSection>
