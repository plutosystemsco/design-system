<script lang="ts">
  let {
    value,
    label,
    onpick,
  }: {
    /** The theme shown; none until the page knows its own. */
    value: "light" | "dark" | undefined;
    label: string;
    onpick: (theme: "light" | "dark") => void;
  } = $props();

  const OPTIONS = [
    { theme: "light", name: "Light" },
    { theme: "dark", name: "Dark" },
  ] as const;
</script>

<!--
  A frame's own Light | Dark switch: two pressed buttons in a group. Focus
  stays on the one pressed when the frame swaps. Under forced colours the
  pressed one is the page's own pair inverted (022b): every forced palette
  keeps Canvas and CanvasText readable, and Firefox's SelectedItem pair is
  2.94:1. It is not adjusted, or Chromium paints a Canvas backplate behind
  its Canvas label and the label vanishes; so its focus ring is named too,
  else it would take the theme's ring (and Firefox's was white on white).
-->
<div
  role="group"
  aria-label={label}
  data-md="skip"
  class="inline-flex shrink-0 rounded border border-border"
>
  {#each OPTIONS as o (o.theme)}
    <button
      type="button"
      aria-pressed={value === undefined ? undefined : value === o.theme}
      onclick={() => onpick(o.theme)}
      class="h-8 min-w-12 px-3 text-sm font-medium text-muted-foreground transition-colors first:rounded-s last:rounded-e hover:bg-accent hover:text-accent-foreground aria-pressed:bg-foreground aria-pressed:text-background forced-colors:aria-pressed:bg-[CanvasText] forced-colors:aria-pressed:text-[Canvas] forced-colors:aria-pressed:forced-color-adjust-none forced-colors:aria-pressed:focus-visible:outline-[CanvasText]"
      >{o.name}</button
    >
  {/each}
</div>
