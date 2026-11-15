<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A line in a conversation that is not a turn: a note, a divider, a status. Three shapes: plain, a separator with the hairline either side, and a line underlined by the hairline.",
  };
</script>

<script lang="ts">
  import Info from "phosphor-svelte/lib/Info";
  import * as Marker from "#lib/registry/ui/marker";
</script>

<div class="grid max-w-2xl gap-8">
  <Marker.Root data-testid="marker-default">
    <Marker.Icon><Info /></Marker.Icon>
    <Marker.Content
      >Stopped: out of fuel after 30 billion instructions.</Marker.Content
    >
  </Marker.Root>
  <Marker.Root variant="separator" data-testid="marker-separator">
    <Marker.Content>Earlier today</Marker.Content>
  </Marker.Root>
  <Marker.Root variant="border" data-testid="marker-border">
    <Marker.Content>Context from three files was added.</Marker.Content>
  </Marker.Root>
</div>
