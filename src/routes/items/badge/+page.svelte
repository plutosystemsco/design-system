<script lang="ts">
  import CheckCircle from "phosphor-svelte/lib/CheckCircle";
  import Warning from "phosphor-svelte/lib/Warning";
  import WarningCircle from "phosphor-svelte/lib/WarningCircle";
  import { Badge } from "#lib/registry/ui/badge";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="badge" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A label, not an action. A state is a border and text in its colour, with no tint, so it reads on a hover row; caution is solid amber with ink text."
>
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="default"><Badge>Queued</Badge></Specimen>
    <Specimen caption="destructive"
      ><Badge variant="destructive">Failed</Badge></Specimen
    >
    <Specimen caption="success"
      ><Badge variant="success">Passed</Badge></Specimen
    >
    <Specimen caption="caution"><Badge variant="caution">Flaky</Badge></Specimen
    >
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="flex flex-wrap items-end gap-8">
    <Specimen caption="destructive · with an icon">
      <Badge variant="destructive"
        ><WarningCircle aria-hidden="true" />Failed</Badge
      >
    </Specimen>
    <Specimen caption="success · with an icon">
      <Badge variant="success"><CheckCircle aria-hidden="true" />Passed</Badge>
    </Specimen>
    <Specimen caption="caution · with an icon">
      <Badge variant="caution"><Warning aria-hidden="true" />Flaky</Badge>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>&lt;span&gt;</code>: its text says the state, never its colour
      alone.
    </li>
    <li>It is never a link: a removable filter is a small secondary button.</li>
  </ul>
</PreviewSection>
