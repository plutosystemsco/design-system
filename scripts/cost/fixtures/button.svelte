<script lang="ts">
  import { Button } from "#lib/components/ui/button";

  let clicks = $state(0);
</script>

<Button data-cost="target" onclick={() => clicks++}>Save</Button>
<output data-cost="state">{clicks}</output>
