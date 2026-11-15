<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "A marker with the spinner says a reply is being written; the words are the status item's, visible beside it or hidden, present from the first render so the change is announced.",
  };
</script>

<script lang="ts">
  import * as Marker from "#lib/registry/ui/marker";
  import { Spinner } from "#lib/registry/ui/spinner";
  import { Status } from "#lib/registry/ui/status";
</script>

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
