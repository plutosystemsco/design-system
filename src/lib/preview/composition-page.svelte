<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import Component from "#lib/site/page/component.svelte";
  import BlockViewer from "./block-viewer.svelte";
  import { COMPOSITION_VIEWS, COMPOSITIONS_ROOT } from "./blocks";

  /**
   * A composition's page: the component template, with its views in the
   * viewer's frame for its examples, since a full-bleed stage, a sticky bar
   * and an h1 cannot sit inside this page's column.
   */
  let {
    name,
    when,
    dos,
    donts,
    accessibility,
  }: {
    name: string;
    when: Snippet;
    dos: Snippet;
    donts: Snippet;
    accessibility: Snippet;
  } = $props();

  const title = $derived(
    (page.data.registry as Record<string, { title: string }> | undefined)?.[
      name
    ]?.title ?? name,
  );
</script>

{#snippet preview()}
  <BlockViewer
    block={COMPOSITIONS_ROOT}
    {title}
    views={COMPOSITION_VIEWS[name] ?? []}
  />
  <p class="mt-3 max-w-(--site-measure) text-sm text-muted-foreground">
    The composition in a view of its own, at a phone, tablet or desktop width,
    in the site's theme. It is expressive only: it belongs on a home page or a
    launch, not in an app's screens. Open alone shows the view at any width.
  </p>
{/snippet}

<Component {name} {preview} {when} {dos} {donts} {accessibility} />
