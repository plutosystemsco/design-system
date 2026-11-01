<script lang="ts">
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Field from "#lib/registry/ui/field";
  import * as Sheet from "#lib/registry/ui/sheet";
  import { Textarea } from "#lib/registry/ui/textarea";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

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

<ItemHeader name="sheet" />

{#snippet navigation(testid: string | undefined)}
  <Sheet.Root>
    <Sheet.Trigger
      data-testid={testid}
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
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A modal panel fixed to one edge of the screen, 288 px wide on a side, behind the scrim, on the elevation shadow alone. It fades in and out over the micro budget: no slide. Focus moves inside, loops, and returns to the trigger when it closes."
>
  <div class="flex flex-wrap items-start gap-8">
    <Specimen caption="end, with a title, a description and a nav">
      {@render navigation("sheet-end")}
    </Specimen>
    <Specimen caption="start">
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
          <p class="text-sm">Status, owner and date go here.</p>
        </Sheet.Content>
      </Sheet.Root>
    </Specimen>
    <Specimen caption="bottom, with a form">
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
    </Specimen>
    <Specimen caption="bottom, with a long body">
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
                {n}. Every run is given a fuel budget. A program that spends it
                is stopped, and the output so far is kept.
              </p>
            {/each}
          </div>
        </Sheet.Content>
      </Sheet.Root>
    </Specimen>
    <Specimen caption="top">
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
    </Specimen>
    <Specimen caption="named by label, with no title">
      <Sheet.Root>
        <Sheet.Trigger
          data-testid="sheet-label"
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >Open the quick note</Sheet.Trigger
        >
        <Sheet.Content label="Quick note">
          <p class="text-sm">
            A run may spend 30 billion instructions. When the budget is spent
            the run is stopped, and the output so far is kept.
          </p>
        </Sheet.Content>
      </Sheet.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Closed until its trigger is pressed, which says aria-expanded. Open, the page behind is dimmed by the scrim and blocked; Escape, a click on the scrim or the close button closes it, and the panel holds for the fade before it leaves."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    No border on the page edge: the elevation shadow draws the hairline. A long
    body scrolls inside the panel.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>role="dialog"</code> with <code>aria-modal="true"</code>, named by
      its title and described by its description.
    </li>
    <li>
      <strong>A name is required.</strong> A <code>Sheet.Title</code> inside the
      content names it; without one, pass <code>label</code>. One of the two is
      mandatory, and the type checker cannot enforce it, so the tests open each
      sheet under axe.
    </li>
    <li>
      The title is a heading, level 2 by default; pass <code>level</code> to fit the
      page's outline.
    </li>
    <li>
      Focus moves to the first tabbable element inside on open and loops; the
      close button, 32 px, is the last stop; Escape closes it and returns focus
      to the trigger.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the trigger. Enter opens the sheet with focus on its first link; Tab reaches the close button last and loops; Escape closes it and focus returns to the trigger."
>
  <div data-testid="keyboard-fixture">{@render navigation(undefined)}</div>
</PreviewSection>
