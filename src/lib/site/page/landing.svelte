<script module lang="ts">
  import plex from "@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2?url";
  /** The display face's latin file: the band's title is the likely largest paint. */
  export const PLEX = plex;
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Door } from "../doors.ts";
  import { pageTitle } from "../site.ts";
  import Band from "./band.svelte";

  let {
    door,
    title,
    fact,
    sentence,
    glass,
    children,
  }: {
    door: Door;
    title?: Snippet;
    fact?: Snippet;
    sentence: Snippet;
    glass?: Snippet;
    /** The landing's own content and its index, on the canvas. */
    children: Snippet;
  } = $props();
</script>

<svelte:head>
  <title>{pageTitle(door.name)}</title>
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
    href={PLEX}
  />
</svelte:head>

{#snippet name()}{door.name}{/snippet}

<!-- From lg the band spans both columns, and the content takes the page's. -->
<div class="lg:col-span-2 lg:col-start-1 lg:row-start-1">
  <Band {door} title={title ?? name} {fact} {sentence} {glass} />
</div>
<div class="min-w-0 lg:col-start-2 lg:row-start-2 lg:pe-(--site-edge)">
  {@render children()}
</div>
