<script lang="ts">
  import { PROOF } from "#lib/preview/composition-samples";
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Button } from "#lib/registry/ui/button";
  import { ProofBand } from "#lib/registry/ui/proof-band";

  // New items after mount: the digits follow them (change review finding 3).
  let reversed = $state(false);
  const items = $derived(reversed ? [...PROOF].reverse() : PROOF);
</script>

<!-- In view at load, so it shows its final values and does not count (010 decision 6). -->
<CompositionView title="Proof band" padded>
  <h1 class="sr-only">Proof band</h1>
  <ProofBand title="One layer under every app" {items} />
  <Button
    variant="secondary"
    size="sm"
    class="mt-12"
    aria-pressed={reversed}
    onclick={() => (reversed = !reversed)}>Reverse the order</Button
  >
</CompositionView>
