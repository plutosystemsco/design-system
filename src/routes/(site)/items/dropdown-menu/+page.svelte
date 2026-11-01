<script lang="ts">
  import ArrowCounterClockwise from "phosphor-svelte/lib/ArrowCounterClockwise";
  import ArrowClockwise from "phosphor-svelte/lib/ArrowClockwise";
  import CreditCard from "phosphor-svelte/lib/CreditCard";
  import Gear from "phosphor-svelte/lib/Gear";
  import SignOut from "phosphor-svelte/lib/SignOut";
  import Trash from "phosphor-svelte/lib/Trash";
  import User from "phosphor-svelte/lib/User";
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  let statusBar = $state(true);
  let density = $state("comfortable");
</script>

<ItemHeader name="dropdown-menu" />

{#snippet account(testid: string | undefined)}
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      data-testid={testid}
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
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A menu opened from a button, on the popover's chrome: the elevation shadow alone, 256 px wide at least, 32 px items on the accent inset when highlighted. The arrow keys move, Home and End jump, typing finds, Right opens a submenu, Escape closes and returns focus."
>
  <div class="flex flex-wrap items-start gap-8">
    <Specimen caption="the account menu, named by its group heading">
      {@render account("menu-account")}
    </Specimen>
    <Specimen caption="inset items, where some rows have no icon">
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
    </Specimen>
    <Specimen caption="named by label, with no heading">
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
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Hover and keyboard focus are one state, the accent inset; the focused item also carries the global ring, so a keyboard user can tell focus from the pointer. A checked item shows its check at the start. A destructive item is red text on the same inset, with no tint."
>
  <ul
    class="grid max-w-prose list-disc gap-2 pl-6 text-sm text-muted-foreground"
  >
    <li>
      A destructive item carries an icon or a telling word ("Delete project",
      never a lone "Delete"): red text alone tells the state by colour.
    </li>
    <li>
      The shortcut is words ("Shift Cmd P"), hidden from the item's name, and
      binds nothing. An app that shows one binds the key itself and sets
      <code>aria-keyshortcuts</code> on the item.
    </li>
    <li>
      A disabled item is <code>aria-disabled</code> and the arrow keys skip it.
    </li>
  </ul>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The trigger promises a menu (<code>aria-haspopup="menu"</code>) and says
      whether it is open (<code>aria-expanded</code>); the content is
      <code>role="menu"</code> with <code>menuitem</code>,
      <code>menuitemcheckbox</code>, <code>menuitemradio</code> and
      <code>separator</code> items.
    </li>
    <li>
      <strong>A menu is named.</strong> A <code>GroupHeading</code> inside a
      <code>Group</code> names the group, and the menu is named by its trigger;
      a menu with no heading passes <code>label</code> to its content. There is no
      Label part: a loose line of text names nothing.
    </li>
    <li>
      Enter, Space and ArrowDown open the menu with focus on the first item; the
      arrows loop; Home and End jump; Right opens a submenu and Left closes it;
      Escape closes and returns focus to the trigger; Tab closes and moves on.
    </li>
    <li>Icons are hidden from assistive technology; the text is the name.</li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the trigger. Enter opens the menu with focus on its first item; ArrowDown moves; Escape closes and returns focus to the trigger; Tab from the open menu closes it."
>
  <div data-testid="keyboard-fixture">{@render account(undefined)}</div>
  <p class="mt-6 max-w-prose text-sm text-muted-foreground">
    Tab from the open menu moves to the next stop after the trigger, this
    <a href="#variants" class="text-primary underline underline-offset-4"
      >link back to the variants</a
    >. bits-ui closes the menu only when there is a next stop: a trigger that is
    the page's last stop keeps its menu open on Tab and parks focus on the body,
    so give a menu something after it.
  </p>
</PreviewSection>
