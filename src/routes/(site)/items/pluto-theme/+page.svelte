<script lang="ts">
  import Eyebrow from "#lib/preview/eyebrow.svelte";
  import InstallCommand from "#lib/preview/install-command.svelte";
  import ContrastTable from "#lib/preview/contrast-table.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

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
    Tints composite at 10% in light and 20% in dark. Amber is the one recorded
    exception: an amber series is labelled directly.
  </p>
  <div class="mt-6 dark:hidden">
    <ContrastTable rows={data.contrast.light} caption="Light theme" />
  </div>
  <div class="mt-6 hidden dark:block">
    <ContrastTable rows={data.contrast.dark} caption="Dark theme" />
  </div>
  <h3 class="mt-8 text-base font-bold">Forbidden: state tints on muted</h3>
  <ul class="mt-2 grid gap-1 text-sm">
    {#each data.forbidden as row (row.theme + row.label)}
      <li>
        <code>{row.theme}</code> · {row.label} · <code>{row.bg}</code> · {row.ratio.toFixed(
          2,
        )}
      </li>
    {/each}
  </ul>
</section>

<section class="mt-16" aria-labelledby="elevation">
  <h2 id="elevation" class="text-2xl font-bold tracking-section">
    Elevation and scrim
  </h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    Menus and dialogs only. In light, a hairline and a shadow {data.elevation.y}
    px down with a {data.elevation.blur} px blur; in dark, a hairline on the raised
    ground, because a shadow on ink is invisible. The scrim dims the page behind a
    modal dialog.
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
    The one line primitive: a hairline with a 1 px highlight beneath it on
    paper, a plain hairline on ink.
  </p>
  <div class="groove mt-6 pt-4 text-sm text-muted-foreground">
    Content below a groove.
  </div>
</section>

<section class="mt-16" aria-labelledby="code">
  <h2 id="code" class="text-2xl font-bold tracking-section">Code and scroll</h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    Twelve code tokens, each a semantic colour, drive the code block and the
    editor as <code>text-code-*</code> and <code>bg-code-*</code> utilities. The
    <code>scrollbar</code> utility colours a native scroll box's thumb and track
    from <code>input</code> and <code>muted</code>; the pattern is
    <code>overflow-auto scrollbar</code> with <code>tabindex="0"</code> and a label.
  </p>
  <div class="mt-6 flex flex-wrap items-start gap-12">
    <div class="flex flex-col items-start gap-2">
      <pre
        class="rounded bg-code-background px-4 py-3 font-mono text-sm text-code-foreground"><code
          ><span data-token="text-code-keyword" class="text-code-keyword"
            >def</span
          > <span class="text-code-function font-medium">area</span>(r):
<span
            data-token="bg-code-active-line"
            class="block bg-code-active-line">    <span
              class="text-code-keyword">return</span
            > <span class="text-code-constant">3.14159</span> * r ** <span
              class="text-code-constant">2</span
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
  </div>
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
