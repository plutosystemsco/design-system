<script lang="ts">
  import { FourDot, Lockup } from "#lib/registry/ui/four-dot";
  import Eyebrow from "#lib/preview/eyebrow.svelte";
  import InstallCommand from "#lib/preview/install-command.svelte";

  const markSizes = ["text-xs", "text-sm", "text-base", "text-2xl", "text-5xl"];
  const lockupSizes = ["text-base", "text-2xl", "text-5xl"];
</script>

<svelte:head
  ><title>Four-dot mark · Pluto Systems design system</title></svelte:head
>

<Eyebrow>registry:ui · four-dot</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">Four-dot mark</h1>
<p class="mt-4 max-w-prose text-muted-foreground">
  The mark and the wordmark lockup. Both take their size from the text around
  them. In the dark theme every dot goes paper-white.
</p>
<div class="mt-6"><InstallCommand name="four-dot" /></div>

<section class="mt-16" aria-labelledby="mark">
  <h2 id="mark" class="text-2xl font-bold tracking-section">The mark</h2>
  <ul class="mt-6 flex flex-wrap items-end gap-8">
    {#each markSizes as size (size)}
      <li class="flex flex-col items-start gap-2">
        <span class={size}><FourDot /></span>
        <code class="text-xs">{size}</code>
      </li>
    {/each}
  </ul>
  <h3 class="mt-8 text-base font-bold">Mono tone</h3>
  <p class="mt-2 text-sm text-muted-foreground">
    Every dot takes the current text colour.
  </p>
  <p class="mt-4 text-5xl text-primary">
    <FourDot tone="mono" data-testid="mono" />
  </p>
  <p class="mt-4 text-5xl" data-testid="decorative-wrap">
    <FourDot data-testid="decorative" />
  </p>
</section>

<section class="mt-16" aria-labelledby="lockup">
  <h2 id="lockup" class="text-2xl font-bold tracking-section">The lockup</h2>
  <ul class="mt-6 flex flex-col items-start gap-8">
    {#each lockupSizes as size (size)}
      <li class="flex flex-col items-start gap-2">
        <Lockup class={size} />
        <code class="text-xs">{size}</code>
      </li>
    {/each}
  </ul>
  <h3 class="mt-8 text-base font-bold">As a link</h3>
  <p class="mt-4">
    <Lockup href="/" class="text-2xl" data-testid="lockup-link" />
  </p>
  <h3 class="mt-8 text-base font-bold">The mark alone, in a link</h3>
  <p class="mt-4 text-2xl">
    <a href="/items/four-dot/" data-testid="mark-link"
      ><FourDot label="Pluto Systems" data-testid="labelled" /></a
    >
  </p>
</section>

<section class="mt-16" aria-labelledby="usage">
  <h2 id="usage" class="text-2xl font-bold tracking-section">
    Clearspace and minimum size
  </h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    Keep one dot-pair height clear on every side. Below 20 px of lockup height,
    use the mark alone.
  </p>
  <div class="mt-6 flex flex-wrap items-end gap-12">
    <div class="flex flex-col items-start gap-2">
      <span
        class="inline-block text-5xl outline-1 outline-input outline-dashed"
        style="padding: calc(var(--mark-dot) * 2 + var(--mark-gap))"
      >
        <Lockup />
      </span>
      <code class="text-xs">clearspace: one dot-pair height</code>
    </div>
    <div class="flex flex-col items-start gap-2">
      <span style="font-size: 20px"><Lockup /></span>
      <code class="text-xs">20 px: the smallest lockup</code>
    </div>
    <div class="flex flex-col items-start gap-2">
      <span class="text-base"><FourDot /></span>
      <code class="text-xs">below it: the mark alone</code>
    </div>
  </div>
</section>

<section class="mt-16" aria-labelledby="geometry-heading">
  <h2 id="geometry-heading" class="text-2xl font-bold tracking-section">
    Geometry fixture
  </h2>
  <p class="mt-2 max-w-prose text-muted-foreground">
    The lockup at 100 px, aligned to the baseline beside a zero-size probe whose
    bottom edge is the baseline. The tests measure against it.
  </p>
  <div
    data-testid="geometry"
    class="mt-12 flex items-baseline"
    style="font-size: 100px"
  >
    <Lockup data-testid="geometry-lockup" />
    <span
      data-testid="baseline-probe"
      class="inline-block"
      style="width: 0; height: 0"
    ></span>
  </div>
</section>
