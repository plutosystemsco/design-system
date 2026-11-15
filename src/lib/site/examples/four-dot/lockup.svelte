<script lang="ts" module>
  export const meta = {
    title: "The lockup",
    intro:
      "The word with the mark risen beside it, sized by the text around it. Given an href it is a link named Pluto Systems; the mark alone in a link takes a label.",
  };
</script>

<script lang="ts">
  import { FourDot, Lockup } from "#lib/registry/ui/four-dot";

  // Class names are written out so Tailwind finds them in this file.
  const sizes = ["text-base", "text-2xl", "text-5xl"];
</script>

<div class="flex flex-wrap items-end gap-8">
  <div class="flex flex-col items-start gap-2">
    <Lockup href="/" class="text-2xl" data-testid="lockup-link" />
    <span class="text-xs text-muted-foreground">As a link</span>
  </div>
  <div class="flex flex-col items-start gap-2">
    <span class="text-2xl">
      <a href="/components/four-dot/" data-testid="mark-link"
        ><FourDot label="Pluto Systems" data-testid="labelled" /></a
      >
    </span>
    <span class="text-xs text-muted-foreground">The mark alone, in a link</span>
  </div>
</div>
<ul class="mt-8 flex flex-col items-start gap-8">
  {#each sizes as size (size)}
    <li class="flex flex-col items-start gap-2">
      <Lockup class={size} />
      <code class="text-xs">{size}</code>
    </li>
  {/each}
</ul>
