<script lang="ts" module>
  export const meta = {
    title: "Twenty-six languages",
    intro:
      "Twenty-one languages parse with a tree-sitter grammar and our queries; Markdown, diff, SQL, Swift and Dockerfile highlight with Shiki, which also stands behind every other language. Each sample below was highlighted when this page was built and shipped no engine.",
  };
</script>

<script lang="ts">
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";

  // The gallery comes from a load function that calls highlightCode on
  // each sample.
  let {
    data,
  }: {
    data: {
      gallery: { language: string; title: string; lines: HighlightedLine[] }[];
    };
  } = $props();
</script>

<div class="grid gap-8 lg:grid-cols-2" data-testid="gallery">
  {#each data.gallery as sample (sample.language)}
    <CodeBlock.Root data-language={sample.language} class="min-w-0">
      <CodeBlock.Header>
        <CodeBlock.Title>{sample.title}</CodeBlock.Title>
      </CodeBlock.Header>
      <CodeBlock.Content lines={sample.lines} />
    </CodeBlock.Root>
  {/each}
</div>
