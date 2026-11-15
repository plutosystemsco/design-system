<script lang="ts" module>
  export const meta = {
    title: "Inline code",
    intro:
      "A code element in running text is a chip on the code ground, edged by the hairline. In a heading it keeps the mono face and the heading's colour, size and weight, with no chip.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
</script>

<p class="max-w-prose text-sm" data-testid="inline-p">
  A <code>code</code> element in running text, not inside a <code>pre</code>, is
  a chip on the code ground, edged by the hairline, as a block is: the case
  radius, 4 px of side padding and none above or below, so the line keeps its
  height. A long token such as
  <code>bunx --bun shadcn-svelte@1.7.1 add code-block code-editor -y</code>
  wraps, and each piece keeps its edge. Inside a link the chip takes the link's colour,
  as in
  <a
    href="#inline-code"
    class="text-primary underline underline-offset-4"
    data-testid="inline-link">the <code>scrollbar-code</code> utility</a
  >. A class an item sets on its own <code>code</code> wins.
</p>
<h4 class="mt-6 text-base font-bold" data-testid="inline-h3">
  No chip in a heading:
  <code>code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)</code>
</h4>
<p class="mt-2 max-w-prose text-sm text-muted-foreground">
  A chip would stand taller than a heading's tight line.
</p>
<div class="mt-6 grid max-w-prose gap-2">
  <p class="text-xs" data-testid="inline-line-xs">
    Run <code>bun test</code> in text-xs.
  </p>
  <p class="text-xs" data-testid="inline-twin-xs">
    Run <span class="font-mono">bun test</span> in text-xs.
  </p>
  <p class="text-sm" data-testid="inline-line-sm">
    Run <code>bun test</code> in text-sm.
  </p>
  <p class="text-sm" data-testid="inline-twin-sm">
    Run <span class="font-mono">bun test</span> in text-sm.
  </p>
  <p class="text-base" data-testid="inline-line-base">
    Run <code>bun test</code> in text-base.
  </p>
  <p class="text-base" data-testid="inline-twin-base">
    Run <span class="font-mono">bun test</span> in text-base.
  </p>
</div>
<Card.Root class="mt-6 max-w-prose">
  <Card.Content>
    <p class="text-sm" data-testid="inline-card">
      On a card the chip is white on white in light mode, told by its hairline:
      <code>--code-background</code>.
    </p>
  </Card.Content>
</Card.Root>
