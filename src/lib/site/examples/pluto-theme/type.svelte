<script lang="ts" module>
  export const meta = {
    title: "Type",
    intro:
      "The type scale, each step in the face and tracking it is set in, with its size and line height.",
  };
</script>

<script lang="ts">
  import type { ThemeData } from "./data.server";

  let { data }: { data: ThemeData } = $props();

  // Class names are written out so Tailwind finds them in this file.
  const sizes: Record<string, { cls: string; font: string }> = {
    xs: {
      cls: "text-xs",
      font: "font-mono font-medium lowercase tracking-eyebrow",
    },
    sm: { cls: "text-sm", font: "font-mono" },
    base: { cls: "text-base", font: "font-sans" },
    "2xl": { cls: "text-2xl", font: "font-heading font-bold tracking-section" },
    "5xl": { cls: "text-5xl", font: "font-heading font-bold tracking-display" },
  };
</script>

<ul class="grid gap-6">
  {#each data.scale as step (step.step)}
    <li class="groove pt-3">
      <p class="font-mono text-xs text-muted-foreground">
        text-{step.step}, {step.px} px on a line of {step.lineHeight}
      </p>
      <p
        data-token="text-{step.step}"
        class="mt-1 {sizes[step.step].cls} {sizes[step.step].font}"
      >
        Pluto Systems
      </p>
    </li>
  {/each}
</ul>
<p class="mt-6 text-sm text-muted-foreground">
  Tracking: display {data.tracking.display} em, section {data.tracking.section}
  em, eyebrow {data.tracking.eyebrow} em, mark {data.tracking.mark} em.
</p>
