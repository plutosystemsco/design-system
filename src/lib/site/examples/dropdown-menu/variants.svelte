<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A menu opened from a button, on the popover's chrome: the elevation shadow alone, 256 px wide at least, 32 px items on the accent inset when highlighted. The arrow keys move, Home and End jump, typing finds, Right opens a submenu, Escape closes and returns focus. Account is named by its group heading; Edit has inset rows where some have no icon; More actions is named by label, with no heading.",
    frameMinHeight: 520,
  };
</script>

<script lang="ts">
  import ArrowClockwise from "phosphor-svelte/lib/ArrowClockwise";
  import ArrowCounterClockwise from "phosphor-svelte/lib/ArrowCounterClockwise";
  import CreditCard from "phosphor-svelte/lib/CreditCard";
  import Gear from "phosphor-svelte/lib/Gear";
  import SignOut from "phosphor-svelte/lib/SignOut";
  import Trash from "phosphor-svelte/lib/Trash";
  import User from "phosphor-svelte/lib/User";
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";

  let statusBar = $state(true);
  let density = $state("comfortable");
</script>

<div class="flex flex-wrap items-start gap-8">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      data-testid="menu-account"
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
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      data-testid="menu-edit"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Edit</DropdownMenu.Trigger
    >
    <DropdownMenu.Content label="Edit">
      <DropdownMenu.Item>
        <ArrowCounterClockwise aria-hidden="true" />Undo
        <DropdownMenu.Shortcut>Cmd Z</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <ArrowClockwise aria-hidden="true" />Redo
        <DropdownMenu.Shortcut>Shift Cmd Z</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item inset>Cut</DropdownMenu.Item>
      <DropdownMenu.Item inset>Copy</DropdownMenu.Item>
      <DropdownMenu.Item inset>Paste</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      data-testid="menu-more"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >More actions</DropdownMenu.Trigger
    >
    <DropdownMenu.Content label="More actions">
      <DropdownMenu.Item>Rename</DropdownMenu.Item>
      <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="destructive">
        <Trash aria-hidden="true" />Delete project
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
