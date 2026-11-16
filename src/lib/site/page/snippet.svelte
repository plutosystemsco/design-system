<script lang="ts">
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { cn } from "#lib/utils";

  let {
    code,
    lines,
    label,
    name,
    language,
    mdLabel,
    step,
    class: className,
  }: {
    /** The code, exactly as copied. */
    code: string;
    /** Its tokens, highlighted at prerender, so the page loads no highlighter. */
    lines: HighlightedLine[] | null | undefined;
    /** The code's title, shown above it, and the scrolling region's name. */
    label: string;
    /** The region's name, when the title alone would repeat another's on the page. */
    name?: string;
    /** The language, for the Markdown twin's fence. */
    language: string;
    /** A line the Markdown twin writes before the code. */
    mdLabel?: string;
    /** What the code is for, for tests that read the page. */
    step?: string;
    class?: string;
  } = $props();
</script>

<!--
  A block of code in a guide or a Foundations page: a header with the code's
  name and its copy button, then the code, in any language. The button sits
  in its own row, so it never covers the code; long lines scroll inside.
-->
<CodeBlock.Root class={cn(className)} data-md-label={mdLabel} data-step={step}>
  <CodeBlock.Header>
    <CodeBlock.Title>{label}</CodeBlock.Title>
    <CodeBlock.Actions>
      <CodeBlock.CopyButton {code} />
    </CodeBlock.Actions>
  </CodeBlock.Header>
  <CodeBlock.Content
    lines={lines ?? undefined}
    code={lines ? undefined : code}
    role="region"
    aria-label={name ?? label}
    data-language={language}
  />
</CodeBlock.Root>
