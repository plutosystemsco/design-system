<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import { Toggle } from "#lib/registry/ui/toggle";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="toggle" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A two-state button. Default is transparent until hovered; outline carries the input hairline. Pressed is inverted, ink on paper, so the state reads at a glance."
>
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="default">
      <Toggle data-testid="height-toggle"
        ><TextB aria-hidden="true" />Bold</Toggle
      >
    </Specimen>
    <Specimen caption="outline">
      <Toggle variant="outline"><TextItalic aria-hidden="true" />Italic</Toggle>
    </Specimen>
    <Specimen caption="sm">
      <Toggle size="sm" data-testid="height-toggle-sm"
        ><TextB aria-hidden="true" />Bold</Toggle
      >
    </Specimen>
    <Specimen caption="sm · outline">
      <Toggle size="sm" variant="outline"
        ><TextItalic aria-hidden="true" />Italic</Toggle
      >
    </Specimen>
    <Specimen caption="icon only · aria-label">
      <Toggle aria-label="Bold"><TextB aria-hidden="true" /></Toggle>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="pressed">
      <Toggle pressed data-testid="toggle-pressed"
        ><TextB aria-hidden="true" />Bold</Toggle
      >
    </Specimen>
    <Specimen caption="not pressed">
      <Toggle data-testid="toggle-unpressed"
        ><TextB aria-hidden="true" />Bold</Toggle
      >
    </Specimen>
    <Specimen caption="pressed · outline">
      <Toggle pressed variant="outline"
        ><TextItalic aria-hidden="true" />Italic</Toggle
      >
    </Specimen>
    <Specimen caption="disabled">
      <Toggle disabled><TextB aria-hidden="true" />Bold</Toggle>
    </Specimen>
    <Specimen caption="disabled · pressed">
      <Toggle disabled pressed><TextB aria-hidden="true" />Bold</Toggle>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A native button with <code>aria-pressed</code>; Space and Enter flip it.
    </li>
    <li>
      Pressed is inverted, not a tint: 16.84:1 against the page, where a muted
      fill would be 1.2:1. The icon or the text carries the meaning; colour only
      confirms the state.
    </li>
    <li>
      An icon-only toggle needs an <code>aria-label</code>; its icon is
      <code>aria-hidden</code>. 48 px tall by default, 32 px at <code>sm</code>,
      never under the 24 px target.
    </li>
    <li>A toggle is never invalid, so it has no invalid style.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops. Space flips the first's aria-pressed."
>
  <div class="flex flex-wrap gap-3" data-testid="keyboard-fixture">
    <Toggle><TextB aria-hidden="true" />Bold</Toggle>
    <Toggle><TextItalic aria-hidden="true" />Italic</Toggle>
  </div>
</PreviewSection>
