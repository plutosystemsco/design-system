<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the trigger. Enter opens the menu with focus on its first item; ArrowDown moves; Escape closes and returns focus to the trigger; Tab from the open menu closes it.",
    frameMinHeight: 520,
  };
</script>

<script lang="ts">
  import CreditCard from "phosphor-svelte/lib/CreditCard";
  import Gear from "phosphor-svelte/lib/Gear";
  import SignOut from "phosphor-svelte/lib/SignOut";
  import User from "phosphor-svelte/lib/User";
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";

  let statusBar = $state(true);
  let density = $state("comfortable");
</script>

<div data-testid="keyboard-fixture">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Account</DropdownMenu.Trigger
    >
    <DropdownMenu.Content>
      <DropdownMenu.Group>
        <DropdownMenu.GroupHeading>My account</DropdownMenu.GroupHeading>
        <DropdownMenu.Item>
          <User aria-hidden="true" />Profile
          <DropdownMenu.Shortcut>Shift Cmd P</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <CreditCard aria-hidden="true" />Billing
          <DropdownMenu.Shortcut>Cmd B</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <Gear aria-hidden="true" />Settings
          <DropdownMenu.Shortcut>Cmd S</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.CheckboxItem bind:checked={statusBar}
        >Show status bar</DropdownMenu.CheckboxItem
      >
      <DropdownMenu.Separator />
      <DropdownMenu.Group>
        <DropdownMenu.GroupHeading>Density</DropdownMenu.GroupHeading>
        <DropdownMenu.RadioGroup bind:value={density}>
          <DropdownMenu.RadioItem value="comfortable"
            >Comfortable</DropdownMenu.RadioItem
          >
          <DropdownMenu.RadioItem value="compact"
            >Compact</DropdownMenu.RadioItem
          >
          <DropdownMenu.RadioItem value="dense">Dense</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>Invite users</DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
          <DropdownMenu.Item>Email</DropdownMenu.Item>
          <DropdownMenu.Item>Message</DropdownMenu.Item>
          <DropdownMenu.Item>Copy a link</DropdownMenu.Item>
        </DropdownMenu.SubContent>
      </DropdownMenu.Sub>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="destructive">
        <SignOut aria-hidden="true" />Sign out
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
<p class="mt-6 max-w-prose text-sm text-muted-foreground">
  Tab from the open menu moves to the next stop after the trigger, this
  <a href="#variants" class="text-primary underline underline-offset-4"
    >link back to the variants</a
  >. bits-ui closes the menu only when there is a next stop: a trigger that is
  the page's last stop keeps its menu open on Tab and parks focus on the body,
  so give a menu something after it.
</p>
