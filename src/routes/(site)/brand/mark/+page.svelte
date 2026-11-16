<script lang="ts">
  import { FourDot, Lockup } from "#lib/registry/ui/four-dot";
  import LockupFigure from "#lib/site/brand/lockup-figure.svelte";
  import MarkFigure from "#lib/site/brand/mark-figure.svelte";
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const m = $derived(data.mark);
  const f = (v: number) => v.toFixed(2);
  const top = $derived((m.rise + 2 * m.dot + m.gap) * m.lockupScale);
</script>

<Page path="/brand/mark/">
  <Section id="dots" title="The four dots">
    <!-- source: decisions.md, "The identity: the owner's first answers", N1 -->
    <p data-claim="settled">
      Four dots in a square: blue and red above, yellow and green below. The
      order never changes.
    </p>
    <!-- source: decisions.md, N1; 001 decision 16, the mark's geometry as tokens -->
    <p data-claim="settled">
      Each dot is {f(m.dot)} em across, and the dots sit {f(m.gap)} em apart. Both
      are in ems, so the mark grows with the type beside it.
    </p>
    <figure class="mt-4 grid gap-4">
      <MarkFigure dot={m.dot} gap={m.gap} />
      <figcaption data-claim="none" class="text-sm text-muted-foreground">
        The mark, drawn from the token file.
      </figcaption>
    </figure>
    <ul data-figure-dims="mark" class="grid gap-1 text-sm">
      <!-- source: tokens/kuiper.tokens.json, mark.dot; decisions.md, N1 -->
      <li data-claim="settled" data-dim="dot" data-value={m.dot}>
        A. The dot: {f(m.dot)} em.
      </li>
      <!-- source: tokens/kuiper.tokens.json, mark.gap; decisions.md, N1 -->
      <li data-claim="settled" data-dim="gap" data-value={m.gap}>
        B. The gap: {f(m.gap)} em, about a quarter of a dot.
      </li>
      <!-- source: tokens/kuiper.tokens.json, mark.dot and mark.gap; 001 decision 16 -->
      <li data-claim="settled" data-dim="side" data-value={2 * m.dot + m.gap}>
        C. The mark's side: two dots and a gap, {f(2 * m.dot + m.gap)} em.
      </li>
    </ul>
  </Section>

  <Section id="lockup" title="The lockup">
    <!-- source: decisions.md, "The identity: round two answered", E6 -->
    <p data-claim="settled">
      The lockup is the word, lowercase and bold, with the mark risen beside it
      like a colon.
    </p>
    <div class="py-4 text-7xl" aria-hidden="true"><Lockup /></div>
    <!-- source: decisions.md, E6; tokens/kuiper.tokens.json, mark -->
    <p data-claim="settled">
      The mark is set at {f(m.lockupScale)} of the word's size, {f(m.lockupGap)} em
      from the word. It rises {f(m.rise * m.lockupScale)} em above the baseline, so
      its top sits {f(top)} em above it.
    </p>
    <figure class="mt-4 grid gap-4">
      <LockupFigure
        {...data.lockup}
        dot={m.dot}
        gap={m.gap}
        scale={m.lockupScale}
        lockupGap={m.lockupGap}
        rise={m.rise}
      />
      <figcaption data-claim="none" class="text-sm text-muted-foreground">
        The lockup, drawn from the token file, with its baseline dashed.
      </figcaption>
    </figure>
    <ul data-figure-dims="lockup" class="grid gap-1 text-sm">
      <!-- source: tokens/kuiper.tokens.json, mark.lockupScale; decisions.md, E6 -->
      <li
        data-claim="settled"
        data-dim="lockupScale"
        data-value={m.lockupScale}
      >
        D. The mark's size: {f(m.lockupScale)} of the word's.
      </li>
      <!-- source: tokens/kuiper.tokens.json, mark.lockupGap; decisions.md, E6 -->
      <li data-claim="settled" data-dim="lockupGap" data-value={m.lockupGap}>
        E. From the word: {f(m.lockupGap)} em.
      </li>
      <!-- source: tokens/kuiper.tokens.json, mark.rise; 001 decision 16 -->
      <li data-claim="settled" data-dim="rise" data-value={m.rise}>
        F. The rise: {f(m.rise)} em of the mark's own size, {f(
          m.rise * m.lockupScale,
        )} em of the word's.
      </li>
      <!-- source: decisions.md, E6, "its top .90 em above the baseline" -->
      <li data-claim="settled" data-dim="top" data-value={top}>
        G. The top: {f(top)} em above the baseline.
      </li>
    </ul>
  </Section>

  <Section id="space" title="Clear space and the smallest size">
    <!-- source: 001 decision 16, clearspace -->
    <p data-claim="settled">
      Keep one dot-pair height clear on every side of the lockup: the height of
      the mark, two dots and the gap between them. Nothing else sits inside it.
    </p>
    <!-- source: 001 decision 16, the minimum size -->
    <p data-claim="settled">
      Below 20 px of lockup height, use the mark alone.
    </p>
  </Section>

  <Section id="grounds" title="Which version goes where">
    <!-- source: 017 decision 4; decisions.md, "The design site's review calls" -->
    <p data-claim="settled">
      On paper, white or another light ground, use the four colours. On a colour
      field, use one colour: on screen, the mark takes the field's own legend,
      as below.
    </p>
    <!-- source: 017 decision 4, the paper colourway; tokens/kuiper.tokens.json, primitives.paper -->
    <p data-claim="settled">
      The paper downloads are drawn in the brand's paper, {data.canvas}, not
      white, for the colour fields and dark grounds.
    </p>
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded border border-border bg-background p-6 text-4xl">
        <span aria-hidden="true"><Lockup /></span>
        <!-- source: 017 decision 4 -->
        <p data-claim="settled" class="mt-3 text-sm">
          Four colours, on the page's own ground.
        </p>
      </div>
      {#each data.fields as fd (fd.field)}
        <div class="field-{fd.n} rounded p-6 text-4xl">
          <span aria-hidden="true"><Lockup tone="mono" /></span>
          <!-- source: 017 decision 4; 011 decision 11 and 016 decision 5, each field's legend measured -->
          <p data-claim="settled" class="mt-3 text-sm">
            On the {fd.name.toLowerCase()} field, its legend: {fd.light.ratio.toFixed(
              2,
            )}:1 in light, {fd.dark.ratio.toFixed(2)}:1 in dark.
          </p>
        </div>
      {/each}
    </div>
    <!-- source: 017 decision 4; 016 decision 5, the yellow dot at 1.00:1 on the yellow field -->
    <p data-claim="settled">
      Never set the four colours on a field. On the yellow field, the third dot
      would measure 1.00:1 and vanish into it.
    </p>
    <!-- source: 008, a product's logo on a dark ground -->
    <p data-claim="settled">
      On a dark product screen, the mark is paper. On this system's own
      expressive pages in dark, it lifts its four colours, as it does here.
    </p>
  </Section>

  <Section id="logo" title="A logo">
    <!-- source: decisions.md, "The identity: round two answered", the mark is a logo, exempt from the 3:1 graphic rule -->
    <p data-claim="settled">
      The mark is a logo, so the 3:1 rule for graphics doesn't apply to it.
    </p>
    <div class="flex items-center gap-4 pb-16 text-5xl">
      <FourDot label="The Pluto Systems mark" />
    </div>
  </Section>
</Page>
