<script lang="ts">
  import "#lib/site/site.css";
  import type { Snippet } from "svelte";
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { ThemeScript } from "#lib/registry/ui/theme";
  import Bar from "#lib/site/chrome/bar.svelte";
  import Footer from "#lib/site/chrome/footer.svelte";
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
<Bar {current} {landing} entrance={entry?.path !== "/"} />

<main id="main" tabindex="-1" class="flex-1 outline-none">
  {@render children()}
</main>

<Footer />
