<!--
  027 decision 15: a filled field with its count. Escape in the input, which
  clears it, is the main interaction.
-->
<script lang="ts">
  import { SearchField } from "#lib/components/ui/search-field";

  let value = $state("design");
</script>

<SearchField
  data-cost="target"
  aria-label="Search projects"
  bind:value
  results="3 results"
/>
