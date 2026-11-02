<script lang="ts">
  import type { Snippet } from "svelte";
  import { version } from "$app/env";
  import { page } from "$app/state";
  import AppShellFooter from "#lib/registry/components/app-shell-footer.svelte";
  import AppShellHeader from "#lib/registry/components/app-shell-header.svelte";
  import AppShellSidebar from "#lib/registry/components/app-shell-sidebar.svelte";
  import AppShellSkipLink from "#lib/registry/components/app-shell-skip-link.svelte";
  import Page from "#lib/registry/blocks/app-shell/+page.svelte";
  import * as Breadcrumb from "#lib/registry/ui/breadcrumb";
  import * as Sidebar from "#lib/registry/ui/sidebar";
  import { ThemeScript } from "#lib/registry/ui/theme";

  /**
   * A state view of the shell (006 decision 12): a copy of the block's
   * +layout.svelte markup with its constants as props, around the block's
   * example page. The default view renders the shipped files themselves.
   * 008 decision 8: the identity varies by view, so it is props too.
   */
  let {
    sidebar = false,
    sidebarOpen = true,
    user = null,
    appName = "Sandbox",
    logo,
    tagline = "",
    endorsed = false,
  }: {
    sidebar?: false | "offcanvas" | "icon";
    sidebarOpen?: boolean;
    user?: { name: string; email: string } | null;
    appName?: string;
    logo?: Snippet<[place: "header" | "footer"]>;
    tagline?: string;
    endorsed?: boolean;
  } = $props();

  const LINKS = [
    { label: "Overview", href: "#overview" },
    { label: "Activity", href: "#activity" },
    { label: "Members", href: "#members" },
  ];
  const FOOTER = {
    commit: /^\d+$/.test(version) ? undefined : version,
    builtAt: import.meta.env.VITE_BUILT_AT as string | undefined,
    docId: "PS-DS-0006",
    sourceHref: "https://github.com/plutosystemsco/design-system",
  };
  const current = $derived(page.url.hash);
</script>

<ThemeScript />

{#snippet shell()}
  <AppShellSkipLink />
  <AppShellHeader
    {appName}
    {logo}
    links={LINKS}
    {current}
    sidebar={Boolean(sidebar)}
    {user}
  />
  {#if sidebar}
    <div class="flex flex-1">
      <AppShellSidebar links={LINKS} {current} {user} collapsible={sidebar} />
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
          <Page />
        </div>
      </Sidebar.Inset>
    </div>
  {:else}
    <main
      id="main"
      tabindex="-1"
      class="mx-auto w-full max-w-5xl flex-1 px-6 py-12"
    >
      <Page />
    </main>
  {/if}
  <AppShellFooter {appName} {logo} {tagline} {endorsed} {...FOOTER} />
{/snippet}

{#if sidebar}
  <Sidebar.Provider open={sidebarOpen}>
    {@render shell()}
  </Sidebar.Provider>
{:else}
  <div class="flex min-h-svh flex-col">
    {@render shell()}
  </div>
{/if}
