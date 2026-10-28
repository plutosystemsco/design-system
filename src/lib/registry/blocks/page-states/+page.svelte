<script lang="ts">
  import PageStatesMessage from "#lib/registry/components/page-states-message.svelte";
  import { Button } from "#lib/registry/ui/button";
  import FolderSimple from "phosphor-svelte/lib/FolderSimple";
</script>

<svelte:head><title>Projects</title></svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16 sm:py-24">
  <h1
    class="font-heading text-2xl font-bold tracking-section text-foreground sm:text-5xl sm:tracking-display"
  >
    Projects
  </h1>
  <div class="rounded border border-border bg-card p-6 sm:p-12">
    <PageStatesMessage
      align="center"
      level={2}
      title="No projects yet"
      description="When you create a project, it appears here."
    >
      {#snippet icon()}
        <FolderSimple aria-hidden="true" />
      {/snippet}
      {#snippet action()}
        <!-- Your app's one action goes here. -->
        <Button>Create a project</Button>
      {/snippet}
    </PageStatesMessage>
  </div>
</div>
