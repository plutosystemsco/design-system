<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import BlockViewer from "./block-viewer.svelte";
  import { COMPOSITION_VIEWS, COMPOSITIONS_ROOT } from "./blocks";
  import ItemHeader from "./item-header.svelte";
  import PreviewSection from "./preview-section.svelte";

  /**
   * A composition's item page (010 decision 10): the header, Preview (its
   * views in the viewer's frame, since a full-bleed stage, a sticky bar and
   * an h1 cannot sit inside this page's column), Usage and Accessibility.
   */
  let {
    name,
    usage,
    accessibility,
  }: { name: string; usage: Snippet; accessibility: Snippet } = $props();

  const title = $derived(
    (page.data.registry as Record<string, { title: string }> | undefined)?.[
      name
    ]?.title ?? name,
  );
</script>

<ItemHeader {name} />

<PreviewSection
  id="preview"
  title="Preview"
  intro="The composition in a view of its own, at a phone, tablet or desktop width, in the site's theme. It is expressive only: it belongs on a home page or a launch, not in an app's screens. Open alone shows the view at any width."
>
  <BlockViewer
    block={COMPOSITIONS_ROOT}
    {title}
    views={COMPOSITION_VIEWS[name] ?? []}
  />
</PreviewSection>

<PreviewSection id="usage" title="Usage">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    {@render usage()}
  </ul>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    {@render accessibility()}
  </ul>
</PreviewSection>
