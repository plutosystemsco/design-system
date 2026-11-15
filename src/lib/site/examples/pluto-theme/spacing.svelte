<script lang="ts" module>
  export const meta = {
    title: "Spacing",
    intro:
      "A 4 px atom and one ladder of steps. Each square is padded by one step on every side.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  // Class names are written out so Tailwind finds them in this file.
  const padding = [
    "p-1",
    "p-2",
    "p-3",
    "p-4",
    "p-6",
    "p-8",
    "p-12",
    "p-16",
    "p-24",
  ];
</script>

<p class="text-sm text-muted-foreground">
  A {data.spacing.atom} px atom; the ladder is {data.spacing.ladder.join(", ")}.
</p>
<ul class="mt-4 flex flex-wrap items-end gap-6">
  {#each padding as cls, i (cls)}
    <li class="flex flex-col items-start gap-2">
      <span data-token={cls} class="block bg-primary {cls}" aria-hidden="true"
      ></span>
      <code class="text-xs">{cls}, {data.spacing.ladder[i]} px</code>
    </li>
  {/each}
</ul>
