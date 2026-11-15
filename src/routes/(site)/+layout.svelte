<script lang="ts">
  import "#lib/site/site.css";
  import type { Snippet } from "svelte";
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { ThemeScript } from "#lib/registry/ui/theme";
  import Bar from "#lib/site/chrome/bar.svelte";
  import Footer from "#lib/site/chrome/footer.svelte";
  import SideNav from "#lib/site/chrome/side-nav.svelte";
  import { takeDoor } from "#lib/site/door-transition";
  import { DOORS } from "#lib/site/doors";
  import { sitePage } from "#lib/site/sitemap";

  let { children }: { children: Snippet } = $props();

  // The page's entry in the one list, read from its route, so the 404 page,
  // served at any address, marks no door.
  const entry = $derived(
    sitePage(
      (page.route.id ?? "").replace(/^\/\(site\)/, "").replace(/\/?$/, "/"),
    ),
  );
  const current = $derived(entry?.door ?? null);
  const landing = $derived(!!entry && DOORS.some((d) => d.path === entry.path));
  // Every page but home has the left nav (018 decision 1); the 404 has none.
  const nav = $derived(!!entry && entry.path !== "/");
  const navLabel = $derived(
    nav
      ? current
        ? `${DOORS.find((d) => d.id === current)!.name} pages`
        : "Site pages"
      : "",
  );

  // The door opens onto its field: following a disc on the home page grows
  // it into the landing's band. Only then, only where the browser has view
  // transitions, and never under reduced motion; every other navigation is
  // instant.
  onNavigate((navigation) => {
    const door = takeDoor();
    if (
      !door ||
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    return new Promise((resolve) => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });
</script>

<!-- The theme's head script, once per page. -->
<ThemeScript />

<!-- Every page links its Markdown twin and the index of twins. -->
<svelte:head>
  {#if entry}
    <link rel="alternate" type="text/markdown" href="{entry.path}index.md" />
    <link rel="describedby" href="/llms.txt" />
  {/if}
</svelte:head>

<!-- The lockup plays the page's one entrance, once per full load; on the home page the doors do. -->
<Bar
  {current}
  {landing}
  entrance={entry?.path !== "/"}
  path={entry?.path ?? null}
  {navLabel}
  productive={nav && !landing && current !== "brand"}
/>

{#if nav && entry}
  <!--
    From lg, two columns: the nav in the start one, at the bar's start edge,
    and the page in the other, ending at the bar's end edge. A landing's
    band spans both, so the nav begins below it.
  -->
  <div
    class="flex-1 lg:grid lg:grid-cols-[calc(var(--container-3xs)+var(--site-edge))_minmax(0,1fr)] lg:grid-rows-[auto_1fr]"
  >
    <div
      class={[
        "relative z-10 hidden lg:col-start-1 lg:block",
        landing
          ? "lg:row-start-2 lg:pt-12"
          : "lg:row-span-2 lg:row-start-1 lg:pt-[calc(var(--site-bar-room)+var(--spacing)*10)]",
      ]}
    >
      <SideNav
        door={current}
        current={entry.path}
        label={navLabel}
        filter={current === "components" && !landing}
        class="sticky top-(--site-bar-room) ms-auto max-h-[calc(100dvh-var(--site-bar-room))] w-(--container-3xs) overflow-y-auto ps-(--gutter-stage) pe-2 pb-8"
      />
    </div>
    <main
      id="main"
      tabindex="-1"
      class={[
        "min-w-0 outline-none lg:row-span-2 lg:row-start-1",
        landing
          ? "lg:col-span-2 lg:col-start-1 lg:grid lg:grid-cols-subgrid lg:grid-rows-subgrid"
          : "lg:col-start-2 lg:pe-(--site-edge)",
      ]}
    >
      {@render children()}
    </main>
  </div>
{:else}
  <main id="main" tabindex="-1" class="flex-1 outline-none">
    {@render children()}
  </main>
{/if}

<Footer />
