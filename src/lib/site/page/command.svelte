<script lang="ts">
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { cn } from "#lib/utils";

  let {
    code,
    lines,
    label,
    mdLabel,
    class: className,
  }: {
    /** The command, exactly as copied. */
    code: string;
    /** Its tokens, highlighted at prerender, so the page loads no highlighter. */
    lines: HighlightedLine[] | null | undefined;
    /** The code's name, for the scrolling region. */
    label: string;
    /** A line the Markdown twin writes before the command, where the page shows it some other way. */
    mdLabel?: string;
    class?: string;
  } = $props();
</script>

<!--
  A command: the code block with its copy button first, then the command,
  soft-wrapped so every word of it shows at every width. The copied text is
  the command exactly; a break may fall anywhere in the address.
-->
<CodeBlock.Root class={cn("block", className)} data-md-label={mdLabel}>
  <CodeBlock.Actions class="absolute end-1.5 top-1.5">
    <CodeBlock.CopyButton {code} />
  </CodeBlock.Actions>
  <CodeBlock.Content
    lines={lines ?? undefined}
    code={lines ? undefined : code}
    wrap
    role="region"
    aria-label={label}
    data-language="bash"
    class="pe-12 wrap-anywhere"
  />
</CodeBlock.Root>
