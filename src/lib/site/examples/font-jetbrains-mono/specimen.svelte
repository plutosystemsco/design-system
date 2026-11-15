<script lang="ts" module>
  export const meta = {
    title: "Specimen",
    intro:
      "JetBrains Mono at the steps it is set at: text-xs and text-sm, the sizes of labels and code.",
  };
</script>

<script lang="ts">
  type Specimen = { step: string; px: number; lineHeight: number };

  let { data }: { data: { specimens: Specimen[] } } = $props();

  // The size classes are written out, so Tailwind finds them.
  const sizes: Record<string, string> = { xs: "text-xs", sm: "text-sm" };
</script>

<ul class="grid gap-8">
  {#each data.specimens as specimen (specimen.step)}
    <li class="groove pt-4">
      <p class="font-mono text-xs text-muted-foreground">
        text-{specimen.step}, {specimen.px} px on a line height of {specimen.lineHeight}
      </p>
      <p class="mt-2 font-mono {sizes[specimen.step]}">
        Sphinx of black quartz, judge my vow. 0123456789
      </p>
    </li>
  {/each}
</ul>
