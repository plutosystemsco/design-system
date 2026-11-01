<script lang="ts">
  import List from "phosphor-svelte/lib/List";
  import { afterNavigate } from "$app/navigation";
  import AppShellNav, {
    type AppShellLink,
  } from "#lib/registry/components/app-shell-nav.svelte";
  import AppShellUserMenu, {
    type AppShellUser,
  } from "#lib/registry/components/app-shell-user-menu.svelte";
  import { Button } from "#lib/registry/ui/button";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import * as Sheet from "#lib/registry/ui/sheet";
  import { SidebarTrigger } from "#lib/registry/ui/sidebar";
  import { ThemeToggle } from "#lib/registry/ui/theme";
  import { cn } from "#lib/utils";

  let {
    appName,
    links = [],
    current,
    sidebar = false,
    user = null,
    sticky = false,
    settingsHref = "/",
    signOutHref = "/",
    class: className,
  }: {
    /** The app's name: the lockup's accessible name and the nav sheet's title. */
    appName: string;
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
  background, grooved on its bottom edge. The lockup at 28 px is the home
  link and plays the page's one entrance. Without a sidebar the primary nav
  shows from md and folds into a start sheet below it, opened by a 32 px
  menu button; the theme toggle and the account menu sit at the end. With a
  sidebar the trigger follows the lockup at every width, the sidebar holds
  the navigation and the account, and the header is sticky (z-20, under
  every overlay), since the sidebar beside it is sticky too. Without one,
  not sticky by default.
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
    <Lockup href="/" label={appName} entrance class="text-2xl" />
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
