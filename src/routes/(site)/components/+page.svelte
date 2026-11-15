<script lang="ts">
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import { door } from "#lib/site/doors";
  import Command from "#lib/site/page/command.svelte";
  import Landing from "#lib/site/page/landing.svelte";
  import { componentPath, GROUPS, SITEMAP } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // The committed pictures, fingerprinted by Vite and cached for a year.
  const THUMBS = import.meta.glob<string>(
    "../../../lib/site/thumbnails/*.webp",
    {
      query: "?no-inline",
      import: "default",
      eager: true,
    },
  );
  // A picture loads only as its tile nears the screen: native lazy loading
  // fetches far ahead on a slow connection, which would load most of the 75
  // at once. The other scheme's picture is never displayed, so never loads.
  const near = (url: string) => (img: HTMLImageElement) => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        img.src = url;
        io.disconnect();
      },
      { rootMargin: "200px" },
    );
    io.observe(img);
    return () => io.disconnect();
  };
  // The tiles of the first screen, at 1280 × 900 and at 390: the first row.
  const FIRST = new Set(
    SITEMAP.filter((p) => p.parent === "/components/")
      .slice(0, 3)
      .map((p) => p.path.split("/")[2]),
  );
  const thumb = (name: string, scheme: string) =>
    THUMBS[`../../../lib/site/thumbnails/${name}-${scheme}.webp`];

  const items = SITEMAP.filter((p) => p.parent === "/components/").map((p) => {
    const name = p.path.split("/")[2];
    const entry = data.registry[name];
    return {
      name,
      path: componentPath(name),
      title: entry.title,
      description: entry.description,
      group: entry.meta.group,
      modes: entry.meta.modes,
      since: entry.meta.since,
      text: `${entry.title} ${name} ${entry.description}`.toLowerCase(),
    };
  });

  let query = $state("");
  const q = $derived(query.trim().toLowerCase());
  const shown = $derived(items.filter((i) => !q || i.text.includes(q)));
  const count = $derived(
    shown.length === 0
      ? `No components match "${query.trim()}". Clear the filter to see all ${items.length}.`
      : `${shown.length} component${shown.length === 1 ? "" : "s"}`,
  );
</script>

<Landing door={door("components")}>
  {#snippet fact()}{items.length}{/snippet}
  {#snippet sentence()}parts you can add, each a page{/snippet}
  {#snippet glass()}
    <p class="mb-3 font-medium">Start with the theme:</p>
    <Command
      code={data.theme.code}
      lines={data.theme.lines}
      label="Install the theme"
    />
  {/snippet}

  <div
    data-mode="productive"
    class="mx-auto max-w-7xl px-(--gutter-stage) pt-12 pb-20"
  >
    <div class="grid max-w-(--container-md) gap-2" data-md="skip">
      <Label for="filter">Filter components</Label>
      <div class="relative">
        <MagnifyingGlass
          aria-hidden="true"
          class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id="filter"
          class="ps-9"
          bind:value={query}
          autocomplete="off"
          placeholder="Button, dialog, chart"
        />
      </div>
    </div>
    <p
      role="status"
      aria-live="polite"
      data-md="skip"
      class="mt-4 mb-10 text-sm text-muted-foreground"
    >
      {count}
    </p>
    {#each GROUPS as group (group.id)}
      {@const rows = shown.filter((i) => i.group === group.id)}
      {#if rows.length}
        <section
          id={group.id}
          aria-labelledby="group-{group.id}"
          class="mt-14 first-of-type:mt-0"
        >
          <h2
            id="group-{group.id}"
            class="flex items-baseline gap-3 text-2xl font-semibold tracking-section"
          >
            {group.title}
            <span
              class="font-sans text-sm font-normal tracking-normal text-muted-foreground"
              >{rows.length}</span
            >
          </h2>
          <!-- 018 decision 13: from md a grid of tiles, each one link with a
               picture of the item's first example; below md, rows with a
               small picture at their start. Each picture comes in two, one
               per scheme; the other scheme's is not displayed, so not fetched. -->
          <ul
            data-wide
            class="mt-4 grid gap-x-4 gap-y-0 md:grid-cols-2 md:gap-y-4 lg:grid-cols-3"
          >
            {#each rows as item (item.name)}
              <li class="max-md:groove-b">
                <a
                  href={item.path}
                  data-slot="component-tile"
                  class="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 py-3 text-foreground md:h-full md:grid-cols-1 md:overflow-hidden md:rounded md:border md:border-border md:bg-card md:py-0"
                >
                  <span
                    class="block w-24 overflow-hidden rounded border border-border bg-background md:w-auto md:rounded-none md:border-0 md:border-b"
                  >
                    {#if FIRST.has(item.name)}
                      <!-- The first row: the theme's class picks the picture in
                           CSS, so it loads with the page and no script. -->
                      <span
                        aria-hidden="true"
                        data-slot="tile-picture"
                        class="site-thumb block aspect-[16/10] w-full"
                        style:--thumb-light="url({thumb(item.name, 'light')})"
                        style:--thumb-dark="url({thumb(item.name, 'dark')})"
                      ></span>
                    {:else}
                      {#each ["light", "dark"] as const as scheme (scheme)}
                        {#if thumb(item.name, scheme)}
                          <img
                            {@attach near(thumb(item.name, scheme)!)}
                            alt=""
                            width="480"
                            height="300"
                            loading="lazy"
                            decoding="async"
                            data-scheme={scheme}
                            class={[
                              "block aspect-[16/10] h-auto w-full",
                              scheme === "light"
                                ? "dark:hidden"
                                : "hidden dark:block",
                            ]}
                          />
                        {/if}
                      {/each}
                      <!-- With scripts off, the light picture, decorative. -->
                      <noscript
                        ><img
                          src={thumb(item.name, "light")}
                          alt=""
                          width="480"
                          height="300"
                          loading="lazy"
                          class="block aspect-[16/10] h-auto w-full"
                        /></noscript
                      >
                    {/if}
                  </span>
                  <span class="grid gap-1 md:p-4">
                    <span class="font-medium group-hover:underline"
                      >{item.title}</span
                    >
                    <span class="text-sm text-muted-foreground"
                      >{item.description}</span
                    >
                    <span class="text-xs text-muted-foreground"
                      >{item.modes.join(", ")}. Since {item.since}</span
                    >
                  </span>
                </a>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    {/each}
  </div>
</Landing>
