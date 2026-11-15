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
  stays on the one pressed when the frame swaps.
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
      class="h-8 min-w-12 px-3 text-sm font-medium text-muted-foreground transition-colors first:rounded-s last:rounded-e hover:bg-accent hover:text-accent-foreground aria-pressed:bg-foreground aria-pressed:text-background forced-colors:aria-pressed:bg-[SelectedItem] forced-colors:aria-pressed:text-[SelectedItemText]"
      >{o.name}</button
    >
  {/each}
</div>
