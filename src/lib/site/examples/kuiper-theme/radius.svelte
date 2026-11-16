<script lang="ts" module>
  export const meta = {
    title: "Radius",
    intro:
      "One case radius for every rounded class, and full round for shapes made from the mark's dots.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  // Class names are written out so Tailwind finds them in this file.
  const radii = [
    "rounded",
    "rounded-xs",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "rounded-4xl",
    "rounded-full",
  ];
</script>

<p class="text-sm text-muted-foreground">
  The case radius is {data.radius} px.
</p>
<ul class="mt-4 flex flex-wrap gap-6">
  {#each radii as cls (cls)}
    <li class="flex flex-col items-start gap-2">
      <span
        data-token={cls}
        class="block size-12 border border-input bg-card {cls}"
        aria-hidden="true"
      ></span>
      <code class="text-xs">{cls}</code>
    </li>
  {/each}
</ul>
