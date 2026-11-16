<script lang="ts">
  import { Composer } from "#lib/components/ui/composer";

  let sent = $state(0);
</script>

<Composer onsend={() => sent++} />
<output data-cost="state">{sent}</output>
