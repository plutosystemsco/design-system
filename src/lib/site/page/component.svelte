<script lang="ts" module>
  import type { Component as SvelteComponent } from "svelte";
  import type { ExampleMeta } from "../shown-source.ts";

  /** An example file's module: its component and its meta. */
  export type ExampleModule = {
    default: SvelteComponent<any>;
    meta: ExampleMeta;
  };

  /** The page's sections, in order: the when, what, how and who of a part. */
  export const SECTIONS = [
    { id: "examples", title: "Examples" },
    { id: "install", title: "Install" },
    { id: "usage", title: "Usage" },
    { id: "api", title: "API" },
    { id: "accessibility", title: "Accessibility" },
    { id: "files", title: "Files you own" },
    { id: "related", title: "Related" },
  ] as const;
</script>

<script lang="ts">
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import geist from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import Breadcrumb from "../chrome/breadcrumb.svelte";
  import Rail from "../chrome/rail.svelte";
  import type { ComponentData } from "../component-data.server.ts";
  import { door } from "../doors.ts";
  import { pageTitle } from "../site.ts";
  import { componentPath, GROUPS } from "../sitemap.ts";
  import ApiTable from "./api-table.svelte";
  import Facts from "./facts.svelte";
  import Files from "./files.svelte";
  import Frame from "./frame.svelte";
  import InstallTabs from "./install.svelte";
  import PageTools from "./page-tools.svelte";
  import PrevNext from "./prev-next.svelte";
  import Related from "./related.svelte";
  import Usage from "./usage.svelte";

  type Entry = {
    name: string;
    type: string;
    title: string;
    description: string;
    meta: {
      since: string;
      group: string;
      modes: string[];
      stock?: { item: string };
    };
  };

  let {
    name,
    examples = {},
    preview,
    when,
    dos,
    donts,
    accessibility,
    code,
  }: {
    name: string;
    /** The item's example files, by id, in the order they show. */
    examples?: Record<string, ExampleModule>;
    /** A block's or a composition's viewer, in place of example frames. */
    preview?: Snippet;
    when: Snippet;
    dos: Snippet;
    donts: Snippet;
    /** Its keyboard behaviour, its names and roles, and its limits, as <li>s. */
    accessibility: Snippet;
    /** A block's files with their text, under "Files you own". */
    code?: Snippet;
  } = $props();

  const item = $derived((page.data.registry as Record<string, Entry>)[name]);
  const lines = $derived(
    page.data.install as {
      site: HighlightedLine[] | null;
      github: HighlightedLine[] | null;
    } | null,
  );
  const data = $derived(page.data.component as ComponentData);
  const group = $derived(GROUPS.find((g) => g.id === item.meta.group)!);
  const isBlock = $derived(item.type === "registry:block");
  const ids = $derived(Object.keys(examples));
</script>

<svelte:head>
  <title>{pageTitle(item.title)}</title>
  <!-- The text face early, so the header does not reflow when it arrives. -->
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
    href={geist}
  />
</svelte:head>

{#snippet heading(id: string, title: string)}
  <h2 {id} class="text-2xl font-semibold tracking-section">{title}</h2>
{/snippet}

<!--
  A component page: quiet. The header (the breadcrumb, the title, the
  registry's description and the facts), then its sections in one order on
  every page, without tabs, so find-in-page and the Markdown twin read them
  all; then the rail, from lg.
-->
<div
  data-mode="productive"
  class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-(--gutter-stage) pt-[calc(var(--site-bar-room)+var(--spacing)*2)] pb-24 xl:grid-cols-[minmax(0,1fr)_var(--container-3xs)]"
>
  <div class="min-w-0">
    <Breadcrumb
      door={door("components")}
      trail={[{ label: group.title, href: `/components/#${group.id}` }]}
    />
    <h1 class="mt-3 type-section">{item.title}</h1>
    <p class="mt-3 max-w-(--site-measure) text-base text-muted-foreground">
      {item.description}
    </p>
    <div
      class="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2"
    >
      <Facts
        since={item.meta.since}
        updated={data.updated}
        modes={item.meta.modes}
        stock={item.meta.stock?.item}
      />
      <PageTools path={componentPath(name)} />
    </div>
    <details data-md="skip" class="group/otp mt-4 text-sm xl:hidden">
      <summary
        class="flex cursor-pointer list-none items-center gap-2 font-medium [&::-webkit-details-marker]:hidden"
        ><CaretRight
          aria-hidden="true"
          class="size-4 transition-transform group-open/otp:rotate-90"
        />On this page</summary
      >
      <ul class="mt-2 grid gap-1 ps-4">
        {#each SECTIONS as s (s.id)}
          <li>
            <a href="#{s.id}" class="text-primary underline">{s.title}</a>
          </li>
        {/each}
      </ul>
    </details>

    <section aria-labelledby="examples" class="mt-4">
      {@render heading("examples", "Examples")}
      <div class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-8">
        {#if preview}
          {@render preview()}
        {:else}
          {#each ids as id, i (id)}
            {#if data.examples[id]}
              <Frame
                item={name}
                example={data.examples[id]}
                view={examples[id].default}
                data={page.data}
                open={i === 0}
              />
            {/if}
          {/each}
        {/if}
      </div>
    </section>

    <section aria-labelledby="install" class="mt-16">
      {@render heading("install", "Install")}
      <div class="mt-6 grid gap-3">
        <InstallTabs {name} {lines} />
        {#if isBlock}
          <p
            data-testid="install-note"
            class="max-w-(--site-measure) text-sm text-muted-foreground"
          >
            Leave out <code>-o</code>. Without it, the CLI lists the files that
            already exist and asks before it overwrites any. Use <code>-o</code>
            only for a first install into an app with nothing to lose.
          </p>
        {/if}
        <p class="max-w-(--site-measure) text-sm text-muted-foreground">
          In a SvelteKit 2 app, read <code>$lib</code> for <code>#lib</code>.
        </p>
      </div>
    </section>

    <section aria-labelledby="usage" class="mt-16">
      {@render heading("usage", "Usage")}
      <div class="mt-6"><Usage {when} {dos} {donts} /></div>
    </section>

    <section aria-labelledby="api" class="mt-16">
      {@render heading("api", "API")}
      <div class="mt-6"><ApiTable tables={data.api} /></div>
    </section>

    <section aria-labelledby="accessibility" class="mt-16">
      {@render heading("accessibility", "Accessibility")}
      <ul class="mt-6 grid max-w-(--site-measure) list-disc gap-2 ps-6">
        {@render accessibility()}
      </ul>
      <p class="mt-4 max-w-(--site-measure) text-sm text-muted-foreground">
        Every page here is checked in Chromium by axe, in both themes. Its
        keyboard fixture and its behaviours, where it has them, are walked by
        key. Firefox, Safari and screen readers are not checked yet.
      </p>
    </section>

    <section aria-labelledby="files" class="mt-16">
      {@render heading("files", "Files you own")}
      <div class="mt-6">
        <Files files={data.files}>{@render code?.()}</Files>
      </div>
    </section>

    <section aria-labelledby="related" class="mt-16">
      {@render heading("related", "Related")}
      <div class="mt-6">
        <Related
          brings={data.brings}
          broughtBy={data.broughtBy}
          packages={data.packages}
        />
      </div>
    </section>

    <PrevNext path={componentPath(name)} />
  </div>
  <Rail sections={[...SECTIONS]} />
</div>
