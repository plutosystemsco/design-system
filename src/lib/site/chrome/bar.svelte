<script lang="ts">
  import List from "phosphor-svelte/lib/List";
  import { Button } from "#lib/registry/ui/button";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import * as Sheet from "#lib/registry/ui/sheet";
  import { ThemeToggle } from "#lib/registry/ui/theme";
  import { DOORS, type DoorId } from "../doors.ts";
  import { SITE_NAME } from "../site.ts";
  import DoorLink from "./door-link.svelte";
  import SideNav from "./side-nav.svelte";
  import Search from "./search.svelte";

  let {
    current = null,
    landing = false,
    entrance = true,
    path = null,
    navLabel = "",
    productive = false,
  }: {
    /** The page is productive: once it scrolls, the panel turns opaque (018 decision 10). */
    productive?: boolean;
    /** The page's path, for the menus; none on the 404. */
    path?: string | null;
    /** The left nav's name, which the menu takes from md to lg; none on the home page and the 404. */
    navLabel?: string;
    /** The door the page belongs to. */
    current?: DoorId | null;
    /** The page is that door's landing. */
    landing?: boolean;
    /** The lockup plays the page's one entrance; on the home page the doors do. */
    entrance?: boolean;
  } = $props();

  let menuOpen = $state(false);
  let doorOpen = $state(false);

  // 018 decision 10: on a productive page, once it has scrolled, the panel
  // takes the glass's own opaque ground, so no example shows through it.
  // An observer on a sentinel at the page's top, not a scroll listener.
  let sentinel: HTMLElement | undefined = $state();
  let bar: HTMLElement | undefined = $state();
  let scrolled = $state(false);
  $effect(() => {
    // A landing's band holds the glass's showcase: the panel turns opaque
    // only once the band has left the room under the bar (018 checkpoint 2).
    const band = landing
      ? document.querySelector<HTMLElement>('[data-slot="band"]')
      : null;
    const target = productive ? sentinel : band;
    if (!target) {
      scrolled = false;
      return;
    }
    const room = band ? (bar?.offsetHeight ?? 0) : 0;
    const io = new IntersectionObserver(
      ([e]) => (scrolled = !e.isIntersecting),
      { rootMargin: `-${room}px 0px 0px 0px` },
    );
    io.observe(target);
    return () => io.disconnect();
  });
  // The phone menu's pages load when it first opens, not with every page.
  let AllPages: typeof import("./all-pages.svelte").default | null =
    $state(null);
  $effect(() => {
    if (menuOpen && !AllPages)
      import("./all-pages.svelte").then((m) => (AllPages = m.default));
  });
  const currentOf = (id: DoorId) =>
    id === current ? (landing ? "page" : "true") : undefined;
</script>

<!--
  The bar: a floating glass panel at the wide measure, sticky, its text the
  foreground and the primary only, so it reads over anything that scrolls
  under it. The banner holds the lockup; the doors, search and the theme
  sit in the site's navigation beside it. Below md the doors fold into a
  sheet behind "Menu".
-->
<div
  bind:this={sentinel}
  aria-hidden="true"
  class="pointer-events-none absolute top-0 h-px w-px"
></div>
<div
  bind:this={bar}
  data-slot="site-bar"
  data-sticky-bar
  data-mode="expressive"
  class="pointer-events-none sticky top-0 z-40 h-(--site-bar-room) pt-2"
  style:view-transition-name="site-bar"
>
  <a
    href="#main"
    class="pointer-events-auto sr-only focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-4 focus:py-2 focus:text-sm"
    >Skip to content</a
  >
  <div class="mx-auto max-w-7xl px-(--gutter-stage)">
    <div
      data-scrolled={scrolled ? "" : undefined}
      class="glass pointer-events-auto flex h-(--size-bar) items-center gap-2 ps-3 pe-2 transition-[background-color] duration-(--motion-micro) data-scrolled:bg-(--glass-fallback) md:gap-4 lg:gap-6"
      {@attach pointerLight}
    >
      <header class="flex shrink-0">
        <Lockup
          href="/"
          label={`pluto, ${SITE_NAME}`}
          {entrance}
          class="rounded px-2 py-2 text-2xl text-foreground"
        />
      </header>
      <nav aria-label="Site" class="flex min-w-0 flex-1 items-center gap-1">
        <ul class="hidden items-center gap-1 md:flex">
          {#each DOORS as door (door.id)}
            <li><DoorLink {door} current={currentOf(door.id)} /></li>
          {/each}
        </ul>
        <div class="ms-auto flex items-center gap-1">
          <Search shortcut />
          <ThemeToggle />
          <!-- Below md: every page, by door (018 decision 2). -->
          <Sheet.Root bind:open={menuOpen}>
            <Sheet.Trigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Menu"
                  class="md:hidden"
                >
                  <List aria-hidden="true" />
                </Button>
              {/snippet}
            </Sheet.Trigger>
            <Sheet.Content side="end" class="overflow-y-auto">
              <Sheet.Header class="sr-only">
                <Sheet.Title>{SITE_NAME}</Sheet.Title>
              </Sheet.Header>
              <div class="px-2 pb-8">
                {#if AllPages}
                  <AllPages
                    door={current}
                    current={path ?? ""}
                    onfollow={() => (menuOpen = false)}
                  />
                {/if}
              </div>
            </Sheet.Content>
          </Sheet.Root>
          <!-- From md to lg: the door's own pages, which the left nav holds from lg. -->
          {#if navLabel && path}
            <Sheet.Root bind:open={doorOpen}>
              <Sheet.Trigger>
                {#snippet child({ props })}
                  <Button
                    {...props}
                    variant="ghost"
                    size="icon-sm"
                    aria-label={navLabel}
                    class="hidden md:inline-flex lg:hidden"
                  >
                    <List aria-hidden="true" />
                  </Button>
                {/snippet}
              </Sheet.Trigger>
              <Sheet.Content side="end" class="overflow-y-auto">
                <Sheet.Header class="sr-only">
                  <Sheet.Title>{navLabel}</Sheet.Title>
                </Sheet.Header>
                <div class="px-2 pb-8">
                  <SideNav
                    door={current}
                    current={path}
                    label={navLabel}
                    onfollow={() => (doorOpen = false)}
                  />
                </div>
              </Sheet.Content>
            </Sheet.Root>
          {/if}
        </div>
      </nav>
    </div>
  </div>
</div>
