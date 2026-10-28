<script lang="ts">
  import { page } from "$app/state";
  import PageStatesError, {
    errorTitle,
  } from "#lib/registry/components/page-states-error.svelte";
</script>

<!--
  Here it handles errors thrown by this route only. Move it to
  src/routes/+error.svelte to give every not-found and error page this design.
-->
<svelte:head><title>{errorTitle(page.status)}</title></svelte:head>

<div class="mx-auto max-w-5xl px-6 py-16 sm:py-24">
  <PageStatesError status={page.status} />
</div>
