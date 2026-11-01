<script lang="ts">
  import type { Snippet } from "svelte";
  import { version } from "$app/env";
  import { page } from "$app/state";
  import AppShellFooter from "#lib/registry/components/app-shell-footer.svelte";
  import AppShellHeader from "#lib/registry/components/app-shell-header.svelte";
  import AppShellSidebar from "#lib/registry/components/app-shell-sidebar.svelte";
  import AppShellSkipLink from "#lib/registry/components/app-shell-skip-link.svelte";
  import * as Breadcrumb from "#lib/registry/ui/breadcrumb";
  import * as Sidebar from "#lib/registry/ui/sidebar";
  import { ThemeScript } from "#lib/registry/ui/theme";

  // Your app's values. Move this file and +layout.server.ts to src/routes/,
  // and first replace LINKS and the sidebar's hrefs with your own routes: an
  // anchor such as #overview in a root layout fails the prerender of every
  // page that has no such id.
  const APP_NAME = "Pluto app";
  const LINKS = [
    { label: "Overview", href: "#overview" },
    { label: "Activity", href: "#activity" },
    { label: "Members", href: "#members" },
  ];
  /** false, "offcanvas" or "icon". With a sidebar, the navigation and the account live in it. */
  const SIDEBAR: false | "offcanvas" | "icon" = false;
  /** Without a sidebar only; then add `html { scroll-padding-top: 4rem }` to your app.css. */
  const STICKY = false;
  const USER: { name: string; email: string } | null = null;
  const FOOTER = {
    // SvelteKit's version name: the commit when vite.config.ts sets it (the
    // item page shows the lines); its default is a timestamp, all digits,
    // which means no commit: no row.
    commit: /^\d+$/.test(version) ? undefined : version,
    // The commit's own date, set by vite.config.ts; without it, no row.
    builtAt: import.meta.env.VITE_BUILT_AT as string | undefined,
    // Your doc ID, `PS-<series>-<NNNN>`; without it, no row.
    docId: undefined,
    // Your app's repository. Shipped as the design system's.
    sourceHref: "https://github.com/plutosystemsco/design-system",
    // One plain sentence, only when it is true.
    statement: undefined,
  };

  let {
    data,
    children,
  }: { data: { sidebarOpen: boolean }; children: Snippet } = $props();

  // The current page, for aria-current: the shipped links are anchors.
  const current = $derived(page.url.hash);
</script>

<!-- The theme's head script, once, so the theme is right before paint on every page. -->
<ThemeScript />

{#snippet shell()}
  <AppShellSkipLink />
  <AppShellHeader
    appName={APP_NAME}
    links={LINKS}
    {current}
    sidebar={Boolean(SIDEBAR)}
    user={USER}
    sticky={STICKY}
  />
  {#if SIDEBAR}
    <div class="flex flex-1">
      <AppShellSidebar
        links={LINKS}
        {current}
        user={USER}
        collapsible={SIDEBAR}
      />
      <Sidebar.Inset>
        <div class="flex h-16 items-center px-6">
          <Breadcrumb.Root>
            <Breadcrumb.List>
              <Breadcrumb.Item>
                <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
              </Breadcrumb.Item>
              <Breadcrumb.Separator />
              <Breadcrumb.Item>
                <Breadcrumb.Page>Projects</Breadcrumb.Page>
              </Breadcrumb.Item>
            </Breadcrumb.List>
          </Breadcrumb.Root>
        </div>
        <div class="flex-1 px-6 pb-12">
          {@render children()}
        </div>
      </Sidebar.Inset>
    </div>
  {:else}
    <main
      id="main"
      tabindex="-1"
      class="mx-auto w-full max-w-5xl flex-1 px-6 py-12"
    >
      {@render children()}
    </main>
  {/if}
  <AppShellFooter {...FOOTER} />
{/snippet}

<!--
  The frame every page sits in: the skip link first in body, the header,
  the main area (or the row of sidebar and inset), the footer. With a
  sidebar the provider is the root column, so the header's trigger reads its
  context; the row of sidebar and inset is this layout's own div.
-->
{#if SIDEBAR}
  <Sidebar.Provider open={data.sidebarOpen}>
    {@render shell()}
  </Sidebar.Provider>
{:else}
  <div class="flex min-h-svh flex-col">
    {@render shell()}
  </div>
{/if}
