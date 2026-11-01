<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as Popover from "#lib/registry/ui/popover";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="popover" />

{#snippet fuel(testid: string | undefined)}
  <Popover.Root>
    <Popover.Trigger
      data-testid={testid}
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Fuel</Popover.Trigger
    >
    <Popover.Content>
      <Popover.Header>
        <Popover.Title>Fuel</Popover.Title>
        <Popover.Description>
          Fuel is the budget of instructions a run may spend. A run that spends
          it all is stopped, and the output so far is kept.
        </Popover.Description>
      </Popover.Header>
      <a href="/" class="text-primary underline underline-offset-4"
        >Browse the components</a
      >
    </Popover.Content>
  </Popover.Root>
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A small dialog anchored to its button, 256 px wide, on the elevation shadow alone: in light a soft shadow, in dark the hairline. It fades in and out over the micro budget. A popover has a name: its title, or the label prop."
>
  <div class="flex flex-wrap items-start gap-8">
    <Specimen caption="named by its title">
      {@render fuel("popover-fuel")}
    </Specimen>
    <Specimen caption="a form · named by label">
      <Popover.Root>
        <Popover.Trigger
          data-testid="popover-form"
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >Invite</Popover.Trigger
        >
        <Popover.Content label="Invite a collaborator">
          <form class="grid gap-4" onsubmit={(e) => e.preventDefault()}>
            <Field.Field>
              <Field.Label>Name</Field.Label>
              <Input autocomplete="off" />
            </Field.Field>
            <Field.Field>
              <Field.Label>Email address</Field.Label>
              <Input type="email" autocomplete="off" />
            </Field.Field>
            <Button type="submit" size="sm">Send invite</Button>
          </form>
        </Popover.Content>
      </Popover.Root>
    </Specimen>
    <Specimen caption="align start · one sentence · named by label">
      <Popover.Root>
        <Popover.Trigger
          data-testid="popover-start"
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >About the limit</Popover.Trigger
        >
        <Popover.Content align="start" label="About the limit">
          A run may spend 30 billion instructions.
        </Popover.Content>
      </Popover.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Closed until its trigger is pressed, which says aria-expanded. Open, focus moves to the first stop inside and loops; Escape or a click outside closes it and focus returns to the trigger."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    No border: the elevation shadow already draws the hairline as a spread
    layer, and a border would draw it twice.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The trigger promises a dialog (<code>aria-haspopup="dialog"</code>); the
      content keeps the promise with <code>role="dialog"</code>.
    </li>
    <li>
      <strong>Every popover has a name.</strong> A <code>Popover.Title</code>
      inside it names it through <code>aria-labelledby</code>; without one, pass
      <code>label</code>. One of the two is mandatory, and the type checker
      cannot enforce it, so the tests open each popover under axe.
    </li>
    <li>
      The title is a heading, level 2 by default; pass <code>level</code> to fit the
      page's outline.
    </li>
    <li>
      Focus moves to the first tabbable element inside on open and loops within;
      Escape closes it and returns focus to the trigger.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the trigger. Enter opens the dialog with focus on its first stop; Escape closes it and returns focus to the trigger."
>
  <div data-testid="keyboard-fixture">{@render fuel(undefined)}</div>
</PreviewSection>
