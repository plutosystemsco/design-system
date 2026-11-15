<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the trigger. Enter opens the sheet with focus on its first link; Tab reaches the close button last and loops; Escape closes it and focus returns to the trigger.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Sheet from "#lib/registry/ui/sheet";

  const links = [
    ["Overview", "/"],
    ["Components", "/#group-actions"],
    ["Blocks", "/#group-blocks"],
    [
      "Changelog",
      "https://github.com/plutosystemsco/design-system/blob/main/CHANGELOG.md",
    ],
  ];
</script>

<div data-testid="keyboard-fixture">
  <Sheet.Root>
    <Sheet.Trigger class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Open navigation</Sheet.Trigger
    >
    <Sheet.Content>
      <Sheet.Header>
        <Sheet.Title>Navigation</Sheet.Title>
        <Sheet.Description>Where to go next.</Sheet.Description>
      </Sheet.Header>
      <nav aria-label="Sheet pages">
        <ul class="grid gap-2">
          {#each links as [label, href] (label)}
            <li>
              <a
                {href}
                class="flex h-12 items-center rounded px-3 hover:bg-accent hover:text-accent-foreground"
                >{label}</a
              >
            </li>
          {/each}
        </ul>
      </nav>
    </Sheet.Content>
  </Sheet.Root>
</div>
