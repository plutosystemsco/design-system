<script lang="ts" module>
  export const meta = {
    title: "An ink surface",
    intro:
      "Put dark and surface-ink on any element. Inside it every token is the dark theme's, in both page themes. The code ground equals the surface, so a code block or an editor sits flush with it, and a highlighted line, as an editor's active line, takes the muted step. Overlays opened inside land inside it; a modal stays the page's.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import * as Dialog from "#lib/registry/ui/dialog";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import { Meter } from "#lib/registry/ui/meter";
  import * as Popover from "#lib/registry/ui/popover";
  import * as Tabs from "#lib/registry/ui/tabs";
  import type { ThemeData } from "./data.server";
  import { SURFACE_CODE } from "./surface-code";

  let { data }: { data: ThemeData } = $props();

  // 024d: a still specimen, not a live editor, so the page loads no
  // CodeMirror and no tree-sitter. The lines are highlighted at prerender;
  // the third is the highlighted line, on the active line's ground.
  const lines = $derived(data.surface ?? SURFACE_CODE.split("\n"));
  const ACTIVE = 2;
  // The surface element is the portal target for every overlay opened
  // inside it.
  let surface: HTMLElement | undefined = $state();
  let verbose = $state(true);
</script>

<section
  bind:this={surface}
  data-testid="keyboard-fixture"
  class="dark surface-ink rounded border border-border p-6"
>
  <BitsConfig defaultPortalTo={surface}>
    <div class="grid gap-6 lg:grid-cols-2">
      <div class="grid min-w-0 content-start gap-2">
        <CodeBlock.Root data-testid="surface-specimen">
          <CodeBlock.Content
            lineNumbers
            role="region"
            aria-label="Numbered code on the ink surface"
          >
            {#each lines as line, index (index)}
              <CodeBlock.Line
                code={line}
                variant={index === ACTIVE ? "highlighted" : "default"}
              />
            {/each}
          </CodeBlock.Content>
        </CodeBlock.Root>
        <p class="text-sm text-muted-foreground" data-testid="inline-surface">
          The code ground is the surface, edged by the hairline, as inline <code
            >code</code
          > is. Line 3 is highlighted: one step up, the ground an editor's active
          line takes.
        </p>
      </div>
      <CodeBlock.Root data-testid="surface-block">
        <CodeBlock.Header>
          <CodeBlock.Title>darts.py</CodeBlock.Title>
          <CodeBlock.Actions>
            <CodeBlock.CopyButton code={SURFACE_CODE} />
          </CodeBlock.Actions>
        </CodeBlock.Header>
        <CodeBlock.Content
          lines={data.surface ?? undefined}
          role="region"
          aria-label="Code on the ink surface"
        />
      </CodeBlock.Root>
    </div>
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <Tabs.Root value="output" class="w-full">
        <Tabs.List>
          <Tabs.Trigger value="output">Output</Tabs.Trigger>
          <Tabs.Trigger value="fuel">Fuel</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="output" tabindex={-1}
          >pi is about 3.142</Tabs.Content
        >
        <Tabs.Content value="fuel" tabindex={-1}
          >4.81 billion instructions of 30 billion.</Tabs.Content
        >
      </Tabs.Root>
      <div class="grid content-start gap-2">
        <div class="flex items-baseline justify-between gap-4">
          <Label for="surface-fuel">Fuel</Label>
          <span class="font-mono text-sm text-muted-foreground"
            >4.81 billion instructions of 30 billion</span
          >
        </div>
        <Meter
          id="surface-fuel"
          value={4.81}
          max={30}
          valuetext="4.81 billion instructions of 30 billion"
        />
      </div>
    </div>
    <div class="mt-6 flex flex-wrap items-center gap-3">
      <Popover.Root>
        <Popover.Trigger
          data-testid="surface-popover"
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >About fuel</Popover.Trigger
        >
        <Popover.Content>
          <Popover.Header>
            <Popover.Title>Fuel</Popover.Title>
            <Popover.Description>
              Fuel is the budget of instructions a run may spend. This popover
              opened inside the surface, so it takes the surface's theme.
            </Popover.Description>
          </Popover.Header>
        </Popover.Content>
      </Popover.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          data-testid="surface-menu"
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >Run options</DropdownMenu.Trigger
        >
        <DropdownMenu.Content label="Run options">
          <DropdownMenu.CheckboxItem bind:checked={verbose}
            >Show every step</DropdownMenu.CheckboxItem
          >
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Run again</DropdownMenu.Item>
          <DropdownMenu.Item>Copy the output</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Dialog.Root>
        <Dialog.Trigger
          data-testid="surface-dialog"
          class={buttonVariants({ variant: "secondary", size: "sm" })}
          >Rename run</Dialog.Trigger
        >
        <Dialog.Content portalProps={{ to: "body" }}>
          <Dialog.Header>
            <Dialog.Title>Rename run</Dialog.Title>
            <Dialog.Description
              >A modal belongs to the page, not to the surface its trigger sits
              in: it opens in the page's theme, over the page's scrim.</Dialog.Description
            >
          </Dialog.Header>
          <form class="grid gap-6" onsubmit={(e) => e.preventDefault()}>
            <Field.Field>
              <Field.Label>Name</Field.Label>
              <Input value="darts" autocomplete="off" />
            </Field.Field>
            <Dialog.Footer>
              <Dialog.Close class={buttonVariants({ variant: "secondary" })}
                >Cancel</Dialog.Close
              >
              <Button type="submit">Save</Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  </BitsConfig>
</section>
