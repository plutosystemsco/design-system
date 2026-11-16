<script lang="ts">
  import { onMount } from "svelte";
  import { readToken } from "#lib/read-token";

  let colour = $state("");
  onMount(() => (colour = readToken("primary")));
</script>

<p>{colour}</p>
