<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextUnderline from "phosphor-svelte/lib/TextUnderline";
  import * as ToggleGroup from "#lib/registry/ui/toggle-group";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  // The /admin page's time-range presets.
  const ranges = [
    ["today", "Today"],
    ["7d", "7 days"],
    ["30d", "30 days"],
    ["90d", "90 days"],
  ] as const;
</script>

<ItemHeader name="toggle-group" />

{#snippet presets(
  testid: string | undefined,
  variant: "default" | "outline",
  size: "default" | "sm",
  value: "today" | "7d" = "7d",
)}
  <ToggleGroup.Root
    type="single"
    {value}
    aria-label="Time range"
    data-testid={testid}
    {variant}
    {size}
  >
    {#each ranges as [value, label] (value)}
      <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
    {/each}
  </ToggleGroup.Root>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A row of joined toggles. Single picks one, as a time-range strip does; multiple picks several, as text styles do. The selected item is inverted."
>
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="single · time range">
      {@render presets("toggle-group-single", "default", "default")}
    </Specimen>
    <Specimen caption="multiple · icons with labels">
      <ToggleGroup.Root
        type="multiple"
        value={["bold"]}
        aria-label="Text style"
      >
        <ToggleGroup.Item value="bold" aria-label="Bold"
          ><TextB aria-hidden="true" /></ToggleGroup.Item
        >
        <ToggleGroup.Item value="italic" aria-label="Italic"
          ><TextItalic aria-hidden="true" /></ToggleGroup.Item
        >
        <ToggleGroup.Item value="underline" aria-label="Underline"
          ><TextUnderline aria-hidden="true" /></ToggleGroup.Item
        >
      </ToggleGroup.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="outline">
      {@render presets(undefined, "outline", "default")}
    </Specimen>
    <Specimen caption="sm">
      {@render presets(undefined, "default", "sm")}
    </Specimen>
    <Specimen caption="sm · outline">
      {@render presets(undefined, "outline", "sm")}
    </Specimen>
    <Specimen caption="vertical">
      <ToggleGroup.Root
        type="single"
        value="7d"
        orientation="vertical"
        variant="outline"
        aria-label="Time range"
      >
        {#each ranges as [value, label] (value)}
          <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
    </Specimen>
    <Specimen caption="disabled">
      <ToggleGroup.Root
        type="single"
        value="7d"
        disabled
        variant="outline"
        aria-label="Time range"
      >
        {#each ranges as [value, label] (value)}
          <ToggleGroup.Item {value}>{label}</ToggleGroup.Item>
        {/each}
      </ToggleGroup.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The row is a <code>group</code>; give it an <code>aria-label</code>. In
      single mode the items are radios with <code>aria-checked</code>; in
      multiple mode they are buttons with <code>aria-pressed</code>.
    </li>
    <li>
      One Tab stop for the row. The arrow keys, Home and End move focus without
      selecting; Space or Enter selects. Browse, then apply: a preset strip that
      selected on arrow would fire a query per key press.
    </li>
    <li>
      The selected item is inverted, never a faint tint. Icon-only items need an <code
        >aria-label</code
      > each.
    </li>
    <li>
      Items join; there is no spacing prop. For separate toggles, put
      <code>Toggle</code>s in a flex row.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the checked item, which here is the first. The row's Tab stop starts on its first item and follows the selection from then on. ArrowRight moves focus to the next without checking it; Space then checks it."
>
  <div data-testid="keyboard-fixture">
    {@render presets(undefined, "default", "default", "today")}
  </div>
</PreviewSection>
