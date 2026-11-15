<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
  import { FourDot } from "#lib/registry/ui/four-dot";
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { CodeEditor, pythonSetup } from "#lib/registry/ui/code-editor";
  import * as Dialog from "#lib/registry/ui/dialog";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import { Meter } from "#lib/registry/ui/meter";
  import * as Popover from "#lib/registry/ui/popover";
  import * as Tabs from "#lib/registry/ui/tabs";
  import Eyebrow from "#lib/preview/eyebrow.svelte";
  import InstallCommand from "#lib/preview/install-command.svelte";
  import ContrastTable from "#lib/preview/contrast-table.svelte";
  import { SURFACE_CODE } from "./surface";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // 014 decision 11: the two code-only grounds, with their values.
  const codeGrounds = $derived(
    data.swatches.filter((s) =>
      ["syntax-ground", "syntax-active-line"].includes(s.name),
    ),
  );

  // The ink surface (007 decision 9): one preset, made once; the surface
  // element is the portal target for every overlay opened inside it.
  const python = pythonSetup();
  let surfaceCode = $state(SURFACE_CODE);
  let surface: HTMLElement | undefined = $state();
  let verbose = $state(true);

  const MOTION = ["press", "slide", "busy", "reveal", "fill"] as const;

  // 011 decision 13: the four fields, their class names written out so
  // Tailwind finds them in this file, and the colour each is named for.
  const FIELDS = [
    { n: 1, cls: "field-1", name: "Blue" },
    { n: 2, cls: "field-2", name: "Red" },
    { n: 3, cls: "field-3", name: "Yellow" },
    { n: 4, cls: "field-4", name: "Green" },
  ] as const;
  // Bumped by the replay button: the keyed mark remounts and enters again.
  let replays = $state(0);

  // Class names are written out so Tailwind finds them in this file.
  const sizes: Record<string, { cls: string; font: string }> = {
    xs: {
      cls: "text-xs",
      font: "font-mono font-medium lowercase tracking-eyebrow",
    },
    sm: { cls: "text-sm", font: "font-mono" },
    base: { cls: "text-base", font: "font-sans" },
    "2xl": { cls: "text-2xl", font: "font-heading font-bold tracking-section" },
    "5xl": { cls: "text-5xl", font: "font-heading font-bold tracking-display" },
  };
  const padding = [
    "p-1",
    "p-2",
    "p-3",
    "p-4",
    "p-6",
    "p-8",
    "p-12",
    "p-16",
    "p-24",
  ];
  const radii = [
    "rounded",
    "rounded-xs",
    "rounded-sm",
    "rounded-md",
    "rounded-lg",
    "rounded-xl",
    "rounded-2xl",
    "rounded-3xl",
    "rounded-4xl",
    "rounded-full",
  ];
</script>

<svelte:head
  ><title>Pluto theme · Pluto Systems design system</title></svelte:head
>

<Eyebrow>registry:theme · pluto-theme</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">Pluto theme</h1>
<p class="mt-4 max-w-prose text-muted-foreground">
  Every colour and size the brand uses, for light and dark, from one token file.
  Installing it brings the three font items too.
</p>
<div class="mt-6"><InstallCommand name="pluto-theme" /></div>

<section class="mt-16" aria-labelledby="colours">
  <h2 id="colours" class="text-2xl font-bold tracking-section">Colours</h2>
  <p class="mt-2 text-muted-foreground">
    The {data.swatches.length} semantic tokens in the current theme. Components use
    only these.
  </p>
  <ul class="mt-6 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.swatches as swatch (swatch.name)}
      <li class="flex items-center gap-3">
        <span
          aria-hidden="true"
          class="size-8 shrink-0 rounded border border-input"
          style="background-color: var(--{swatch.name})"
        ></span>
        <span class="flex flex-col">
          <code class="text-sm">{swatch.name}</code>
          <span class="font-mono text-xs text-muted-foreground">
            <span class="dark:hidden">{swatch.light}</span>
            <span class="hidden dark:inline">{swatch.dark}</span>
          </span>
        </span>
      </li>
    {/each}
  </ul>
</section>

<section class="mt-16" aria-labelledby="contrast">
  <h2 id="contrast" class="text-2xl font-bold tracking-section">Contrast</h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    WCAG 2.2 ratios, truncated to two decimals. Text needs 4.5, non-text 3.
    Tints composite at 10% in light and 20% in dark. Amber is the one known
    exception: an amber series is labelled directly.
  </p>
  <div class="mt-6 dark:hidden">
    <ContrastTable rows={data.contrast.light} caption="Light theme" />
  </div>
  <div class="mt-6 hidden dark:block">
    <ContrastTable rows={data.contrast.dark} caption="Dark theme" />
  </div>
  <h3 class="mt-8 text-base font-bold">Forbidden: state tints on muted</h3>
  <p class="mt-2 max-w-prose text-sm text-muted-foreground">
    Forbidden by rule. The light row is the measured witness and stays below
    4.5; the dark pairs pass on this palette and stay forbidden all the same.
  </p>
  <ul class="mt-2 grid gap-1 text-sm">
    {#each data.forbidden as row (row.theme + row.label)}
      <li>
        <code>{row.theme}</code> · {row.label} · <code>{row.bg}</code> · {row.ruleOnly
          ? "by rule"
          : row.ratio.toFixed(2)}
      </li>
    {/each}
  </ul>
</section>

<section class="mt-16" aria-labelledby="elevation">
  <h2 id="elevation" class="text-2xl font-bold tracking-section">
    Elevation and scrim
  </h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    Menus and dialogs only. Product screens are flat: in both themes an overlay
    is told from the page by its edge alone, a hairline at the input's strength,
    with no shadow. The shadow layer stays in the utility, clear, so its shape
    is the same in both themes. The scrim dims the page behind a modal dialog.
  </p>
  <div class="mt-6 flex flex-wrap items-start gap-12">
    <div class="flex flex-col items-start gap-2">
      <div
        data-token="shadow-elevation"
        class="rounded bg-popover p-6 text-popover-foreground shadow-elevation"
      >
        An elevated surface.
      </div>
      <code class="text-xs">shadow-elevation</code>
    </div>
    <div class="flex flex-col items-start gap-2">
      <span
        data-token="bg-scrim"
        aria-hidden="true"
        class="block size-24 rounded border border-border bg-scrim"
      ></span>
      <code class="text-xs">bg-scrim</code>
    </div>
  </div>
  <table class="mt-8 w-full border-collapse text-left text-sm">
    <caption
      class="mb-2 text-left font-mono text-xs text-muted-foreground lowercase"
    >
      Edges over the scrim · {data.scrim.length} rows
    </caption>
    <thead>
      <tr class="border-b border-border">
        <th scope="col" class="py-2 pr-3 font-medium">Theme</th>
        <th scope="col" class="py-2 pr-3 font-medium">Edge</th>
        <th scope="col" class="py-2 pr-3 font-medium">Over</th>
        <th scope="col" class="py-2 pr-3 font-medium">Scrimmed ground</th>
        <th scope="col" class="py-2 pr-3 font-medium">Ratio</th>
        <th scope="col" class="py-2 font-medium">Minimum</th>
      </tr>
    </thead>
    <tbody>
      {#each data.scrim as row (row.theme + row.over)}
        <tr class="border-b border-border">
          <td class="py-1 pr-3">{row.theme}</td>
          <td class="py-1 pr-3"><code>{row.edge}</code> {row.edgeHex}</td>
          <td class="py-1 pr-3"><code>{row.over}</code></td>
          <td class="py-1 pr-3 font-mono">{row.scrimmed}</td>
          <td class="py-1 pr-3 font-mono">{row.ratio.toFixed(2)}</td>
          <td class="py-1 font-mono">{row.min}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<section class="mt-16" aria-labelledby="type">
  <h2 id="type" class="text-2xl font-bold tracking-section">Type</h2>
  <ul class="mt-6 grid gap-6">
    {#each data.scale as step (step.step)}
      <li class="groove pt-3">
        <p class="font-mono text-xs text-muted-foreground">
          text-{step.step} · {step.px}px / {step.lineHeight}
        </p>
        <p
          data-token="text-{step.step}"
          class="mt-1 {sizes[step.step].cls} {sizes[step.step].font}"
        >
          Pluto Systems
        </p>
      </li>
    {/each}
  </ul>
  <p class="mt-6 text-sm text-muted-foreground">
    Tracking: display {data.tracking.display} em, section {data.tracking
      .section} em, eyebrow {data.tracking.eyebrow} em, mark {data.tracking
      .mark} em.
  </p>
</section>

<section class="mt-16" aria-labelledby="spacing">
  <h2 id="spacing" class="text-2xl font-bold tracking-section">Spacing</h2>
  <p class="mt-2 text-muted-foreground">
    A {data.spacing.atom} px atom; the ladder is {data.spacing.ladder.join(
      ", ",
    )}. Each square is padded by one step on every side.
  </p>
  <ul class="mt-6 flex flex-wrap items-end gap-6">
    {#each padding as cls, i (cls)}
      <li class="flex flex-col items-start gap-2">
        <span data-token={cls} class="block bg-primary {cls}" aria-hidden="true"
        ></span>
        <code class="text-xs">{cls} · {data.spacing.ladder[i]}px</code>
      </li>
    {/each}
  </ul>
</section>

<section class="mt-16" aria-labelledby="radius">
  <h2 id="radius" class="text-2xl font-bold tracking-section">Radius</h2>
  <p class="mt-2 text-muted-foreground">
    One case radius of {data.radius} px for every rounded class, and full round for
    dot-derived shapes.
  </p>
  <ul class="mt-6 flex flex-wrap gap-6">
    {#each radii as cls (cls)}
      <li class="flex flex-col items-start gap-2">
        <span
          data-token={cls}
          class="block size-12 border border-input bg-card {cls}"
          aria-hidden="true"
        ></span>
        <code class="text-xs">{cls}</code>
      </li>
    {/each}
  </ul>
</section>

<section class="mt-16" aria-labelledby="groove">
  <h2 id="groove" class="text-2xl font-bold tracking-section">Groove</h2>
  <p class="mt-2 text-muted-foreground">
    The one line primitive: a plain hairline, in both themes. Product screens
    are flat, so no highlight line sits beneath it.
  </p>
  <div class="groove mt-6 pt-4 text-sm text-muted-foreground">
    Content below a groove.
  </div>
</section>

<section class="mt-16" aria-labelledby="code">
  <h2 id="code" class="text-2xl font-bold tracking-section">Code and scroll</h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    Sixteen code roles, Meridian's in Tombaugh's colours, each a semantic
    colour, drive the code block and the editor as <code>text-code-*</code> and
    <code>bg-code-*</code> utilities. They are written into both theme blocks,
    so a dark subtree inside a light page takes the dark palette. The
    <code>scrollbar</code> utility colours a native scroll box's thumb and track
    from <code>input</code> and <code>muted</code>; the pattern is
    <code>overflow-auto scrollbar</code> with <code>tabindex="0"</code> and a
    label. The <code>scrollbar-code</code> utility is the same bar on the code ground,
    for a scroll box inside code.
  </p>
  <dl class="mt-4 grid gap-2 text-sm" data-testid="code-grounds">
    {#each codeGrounds as swatch (swatch.name)}
      <div class="flex flex-wrap items-center gap-2">
        <dt><code>{swatch.name}</code></dt>
        <dd class="font-mono text-xs text-muted-foreground">
          <span class="dark:hidden">{swatch.light}</span>
          <span class="hidden dark:inline">{swatch.dark}</span>
          {swatch.name === "syntax-ground"
            ? "· the code ground, --code-background"
            : "· the active line, --code-active-line"}
        </dd>
      </div>
    {/each}
  </dl>
  <div class="mt-6 flex flex-wrap items-start gap-12">
    <div class="flex flex-col items-start gap-2">
      <pre
        class="rounded border border-border bg-code-background px-4 py-3 font-mono text-sm text-code-text"><code
          ><span data-token="text-code-keyword" class="text-code-keyword"
            >def</span
          > <span class="text-code-function">area</span>(r):
<span
            data-token="bg-code-active-line"
            class="block bg-code-active-line">    <span
              class="text-code-keyword">return</span
            > <span class="text-code-number">3.14159</span> * r ** <span
              class="text-code-number">2</span
            >  <span class="text-code-comment"># a circle</span></span
          ></code
        ></pre>
      <code class="text-xs">text-code-keyword · bg-code-active-line</code>
    </div>
    <div class="flex flex-col items-start gap-2">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div
        data-token="scrollbar"
        role="region"
        aria-label="A scroll box"
        tabindex="0"
        class="w-64 overflow-auto rounded border border-border bg-card p-3 text-sm whitespace-nowrap scrollbar"
      >
        A native scroll box whose scrollbar takes the input colour on the muted
        track. This line is longer than the box so that it scrolls.
      </div>
      <code class="text-xs">overflow-auto scrollbar</code>
    </div>
    <div class="flex flex-col items-start gap-2">
      <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
      <div
        data-token="scrollbar-code"
        role="region"
        aria-label="A scroll box on the code ground"
        tabindex="0"
        class="w-64 overflow-auto rounded border border-border bg-code-background p-3 font-mono text-sm whitespace-nowrap text-code-text scrollbar-code"
      >
        A scroll box inside code, whose track is the code ground. This line is
        longer than the box so that it scrolls.
      </div>
      <code class="text-xs">overflow-auto scrollbar-code</code>
    </div>
  </div>
</section>

<section class="mt-16" aria-labelledby="inline-code">
  <h2 id="inline-code" class="text-2xl font-bold tracking-section">
    Inline code
  </h2>
  <p class="mt-2 max-w-prose text-sm" data-testid="inline-p">
    A <code>code</code> element in running text, not inside a <code>pre</code>,
    is a chip on the code ground, edged by the hairline, as a block is: the case
    radius, 4 px of side padding and none above or below, so the line keeps its
    height. A long token such as
    <code>bunx --bun shadcn-svelte@1.7.1 add code-block code-editor -y</code>
    wraps, and each piece keeps its edge. Inside a link the chip takes the link's
    colour, as in
    <a
      href="#inline-code"
      class="text-primary underline underline-offset-4"
      data-testid="inline-link">the <code>scrollbar-code</code> utility</a
    >. A class an item sets on its own <code>code</code> wins.
  </p>
  <h3 class="mt-6 text-base font-bold" data-testid="inline-h3">
    No chip in a heading:
    <code>code:not(pre code, :is(h1, h2, h3, h4, h5, h6) code)</code>
  </h3>
  <p class="mt-2 max-w-prose text-sm text-muted-foreground">
    Code in a heading keeps the mono face and the heading's colour, size and
    weight. A chip would stand taller than a heading's tight line.
  </p>
  <div class="mt-6 grid max-w-prose gap-2">
    <p class="text-xs" data-testid="inline-line-xs">
      Run <code>bun test</code> in text-xs.
    </p>
    <p class="text-xs" data-testid="inline-twin-xs">
      Run <span class="font-mono">bun test</span> in text-xs.
    </p>
    <p class="text-sm" data-testid="inline-line-sm">
      Run <code>bun test</code> in text-sm.
    </p>
    <p class="text-sm" data-testid="inline-twin-sm">
      Run <span class="font-mono">bun test</span> in text-sm.
    </p>
    <p class="text-base" data-testid="inline-line-base">
      Run <code>bun test</code> in text-base.
    </p>
    <p class="text-base" data-testid="inline-twin-base">
      Run <span class="font-mono">bun test</span> in text-base.
    </p>
  </div>
  <Card.Root class="mt-6 max-w-prose">
    <Card.Content>
      <p class="text-sm" data-testid="inline-card">
        On a card the chip is white on white in light mode, told by its
        hairline:
        <code>--code-background</code>.
      </p>
    </Card.Content>
  </Card.Root>
</section>

<section class="mt-16" aria-labelledby="surface">
  <h2 id="surface" class="text-2xl font-bold tracking-section">
    An ink surface
  </h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    An ink surface is <code>class="dark surface-ink"</code> on any element.
    Inside it every token is the dark theme's; the code ground and the editor's
    ground equal the surface; the surface is graphite on a light page and
    <code>card</code> on a dark one; set <code>--background</code> on the
    surface to move all three. The <code>muted</code> insets keep their tint
    inside it: the pill tab strip, the meter's track, a skeleton, a hover row.
    Here a <code>dark</code> class is the dark theme on purpose, in both page themes.
  </p>
  <section
    bind:this={surface}
    data-testid="keyboard-fixture"
    class="dark surface-ink mt-6 rounded border border-border p-6"
  >
    <BitsConfig defaultPortalTo={surface}>
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="grid min-w-0 content-start gap-2">
          <CodeEditor
            bind:value={surfaceCode}
            label="Surface example"
            extensions={python}
          />
          <p class="text-sm text-muted-foreground" data-testid="inline-surface">
            The editor's ground is the surface, edged by the hairline, as inline <code
              >code</code
            > is. Tab leaves it.
          </p>
        </div>
        <CodeBlock.Root data-testid="surface-block">
          <CodeBlock.Header>
            <CodeBlock.Title>darts.py</CodeBlock.Title>
            <CodeBlock.Actions>
              <CodeBlock.CopyButton code={SURFACE_CODE} />
            </CodeBlock.Actions>
          </CodeBlock.Header>
          <CodeBlock.Content lines={data.surface ?? undefined} />
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
                >A modal belongs to the page, not to the surface its trigger
                sits in: it opens in the page's theme, over the page's scrim.</Dialog.Description
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
  <p class="mt-6 max-w-prose text-sm text-muted-foreground">
    Overlays: wrap the surface's content in
    <code>BitsConfig defaultPortalTo</code> with the surface element, and every
    popover, tooltip and menu opened inside lands inside it, themed like it, at
    the same position; a modal passes
    <code>portalProps={'{{ to: "body" }}'}</code> and stays the page's. The
    surface must carry no <code>transform</code>, <code>filter</code> or
    <code>contain</code>, or a portalled overlay inside it is clipped or
    re-anchored. The <code>.surface-ink</code> rule wins over
    <code>.dark</code> by source order, so it must stay after the
    <code>.dark</code> block in an app's stylesheet, as the install writes it.
  </p>
  <ul class="mt-4 grid max-w-prose list-disc gap-2 pl-6 text-sm">
    <li>
      The groove inside a surface is the dark hairline alone, paper at 10% over
      graphite.
    </li>
    <li>
      The focus ring inside a surface is the dark <code>ring</code>, 8.67:1 on
      graphite and 6.90:1 on its muted insets.
    </li>
    <li>
      A scroll box inside a surface draws its bar from the dark
      <code>input</code> on the dark <code>muted</code>, and
      <code>color-scheme</code> is dark, so native controls draw dark too. A code
      block's or editor's bar inside a surface draws its track on the surface itself.
    </li>
  </ul>
</section>

<section class="mt-16" aria-labelledby="motion">
  <h2 id="motion" class="text-2xl font-bold tracking-section">Motion</h2>
  <dl class="mt-6 grid gap-2 text-sm">
    <div class="flex flex-wrap gap-2">
      <dt class="text-muted-foreground">Entrance</dt>
      <dd><code>--motion-entrance</code> · {data.motion.entranceMs} ms</dd>
    </div>
    <div class="flex flex-wrap gap-2">
      <dt class="text-muted-foreground">Micro-feedback</dt>
      <dd><code>--motion-micro</code> · {data.motion.microMs} ms</dd>
    </div>
    <div class="flex flex-wrap gap-2">
      <dt class="text-muted-foreground">Entrance curve</dt>
      <dd>
        <code>ease-entrance</code> · cubic-bezier({data.motion.easeEntrance.join(
          ", ",
        )})
      </dd>
    </div>
  </dl>
  <p
    data-token="transition"
    class="mt-6 inline-block rounded border border-input bg-card px-3 py-2 text-sm transition hover:bg-accent"
  >
    A transition at the micro budget.
  </p>
</section>

<section class="mt-16" aria-labelledby="expressive">
  <h2 id="expressive" class="text-2xl font-bold tracking-section">
    Expressive mode
  </h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    A second voice on the same tokens, for home pages, launches and marketing
    sections. <code>data-mode="expressive"</code> on an element sets the mode's
    values for its subtree and <code>data-mode="productive"</code> resets them.
    The display steps, the press, the colour fields and the glass are named
    utilities. Only an item declared
    <code>["expressive"]</code> may use them (L22); every other rule binds both modes.
  </p>

  <h3 class="mt-8 text-base font-bold">The display steps</h3>
  <p class="mt-2 max-w-prose text-sm text-muted-foreground">
    <code>type-display</code>, <code>type-section</code> and
    <code>type-proof</code>: fluid sizes for headlines, section titles and
    figures. The display face is a slot, <code>--font-face-display</code>, the
    heading face today.
  </p>
  <div data-mode="expressive" class="mt-4 grid gap-4">
    <p data-testid="type-display" class="type-display">Work runs on data.</p>
    <p data-testid="type-section" class="type-section">One governed layer</p>
    <p data-testid="type-proof" class="type-proof">4.81B</p>
  </div>

  <h3 class="mt-8 text-base font-bold">One button, two volumes</h3>
  <p class="mt-2 max-w-prose text-sm text-muted-foreground">
    <code>button</code>'s corner reads <code>--radius-action</code>: one 8 px
    case radius in productive mode, in expressive mode and in a productive
    island inside it. Round is only for dot shapes. Other surfaces take the same
    radius with <code>rounded-action</code>.
  </p>
  <div class="mt-4 flex flex-wrap items-start gap-12">
    <figure data-testid="mode-productive" data-mode="productive">
      <Button>Save changes</Button>
      <figcaption class="mt-2">
        <code class="text-xs">productive</code>
      </figcaption>
    </figure>
    <figure data-testid="mode-expressive" data-mode="expressive">
      <Button>Save changes</Button>
      <figcaption class="mt-2">
        <code class="text-xs">expressive</code>
      </figcaption>
    </figure>
    <div data-mode="expressive">
      <figure data-testid="mode-island" data-mode="productive">
        <Button>Save changes</Button>
        <figcaption class="mt-2">
          <code class="text-xs">productive inside expressive</code>
        </figcaption>
      </figure>
    </div>
  </div>

  <div data-mode="expressive" data-testid="brand">
    <h3 class="mt-8 text-base font-bold">The poster step</h3>
    <p class="mt-2 max-w-prose text-sm text-muted-foreground">
      <code>type-poster</code>, for launches and campaigns only: 56 px on a
      phone, 12vw between, 160 px at most.
    </p>
    <p data-testid="type-poster" class="type-poster mt-4">Launch</p>

    <h3 class="mt-8 text-base font-bold">Colour fields</h3>
    <p class="mt-2 max-w-prose text-sm text-muted-foreground">
      <code>field-1</code> to <code>field-4</code>: a flat area of one brand
      colour, in the mark's order. Inside, the roles a heading, a paragraph, a
      link and the focus ring read are the field's legend, the one colour
      measured on it. An opaque surface carries <code>surface-plain</code> and
      gets the theme's own roles back; so does glass. A control sits on a
      surface or on glass, never on the field itself. The theme is set on
      <code>html</code>
      or on a wrapper outside the expressive subtree: a field never shares an element
      with <code>.dark</code>, and the dark theme's four-colour marks need
      <code>.dark</code> on or above the mode element (R25).
    </p>
    <div class="mt-4 grid gap-4 lg:grid-cols-2">
      {#each FIELDS as field (field.n)}
        <section
          data-testid="field-{field.n}"
          aria-labelledby="field-{field.n}-heading"
          class="{field.cls} grid gap-4 rounded p-6"
        >
          <h4
            id="field-{field.n}-heading"
            data-probe="heading"
            class="font-heading text-2xl font-bold text-foreground"
          >
            {field.name}, <code class="text-base">{field.cls}</code>
          </h4>
          <p data-probe="text" class="max-w-prose text-muted-foreground">
            Text on the field takes its legend. A link here is the legend too,
            underlined:
            <a
              data-probe="link"
              href="/items/card/"
              class="text-primary underline">the card a field holds</a
            >.
          </p>
          <Card.Root data-probe="card" class="surface-plain">
            <Card.Header>
              <Card.Title level={5} data-probe="card-title"
                >A card on the field</Card.Title
              >
              <Card.Description data-probe="card-description"
                >Its own ground and the theme's own roles.</Card.Description
              >
            </Card.Header>
            <Card.Content>
              <a
                data-probe="card-link"
                href="/items/card/"
                class="text-sm text-primary underline">Open the card's page</a
              >
            </Card.Content>
          </Card.Root>
          <div
            data-probe="glass"
            class="glass grid gap-1 p-4"
            {@attach pointerLight}
          >
            <p data-probe="glass-title" class="font-heading font-bold">
              Glass on the field
            </p>
            <p
              data-probe="glass-description"
              class="text-sm text-muted-foreground"
            >
              Frosted over the colour; its edge lights where the pointer moves.
            </p>
            <a
              data-probe="glass-link"
              href="/items/liquid-glass/"
              class="w-fit text-sm text-primary underline">Open liquid glass</a
            >
          </div>
        </section>
      {/each}
    </div>

    <h3 class="mt-8 text-base font-bold">Glass on the canvas</h3>
    <p class="mt-2 max-w-prose text-sm text-muted-foreground">
      <code>glass</code> with <code>pointerLight</code>: the same panel on the
      page's own ground. It carries <code>foreground</code>,
      <code>muted-foreground</code> and <code>primary</code> text only.
    </p>
    <div
      data-testid="glass-canvas"
      class="glass mt-4 grid max-w-prose gap-1 p-6"
      {@attach pointerLight}
    >
      <p class="font-heading font-bold">Work runs on data.</p>
      <p class="text-sm text-muted-foreground">
        One governed layer under every product.
      </p>
      <a
        href="/items/liquid-glass/"
        class="w-fit text-sm text-primary underline">How the glass is drawn</a
      >
    </div>

    <h3 class="mt-8 text-base font-bold">The spring</h3>
    <p class="mt-2 max-w-prose text-sm text-muted-foreground">
      The mark's dots dock on <code>--ease-spring</code>, overshooting slightly
      as they land; their opacity keeps the entrance curve. Only the dots spring
      (L23). In the dark theme an expressive page shows the mark's four colours.
    </p>
    <div class="mt-4 flex flex-wrap items-center gap-6">
      {#key replays}
        <FourDot entrance data-testid="spring-mark" class="text-5xl" />
      {/key}
      <Button variant="secondary" size="sm" onclick={() => replays++}
        >Replay the entrance</Button
      >
    </div>
  </div>

  <h3 class="mt-8 text-base font-bold">Fields and glass, measured</h3>
  {#each data.expressive.brand as set (set.theme)}
    <div
      class={set.theme === "light"
        ? "mt-4 grid gap-6 dark:hidden"
        : "mt-4 hidden gap-6 dark:grid"}
    >
      <ContrastTable
        rows={set.fields}
        caption="The fields: legend on fill, {set.theme}"
      />
      <ContrastTable
        rows={set.glass}
        caption="The glass: over each ground, its fallback and the ring, {set.theme}"
      />
    </div>
  {/each}

  <h3 class="mt-8 text-base font-bold">Display, motion and press</h3>
  <ul class="mt-4 grid gap-1 text-sm">
    {#each Object.entries(data.expressive.steps) as [step, value] (step)}
      <li>
        <code>type-{step}</code> · {value.minPx} to {value.maxPx} px at {value.vw}vw
        · {value.lineHeight} / {value.tracking} em · {value.weight}{value.tabular
          ? " · tabular figures"
          : ""}
      </li>
    {/each}
  </ul>
  <dl class="mt-4 grid gap-1 text-sm">
    {#each MOTION as name (name)}
      <div class="flex flex-wrap gap-2">
        <dt><code>--motion-{name}</code></dt>
        <dd>{data.expressive.motion[name]} ms</dd>
      </div>
    {/each}
    <div class="flex flex-wrap gap-2">
      <dt><code>--ease-standard</code></dt>
      <dd>cubic-bezier({data.expressive.motion.easeStandard.join(", ")})</dd>
    </div>
    <div class="flex flex-wrap gap-2">
      <dt><code>--motion-light</code></dt>
      <dd>{data.expressive.motion.light} ms</dd>
    </div>
    <div class="flex flex-wrap gap-2">
      <dt><code>--ease-spring</code></dt>
      <dd>
        a damped spring, ζ {data.expressive.motion.spring.dampingRatio}, as
        <code>linear()</code>
      </dd>
    </div>
    <div class="flex flex-wrap gap-2">
      <dt><code>--press-scale</code></dt>
      <dd>{data.expressive.motion.pressScale}, 1 under reduced motion</dd>
    </div>
  </dl>
  <button
    type="button"
    data-testid="press"
    class="action-press mt-4 rounded border border-input bg-card px-4 py-2 text-sm"
  >
    Press and hold
  </button>
</section>
