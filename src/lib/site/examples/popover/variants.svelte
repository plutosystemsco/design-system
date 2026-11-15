<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A small dialog anchored to its button, 256 px wide, on the elevation shadow alone: in light a soft shadow, in dark the hairline. It fades in and out over the micro budget. A popover has a name: its title, or the label prop.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as Popover from "#lib/registry/ui/popover";
</script>

<div class="flex flex-wrap items-start gap-8">
  <Popover.Root>
    <Popover.Trigger
      data-testid="popover-fuel"
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
</div>
