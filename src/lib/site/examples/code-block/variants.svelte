<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Code on the code ground, white in light mode, edged by the hairline, with the groove between the header and the code. Every colour is a code token, rendered as a class: the install snippet and the diff were highlighted when the page was built, and shipped no highlighter.",
  };
</script>

<script lang="ts">
  import Terminal from "phosphor-svelte/lib/Terminal";
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as Card from "#lib/registry/ui/card";
  import * as CodeBlock from "#lib/registry/ui/code-block";

  // The lines come from a load function that calls highlightCode.
  let {
    data,
  }: {
    data: {
      terminal: HighlightedLine[] | null;
      diff: HighlightedLine[] | null;
      code: { terminal: string };
    };
  } = $props();

  const output = `5 3 4 6 7 8 9 1 2
6 7 2 1 9 5 3 4 8
1 9 8 3 4 2 5 6 7`;

  const traceback = `Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
ZeroDivisionError: division by zero`;
</script>

<div class="grid max-w-2xl gap-8">
  <CodeBlock.Root data-testid="install-snippet">
    <CodeBlock.Header>
      <CodeBlock.Title><Terminal aria-hidden="true" />Terminal</CodeBlock.Title>
      <CodeBlock.Actions>
        <CodeBlock.CopyButton code={data.code.terminal} />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content
      lines={data.terminal ?? undefined}
      role="region"
      aria-label="Terminal"
    />
  </CodeBlock.Root>

  <CodeBlock.Root data-testid="diff-block">
    <CodeBlock.Header>
      <CodeBlock.Title>sudoku.py, 2 changes</CodeBlock.Title>
    </CodeBlock.Header>
    <CodeBlock.Content
      lineNumbers
      role="region"
      aria-label="sudoku.py, 2 changes"
    >
      {#each data.diff ?? [] as line, index (index)}
        <CodeBlock.Line
          code={line}
          variant={index === 2 ? "removed" : index === 3 ? "added" : "default"}
        />
      {/each}
    </CodeBlock.Content>
  </CodeBlock.Root>

  <p class="text-sm text-muted-foreground">
    In a card: white on white, told by the hairline.
  </p>
  <Card.Root class="w-full">
    <Card.Content>
      <CodeBlock.Root data-testid="card-block">
        <CodeBlock.Content code={output} role="region" aria-label="Output" />
      </CodeBlock.Root>
    </Card.Content>
  </Card.Root>

  <CodeBlock.Root variant="destructive">
    <CodeBlock.Header>
      <CodeBlock.Title>Error output</CodeBlock.Title>
    </CodeBlock.Header>
    <CodeBlock.Content
      code={traceback}
      role="region"
      aria-label="Error output"
    />
  </CodeBlock.Root>
</div>
