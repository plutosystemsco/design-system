<script lang="ts" module>
  /** The signed-in person, as the menu shows them. */
  export type AppShellUser = { name: string; email: string };

  /** The avatar's fallback: the first letter of the first two words of the name. */
  export function initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join("");
  }
</script>

<script lang="ts">
  import Gear from "phosphor-svelte/lib/Gear";
  import SignOut from "phosphor-svelte/lib/SignOut";
  import * as Avatar from "#lib/registry/ui/avatar";
  import { Button } from "#lib/registry/ui/button";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import type { Snippet } from "svelte";

  let {
    user,
    settingsHref = "/",
    signOutHref = "/",
    trigger,
  }: {
    user: AppShellUser;
    /** Your settings route. */
    settingsHref?: string;
    /** Your sign-out route. */
    signOutHref?: string;
    /** Another trigger, such as a sidebar row, given the menu's props; the default is the avatar in a 32 px button. */
    trigger?: Snippet<[{ props: Record<string, unknown> }]>;
  } = $props();
</script>

<!--
  The account menu: a 24 px avatar with the person's initials, hidden from
  the name, in a 32 px ghost button whose hidden text names it "Account
  menu". Inside, a group
  headed by the name and email, then Settings and Sign out, each a link
  through the item's child snippet so the role stays menuitem. No
  destructive styling on Sign out: leaving is not destroying.
-->
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}
      {#if trigger}
        {@render trigger({ props })}
      {:else}
        <Button
          {...props}
          variant="ghost"
          size="icon-sm"
          data-shell="user-menu-trigger"
        >
          <!-- The name comes from content, not aria-label: the initials are visible text, which a label would have to repeat (SC 2.5.3). -->
          <Avatar.Root size="sm" aria-hidden="true">
            <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
          </Avatar.Root>
          <span class="sr-only">Account menu</span>
        </Button>
      {/if}
    {/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end" data-shell="user-menu">
    <DropdownMenu.Group>
      <DropdownMenu.GroupHeading class="h-auto flex-col items-start py-2">
        <span>{user.name}</span>
        <span>{user.email}</span>
      </DropdownMenu.GroupHeading>
      <DropdownMenu.Item>
        {#snippet child({ props })}
          <a {...props} href={settingsHref}>
            <Gear aria-hidden="true" />
            Settings
          </a>
        {/snippet}
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        {#snippet child({ props })}
          <a {...props} href={signOutHref}>
            <SignOut aria-hidden="true" />
            Sign out
          </a>
        {/snippet}
      </DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Content>
</DropdownMenu.Root>
