<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the trigger. Enter opens the dialog with focus on its first stop; Escape closes it and returns focus to the trigger.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Popover from "#lib/registry/ui/popover";
</script>

<div data-testid="keyboard-fixture">
  <Popover.Root>
    <Popover.Trigger
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
</div>
