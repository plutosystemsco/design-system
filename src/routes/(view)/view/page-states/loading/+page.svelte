<script lang="ts">
  import PageStatesLoading from "#lib/registry/components/page-states-loading.svelte";
</script>

<svelte:head><title>Projects</title></svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:py-24">
  <h1
    class="font-heading text-2xl font-bold tracking-section text-foreground sm:text-5xl sm:tracking-display"
  >
    Projects
  </h1>
  <div class="rounded border border-border bg-card p-6 sm:p-12">
    <PageStatesLoading loading label="Loading projects">
      <p>Loaded</p>
    </PageStatesLoading>
  </div>
</div>
