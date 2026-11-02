<script lang="ts">
  import type { Snippet } from "svelte";
  import List from "phosphor-svelte/lib/List";
  import { afterNavigate } from "$app/navigation";
  import AppShellNav, {
    type AppShellLink,
  } from "#lib/registry/components/app-shell-nav.svelte";
  import AppShellUserMenu, {
    type AppShellUser,
  } from "#lib/registry/components/app-shell-user-menu.svelte";
  import { Button } from "#lib/registry/ui/button";
  import * as Sheet from "#lib/registry/ui/sheet";
  import { SidebarTrigger } from "#lib/registry/ui/sidebar";
  import { ThemeToggle } from "#lib/registry/ui/theme";
  import { cn } from "#lib/utils";

  let {
    appName,
    logo,
    links = [],
    current,
    sidebar = false,
    user = null,
    sticky = false,
    settingsHref = "/",
    signOutHref = "/",
    class: className,
  }: {
    /** The product's name: the wordmark without a logo, the home link's accessible name with one, and the nav sheet's title. It contains any words the logo shows. */
    appName: string;
    /** The product's logo, at most 36 px tall and 176 px wide, so it fits beside the controls at 320 px; it renders for "header" here and "footer" in the footer. Without it, the name is the wordmark. */
    logo?: Snippet<[place: "header" | "footer"]>;
    links?: AppShellLink[];
    /** The current page's href, from `page.url`. */
    current?: string;
    /** With a sidebar the header holds its trigger and nothing else of the navigation: the links and the account live in the sidebar. */
    sidebar?: boolean;
    user?: AppShellUser | null;
    /** Without a sidebar: sticks to the top, under every overlay; the app then sets `scroll-padding-top` in its CSS. With a sidebar the header is always sticky. */
    sticky?: boolean;
    settingsHref?: string;
    signOutHref?: string;
    class?: string;
  } = $props();

  // The phone's nav sheet closes when a link in it navigates: the shell's
  // layout survives a client-side navigation, so an open sheet would too.
  let menuOpen = $state(false);
  afterNavigate(() => {
    menuOpen = false;
  });
</script>

<!--
  The banner: a 64 px row (a 48 px control and 8 px either side) on the
  background, grooved on its bottom edge. The home link holds the product's
  logo, named by appName, or appName itself as a wordmark in the heading
  face, truncated rather than widening the row. Without a sidebar the
  primary nav shows from md and folds into a start sheet below it, opened by
  a 32 px menu button; the theme toggle and the account menu sit at the end.
  With a sidebar the trigger follows the home link at every width, the
  sidebar holds the navigation and the account, and the header is sticky
  (z-20, under every overlay), since the sidebar beside it is sticky too.
  Without one, not sticky by default.
-->
<header
  data-slot="app-shell-header"
  class={cn(
    "groove-b bg-background",
    sidebar && "sticky top-0 z-20",
    sticky && !sidebar && "sticky top-0 z-40",
    className,
  )}
>
  <div class="mx-auto flex h-16 max-w-5xl items-center gap-4 px-6">
    {#if logo}
      <a
        href="/"
        aria-label={appName}
        data-shell="home"
        class="inline-flex min-h-12 min-w-6 shrink-0 items-center"
      >
        {@render logo("header")}
      </a>
    {:else}
      <a
        href="/"
        data-shell="home"
        class="inline-flex min-h-12 min-w-6 shrink items-center font-heading text-2xl leading-none font-bold tracking-mark"
      >
        <span class="truncate">{appName}</span>
      </a>
    {/if}
    {#if sidebar}
      <SidebarTrigger />
    {:else}
      <AppShellNav {links} {current} class="hidden md:flex" />
    {/if}
    <div class="ms-auto flex items-center gap-2">
      <ThemeToggle size="icon-sm" />
      {#if user && !sidebar}
        <AppShellUserMenu {user} {settingsHref} {signOutHref} />
      {/if}
      {#if !sidebar}
        <Sheet.Root bind:open={menuOpen}>
          <Sheet.Trigger>
            {#snippet child({ props })}
              <Button
                {...props}
                variant="ghost"
                size="icon-sm"
                aria-label="Menu"
                class="md:hidden"
                data-shell="menu-button"
              >
                <List aria-hidden="true" />
              </Button>
            {/snippet}
          </Sheet.Trigger>
          <Sheet.Content side="start" data-shell="menu">
            <Sheet.Header class="sr-only">
              <Sheet.Title>{appName}</Sheet.Title>
            </Sheet.Header>
            <AppShellNav {links} {current} vertical />
            {#if user}
              <div class="groove flex flex-col items-start pt-6 text-sm">
                <span>{user.name}</span>
                <Button
                  variant="link"
                  href={signOutHref}
                  class="text-foreground"
                >
                  Sign out
                </Button>
              </div>
            {/if}
          </Sheet.Content>
        </Sheet.Root>
      {/if}
    </div>
  </div>
</header>
