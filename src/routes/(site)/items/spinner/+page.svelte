<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Spinner } from "#lib/registry/ui/spinner";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="spinner" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One spinner, sized by the text around it. It turns only on the one control that is busy, and stops after one turn under reduced motion."
>
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="decorative · text-base">
      <span class="text-base"><Spinner /></span>
    </Specimen>
    <Specimen caption="decorative · text-2xl">
      <span class="text-2xl"><Spinner class="size-6" /></span>
    </Specimen>
    <Specimen caption="labelled">
      <span class="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner label="Loading runs" />
      </span>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="flex flex-wrap items-end gap-6">
    <Specimen caption="inside a busy button">
      <Button busy>Signing in…</Button>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      Decorative by default: <code>aria-hidden="true"</code>, because the busy
      control around it has its own name.
    </li>
    <li>
      With <code>label</code>, it renders a <code>role="status"</code> region holding
      the label as visually hidden text, announced when the spinner is inserted.
    </li>
    <li>It colours itself with the text around it.</li>
  </ul>
</PreviewSection>
