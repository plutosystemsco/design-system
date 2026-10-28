<script lang="ts">
  import * as Kbd from "#lib/registry/ui/kbd";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="kbd" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A key in the mono face on the muted inset, 20 px high, alone or in a group."
>
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="Kbd"><Kbd.Root>Esc</Kbd.Root></Specimen>
    <Specimen caption="KbdGroup">
      <Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>Enter</Kbd.Root></Kbd.Group>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <p class="text-sm">
    Press <Kbd.Root>/</Kbd.Root> to search, or
    <Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>K</Kbd.Root></Kbd.Group> to open
    the command menu.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>A <code>&lt;kbd&gt;</code> element, read as its text.</li>
    <li>Not interactive: it names a key, it does not press one.</li>
  </ul>
</PreviewSection>
