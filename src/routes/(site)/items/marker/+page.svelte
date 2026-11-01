<script lang="ts">
  import Info from "phosphor-svelte/lib/Info";
  import * as Marker from "#lib/registry/ui/marker";
  import { Spinner } from "#lib/registry/ui/spinner";
  import { Status } from "#lib/registry/ui/status";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="marker" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A line in a conversation that is not a turn: a note, a divider, a status. Three shapes: plain, a separator with the hairline either side, and a line underlined by the hairline."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="default, with an icon" class="w-full">
      <Marker.Root data-testid="marker-default">
        <Marker.Icon><Info /></Marker.Icon>
        <Marker.Content
          >Stopped: out of fuel after 30 billion instructions.</Marker.Content
        >
      </Marker.Root>
    </Specimen>
    <Specimen caption="separator" class="w-full">
      <Marker.Root variant="separator" data-testid="marker-separator">
        <Marker.Content>Earlier today</Marker.Content>
      </Marker.Root>
    </Specimen>
    <Specimen caption="border" class="w-full">
      <Marker.Root variant="border" data-testid="marker-border">
        <Marker.Content>Context from three files was added.</Marker.Content>
      </Marker.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="A marker with the spinner says a reply is being written; the words are the status item's, visible beside it or hidden, present from the first render so the change is announced."
>
  <div class="grid max-w-2xl gap-4">
    <Marker.Root data-testid="marker-status">
      <Marker.Icon><Spinner /></Marker.Icon>
      <Marker.Content>Responding</Marker.Content>
    </Marker.Root>
    <Status
      visible
      text="Responding"
      data-testid="marker-status-region"
      class="text-sm text-muted-foreground"
    />
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      No role by default. A marker inserted with its text is a region created
      with its words, which is not announced; inside a message log it is
      announced as an added node, and the state is told by the status item. Pass
      a role when the marker means one.
    </li>
    <li>The icon is hidden from assistive technology; the text is the line.</li>
    <li>
      No shimmer: a looping gradient is motion with no information. The one
      spinner is the busy sign.
    </li>
  </ul>
</PreviewSection>
