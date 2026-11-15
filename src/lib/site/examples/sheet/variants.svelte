<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A modal panel fixed to one edge of the screen, 288 px wide on a side, behind the scrim, on the elevation shadow alone. It fades in and out over the micro budget: no slide. Focus moves inside, loops, and returns to the trigger when it closes. From the start: the end side with a nav, the start side, the bottom with a form, the bottom with a long body, the top, and a sheet named by label with no title.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Field from "#lib/registry/ui/field";
  import * as Sheet from "#lib/registry/ui/sheet";
  import { Textarea } from "#lib/registry/ui/textarea";

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

<div class="flex flex-wrap items-start gap-8">
  <Sheet.Root>
    <Sheet.Trigger
      data-testid="sheet-end"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
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
  <Sheet.Root>
    <Sheet.Trigger
      data-testid="sheet-start"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Open filters</Sheet.Trigger
    >
    <Sheet.Content side="start">
      <Sheet.Header>
        <Sheet.Title>Filters</Sheet.Title>
        <Sheet.Description>Narrow the list of runs.</Sheet.Description>
      </Sheet.Header>
      <p class="text-sm">Filter by status, owner and date.</p>
    </Sheet.Content>
  </Sheet.Root>
  <Sheet.Root>
    <Sheet.Trigger
      data-testid="sheet-bottom"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Add a note</Sheet.Trigger
    >
    <Sheet.Content side="bottom">
      <Sheet.Header>
        <Sheet.Title>Add a note</Sheet.Title>
        <Sheet.Description>Kept with this run.</Sheet.Description>
      </Sheet.Header>
      <form class="grid gap-4" onsubmit={(e) => e.preventDefault()}>
        <Field.Field>
          <Field.Label>Note</Field.Label>
          <Textarea rows={3} />
        </Field.Field>
        <Sheet.Footer>
          <Sheet.Close class={buttonVariants({ variant: "secondary" })}
            >Cancel</Sheet.Close
          >
          <Button type="submit">Save note</Button>
        </Sheet.Footer>
      </form>
    </Sheet.Content>
  </Sheet.Root>
  <Sheet.Root>
    <Sheet.Trigger
      data-testid="sheet-long"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Read the run's notes</Sheet.Trigger
    >
    <Sheet.Content side="bottom">
      <Sheet.Header>
        <Sheet.Title>Run notes</Sheet.Title>
        <Sheet.Description>Everything the run reported.</Sheet.Description>
      </Sheet.Header>
      <div class="grid gap-4 text-sm">
        {#each Array.from({ length: 16 }, (_, i) => i + 1) as n (n)}
          <p>
            {n}. Every run is given a fuel budget. A program that spends it is
            stopped, and the output so far is kept.
          </p>
        {/each}
      </div>
    </Sheet.Content>
  </Sheet.Root>
  <Sheet.Root>
    <Sheet.Trigger
      data-testid="sheet-top"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Show announcement</Sheet.Trigger
    >
    <Sheet.Content side="top">
      <Sheet.Header>
        <Sheet.Title>Announcement</Sheet.Title>
        <Sheet.Description
          >The sandbox gets Python 3.13 this week.</Sheet.Description
        >
      </Sheet.Header>
    </Sheet.Content>
  </Sheet.Root>
  <Sheet.Root>
    <Sheet.Trigger
      data-testid="sheet-label"
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >Open the quick note</Sheet.Trigger
    >
    <Sheet.Content label="Quick note">
      <p class="text-sm">
        A run may spend 30 billion instructions. When the budget is spent the
        run is stopped, and the output so far is kept.
      </p>
    </Sheet.Content>
  </Sheet.Root>
</div>
