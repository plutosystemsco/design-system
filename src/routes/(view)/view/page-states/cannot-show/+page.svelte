<script lang="ts">
  import PageStatesError from "#lib/registry/components/page-states-error.svelte";
</script>

<svelte:head><title>This page cannot be shown</title></svelte:head>

<div class="mx-auto max-w-5xl px-6 py-16 sm:py-24">
  <PageStatesError status={403} />
</div>
