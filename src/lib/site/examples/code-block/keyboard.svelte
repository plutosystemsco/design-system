<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Two stops: the copy button in the header, then the code, whose ring the block draws around itself. Enter on the copy button copies the example and sets the status to “Copied”.",
  };
</script>

<script lang="ts">
  import FileCode from "phosphor-svelte/lib/FileCode";
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";

  // The lines come from a load function that calls highlightCode.
  let {
    data,
  }: {
    data: { python: HighlightedLine[] | null; code: { python: string } };
  } = $props();
</script>

<div data-testid="keyboard-fixture" class="max-w-2xl">
  <CodeBlock.Root>
    <CodeBlock.Header>
      <CodeBlock.Title><FileCode aria-hidden="true" />sudoku.py</CodeBlock.Title
      >
      <CodeBlock.Actions>
        <CodeBlock.CopyButton code={data.code.python} />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content lineNumbers role="region" aria-label="sudoku.py">
      {#each data.python ?? [] as line, index (index)}
        <CodeBlock.Line
          code={line}
          variant={index === 22 ? "highlighted" : "default"}
        />
      {/each}
    </CodeBlock.Content>
    <CodeBlock.Footer>25 lines of Python, line 23 highlighted</CodeBlock.Footer>
  </CodeBlock.Root>
</div>
