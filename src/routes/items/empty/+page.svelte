<script lang="ts">
  import FolderOpen from "phosphor-svelte/lib/FolderOpen";
  import { Button } from "#lib/registry/ui/button";
  import * as Empty from "#lib/registry/ui/empty";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
</script>

<ItemHeader name="empty" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="An empty state: an icon tile on the muted inset, a heading, one sentence and the next action."
>
  <Empty.Root class="border border-border">
    <Empty.Header>
      <Empty.Media variant="icon"><FolderOpen aria-hidden="true" /></Empty.Media
      >
      <Empty.Title>No projects yet</Empty.Title>
      <Empty.Description>
        Create a project to run your first build, or <a
          href="/items/empty/#accessibility">read how runs work</a
        >.
      </Empty.Description>
    </Empty.Header>
    <Empty.Content>
      <Button>New project</Button>
    </Empty.Content>
  </Empty.Root>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Empty.Root>
    <Empty.Header>
      <Empty.Title level={3}>Nothing matches</Empty.Title>
      <Empty.Description>Try a shorter search.</Empty.Description>
    </Empty.Header>
  </Empty.Root>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>EmptyTitle</code> renders a heading, <code>h2</code> by default,
      with a <code>level</code> prop, so a page state's title can be its
      <code>h1</code>.
    </li>
    <li>The icon is decorative; the heading says what is empty.</li>
  </ul>
</PreviewSection>
