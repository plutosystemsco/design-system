<script lang="ts">
  import type { Snippet } from "svelte";
  import Breadcrumb from "../chrome/breadcrumb.svelte";
  import { page } from "$app/state";
  import Rail from "../chrome/rail.svelte";
  import type { Door } from "../doors.ts";
  import { pageTitle } from "../site.ts";
  import PageTools from "./page-tools.svelte";
  import PrevNext from "./prev-next.svelte";

  let {
    door,
    title,
    summary,
    sections = [],
    children,
  }: {
    door: Door | null;
    title: string;
    summary: string;
    /** The page's sections, for the rail. */
    sections?: { id: string; title: string }[];
    children: Snippet;
  } = $props();
</script>

<svelte:head><title>{pageTitle(title)}</title></svelte:head>

<!--
  A leaf page: quiet. The breadcrumb, the title, the summary, then the
  page's text at the prose measure, with the rail from lg.
-->
<div
  data-mode="productive"
  class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-(--gutter-stage) pt-[calc(var(--site-bar-room)+var(--spacing)*10)] pb-24 xl:grid-cols-[minmax(0,1fr)_var(--container-3xs)]"
>
  <div class="min-w-0">
    <Breadcrumb {door} />
    <h1 class="mt-4 type-section">{title}</h1>
    <p class="mt-4 text-lg text-muted-foreground">{summary}</p>
    <div class="mt-4"><PageTools path={page.url.pathname} /></div>
    <div class="mt-10">{@render children()}</div>
    <PrevNext path={page.url.pathname} />
  </div>
  <Rail {sections} />
</div>
