<script lang="ts" module>
  export const meta = {
    title: "The mark",
    intro:
      "Four dots in the brand's order, sized by the text around them. In the dark theme they turn paper-white on product screens; an expressive page shows the lifted four.",
  };
</script>

<script lang="ts">
  import { FourDot } from "#lib/registry/ui/four-dot";

  // Class names are written out so Tailwind finds them in this file.
  const sizes = ["text-xs", "text-sm", "text-base", "text-2xl", "text-5xl"];
</script>

<ul class="flex flex-wrap items-end gap-8">
  {#each sizes as size (size)}
    <li class="flex flex-col items-start gap-2">
      <span class={size}><FourDot /></span>
      <code class="text-xs">{size}</code>
    </li>
  {/each}
</ul>
