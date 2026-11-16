<!--
  027 decision 15: button mode, page 5 of 12. A press of Next is the main
  interaction; onpagechange writes the new page to the state.
-->
<script lang="ts">
  import { Pagination } from "#lib/components/ui/pagination";

  let shown = $state(5);
</script>

<Pagination page={5} pages={12} onpagechange={(page) => (shown = page)} />
<output data-cost="state">{shown}</output>
