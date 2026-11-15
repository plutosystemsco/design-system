<script module lang="ts">
  import plex from "@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2?url";
</script>

<script lang="ts">
  import { followDoor } from "#lib/site/door-transition";
  import {
    DOOR_GAP_RATIO,
    DOOR_NAME_RATIO,
    DOORS,
    POSTER_CAP_OFFSET,
  } from "#lib/site/doors";
  import { appPath } from "#lib/site/files";
  import Command from "#lib/site/page/command.svelte";
  import { pageTitle } from "#lib/site/site";
  import { componentPath, GROUPS, SITEMAP } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const lines = 3;
  // Below lg the disc is 40% of the width, at most 160 px; from lg it is the
  // headline's three lines over (2 + gap) discs, so the 2 × 2 is exactly
  // the headline's height, and its top sits at the first line's cap height.
  const mapStyle = [
    `--door-gap-ratio: ${DOOR_GAP_RATIO}`,
    `--door-name-ratio: ${DOOR_NAME_RATIO}`,
    `--poster-cap-offset: ${POSTER_CAP_OFFSET}`,
    `--poster-lines: ${lines}`,
  ].join("; ");
</script>

<svelte:head>
  <title>{pageTitle()}</title>
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
    href={plex}
  />
</svelte:head>

<div data-mode="expressive">
  <!-- Clipped sideways: the doors dock from outside their place on load. -->
  <section
    aria-labelledby="home-title"
    class="mx-auto grid overflow-x-clip max-w-7xl grid-cols-[minmax(0,1fr)] items-start gap-y-8 px-(--gutter-stage) pt-[calc(var(--site-bar-room)+var(--spacing)*12)] pb-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-12"
  >
    <h1 id="home-title" class="type-poster text-foreground lg:col-start-1">
      <span class="block">Design</span>
      <span class="block">with</span>
      <span class="block">Kuiper</span>
    </h1>
    <p
      class="max-w-(--container-xl) text-xl leading-normal text-muted-foreground lg:col-start-1"
    >
      The tokens, components and brand behind every Pluto Systems product. Copy
      in what you need, and own what you copy.
    </p>
    <div class="max-w-(--container-xl) min-w-0 lg:col-start-1">
      <Command
        code={data.theme.code}
        lines={data.theme.lines}
        label="Install the theme"
      />
    </div>
    <ul
      data-slot="door-map"
      aria-label="The four sections"
      style={mapStyle}
      class="[--disc:min(40vw,calc(var(--spacing)*40))] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-[calc(var(--type-poster-size)*var(--poster-cap-offset))] lg:[--disc:calc(var(--type-poster-size)*var(--type-poster-leading)*var(--poster-lines)/(2+var(--door-gap-ratio)))]"
    >
      {#each DOORS as door (door.id)}
        <li>
          <a
            href={door.path}
            data-slot="door"
            class="field-{door.n}"
            style:view-transition-name="door-{door.id}"
            onclick={() => followDoor(door.id)}
          >
            <span data-slot="door-name">{door.name}</span>
            <span
              data-slot="door-line"
              class="mt-1 font-sans text-xs font-normal xl:text-sm"
              >{door.line}</span
            >
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="gives" class="groove">
    <div class="mx-auto max-w-7xl px-(--gutter-stage) py-16">
      <h2 id="gives" class="type-section">What one command gives you</h2>
      <p class="mt-3 max-w-(--site-measure) text-muted-foreground">
        Adding a part writes its source into your app. You own those files: read
        them, change them, keep them. Nothing reaches back here when your app
        runs.
      </p>
      <div
        class="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)_minmax(0,3fr)]"
      >
        <div class="min-w-0">
          <h3 class="site-h3 mb-3">The command</h3>
          <Command
            code={data.add.code}
            lines={data.add.lines}
            label="Add the button"
          />
        </div>
        <div class="min-w-0">
          <h3 class="site-h3 mb-3">Files you own</h3>
          <ul class="groove-b">
            {#each data.gives.files as file (file)}
              <li class="groove py-3 font-mono text-sm wrap-anywhere">
                {appPath({ path: file, type: "registry:ui" })}
              </li>
            {/each}
          </ul>
          <p class="mt-3 text-sm text-muted-foreground">
            Paths follow your <code>components.json</code>.
          </p>
        </div>
        <div class="min-w-0">
          <h3 class="site-h3 mb-3">What it brings</h3>
          <ul class="groove-b">
            {#each data.gives.brings as name (name)}
              <li class="groove py-3">
                <a
                  href={componentPath(name)}
                  class="font-mono text-sm text-foreground hover:underline"
                  >{name}</a
                >
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section aria-label="The four sections, indexed" class="groove">
    <div
      class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-x-8 gap-y-12 px-(--gutter-stage) py-16 md:grid-cols-2 lg:grid-cols-4"
    >
      {#each DOORS as door (door.id)}
        {@const pages =
          door.id === "components"
            ? GROUPS.map((g) => ({
                title: g.title,
                path: `/components/#${g.id}`,
              }))
            : SITEMAP.filter((p) => p.door === door.id && p.path !== door.path)}
        <div class="min-w-0">
          <h2
            class="flex items-center gap-3 font-heading text-2xl font-semibold tracking-section"
          >
            <span class="site-dot" data-door={door.n} aria-hidden="true"
            ></span><a href={door.path} class="text-foreground hover:underline"
              >{door.name}</a
            >
          </h2>
          <p class="mt-2 text-muted-foreground">{door.summary}</p>
          {#if pages.length}
            <ul class="groove-b mt-5">
              {#each pages as p (p.path)}
                <li class="groove py-3">
                  <a href={p.path} class="text-foreground hover:underline"
                    >{p.title}</a
                  >
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  </section>
</div>
