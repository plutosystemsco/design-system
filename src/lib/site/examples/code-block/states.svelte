<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Plain code with no language renders as one text node, which streams cheaply. The small size is for a chat message. A wrapped block breaks its long lines instead of scrolling. A footer says what the block holds.",
  };
</script>

<script lang="ts">
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";

  // The lines come from a load function that calls highlightCode.
  let {
    data,
  }: {
    data: {
      terminal: HighlightedLine[] | null;
      long: HighlightedLine[] | null;
      code: { terminal: string };
    };
  } = $props();

  const output = `5 3 4 6 7 8 9 1 2
6 7 2 1 9 5 3 4 8
1 9 8 3 4 2 5 6 7`;
</script>

<div class="grid max-w-2xl gap-8">
  <CodeBlock.Root>
    <CodeBlock.Content
      code={output}
      role="region"
      aria-label="Output, with no header"
    />
  </CodeBlock.Root>

  <CodeBlock.Root size="sm">
    <CodeBlock.Header>
      <CodeBlock.Title>Terminal</CodeBlock.Title>
      <CodeBlock.Actions>
        <CodeBlock.CopyButton code={data.code.terminal} />
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content
      lines={data.terminal ?? undefined}
      role="region"
      aria-label="Terminal, small"
    />
  </CodeBlock.Root>

  <CodeBlock.Root>
    <CodeBlock.Content
      lines={data.long ?? undefined}
      wrap
      role="region"
      aria-label="A long line, wrapped"
    />
  </CodeBlock.Root>

  <CodeBlock.Root>
    <CodeBlock.Content
      lines={data.terminal ?? undefined}
      role="region"
      aria-label="Terminal, with a footer"
    />
    <CodeBlock.Footer>2 lines of bash</CodeBlock.Footer>
  </CodeBlock.Root>
</div>
