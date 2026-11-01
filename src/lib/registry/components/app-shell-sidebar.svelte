<script lang="ts">
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import Gear from "phosphor-svelte/lib/Gear";
  import House from "phosphor-svelte/lib/House";
  import Pulse from "phosphor-svelte/lib/Pulse";
  import Users from "phosphor-svelte/lib/Users";
  import type { AppShellLink } from "#lib/registry/components/app-shell-nav.svelte";
  import AppShellUserMenu, {
    initials,
    type AppShellUser,
  } from "#lib/registry/components/app-shell-user-menu.svelte";
  import * as Avatar from "#lib/registry/ui/avatar";
  import * as Collapsible from "#lib/registry/ui/collapsible";
  import * as Sidebar from "#lib/registry/ui/sidebar";

  let {
    links,
    current,
    user = null,
    collapsible = "offcanvas",
    heading = "Workspace",
    preferences = [
      { label: "Profile", href: "#members" },
      { label: "Notifications", href: "#members" },
    ],
    settingsHref = "/",
    signOutHref = "/",
  }: {
    /** The primary links, with the icons below by position. */
    links: AppShellLink[];
    /** The current page's href, from `page.url`. */
    current?: string;
    user?: AppShellUser | null;
    /** Off-canvas (the default) or to icons; the shell's choice. */
    collapsible?: "offcanvas" | "icon";
    /** The section's name, in the heading face; not the lockup, which the header shows. */
    heading?: string;
    /** The sub-items of the Preferences group; replace their hrefs with your routes. */
    preferences?: AppShellLink[];
    settingsHref?: string;
    signOutHref?: string;
  } = $props();

  // One icon per shipped link, by position. Give each of your links its own.
  const ICONS = [House, Pulse, Users];
</script>

<!--
  The shell's sidebar on 005's item: a nav landmark named "Main" with the
  section's name, a search field, two groups with mono lowercase labels (the
  links, then a collapsible Preferences group with its sub-items), and the
  account row in its footer opening the account menu. The current row is
  told by aria-current, the inset and the primary edge. From md it sits
  under the sticky 64 px header: top-16, and 64 px of padding at the foot of
  its h-svh box, so the account row ends at the viewport's bottom. Below md
  it is the sheet the item provides, opened by the header's trigger.
-->
<Sidebar.Root label="Main" {collapsible} class="md:top-16 md:pb-16">
  <Sidebar.Header>
    <p
      class="flex h-12 items-center px-3 font-heading text-base font-bold group-data-[collapsible=icon]:hidden"
    >
      {heading}
    </p>
    <Sidebar.Input placeholder="Search" aria-label="Search" />
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>workspace</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {#each links as link, i (link.href)}
            {@const Icon = ICONS[i]}
            <Sidebar.MenuItem>
              <Sidebar.MenuButton
                isActive={current === link.href}
                tooltipContent={link.label}
              >
                {#snippet child({ props })}
                  <a {...props} href={link.href}>
                    {#if Icon}
                      <Icon aria-hidden="true" />
                    {/if}
                    <span>{link.label}</span>
                  </a>
                {/snippet}
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          {/each}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
    <Sidebar.Group>
      <Sidebar.GroupLabel>settings</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Collapsible.Root class="group/collapsible">
              <Collapsible.Trigger>
                {#snippet child({ props })}
                  <Sidebar.MenuButton {...props} tooltipContent="Preferences">
                    <Gear aria-hidden="true" />
                    <span>Preferences</span>
                    <CaretRight
                      aria-hidden="true"
                      class="ms-auto transition group-data-[state=open]/collapsible:rotate-90"
                    />
                  </Sidebar.MenuButton>
                {/snippet}
              </Collapsible.Trigger>
              <Collapsible.Content>
                <Sidebar.MenuSub>
                  {#each preferences as item (item.label)}
                    <Sidebar.MenuSubItem>
                      <Sidebar.MenuSubButton href={item.href}>
                        <span>{item.label}</span>
                      </Sidebar.MenuSubButton>
                    </Sidebar.MenuSubItem>
                  {/each}
                </Sidebar.MenuSub>
              </Collapsible.Content>
            </Collapsible.Root>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  {#if user}
    {@const account = user}
    <Sidebar.Footer>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <AppShellUserMenu user={account} {settingsHref} {signOutHref}>
            {#snippet trigger({ props })}
              <Sidebar.MenuButton {...props} tooltipContent={account.name}>
                <Avatar.Root size="sm" aria-hidden="true">
                  <Avatar.Fallback>{initials(account.name)}</Avatar.Fallback>
                </Avatar.Root>
                <span>{account.name}</span>
              </Sidebar.MenuButton>
            {/snippet}
          </AppShellUserMenu>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Footer>
  {/if}
</Sidebar.Root>
