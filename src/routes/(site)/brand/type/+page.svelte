<script lang="ts">
  import LadderFigure from "#lib/site/brand/ladder-figure.svelte";
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const name = (family: string) =>
    family
      .split(",")[0]
      .replaceAll("'", "")
      .replace(/ Variable$/, "");
  const faces = $derived([
    {
      id: "heading",
      class: "font-heading text-4xl font-semibold tracking-display",
      job: "speaks for the brand: headings, the lockup's word, display and poster type.",
    },
    {
      id: "sans",
      class: "font-sans text-2xl",
      job: "is for reading: body text and every control.",
    },
    {
      id: "mono",
      class: "font-mono text-xl",
      job: "is for code, keys and short labels, such as a badge.",
    },
  ] as const);
  const poster = $derived(data.steps.find(([n]) => n === "poster")![1]);
</script>

<Page path="/brand/type/">
  <Section id="faces" title="Three faces">
    <!-- source: decisions.md, "The identity: the owner's first answers", D1 -->
    <p data-claim="settled">
      Three typefaces, each with one job. None is commissioned: they are open
      faces, chosen and kept.
    </p>
    <ul class="grid gap-6">
      {#each faces as f (f.id)}
        <!-- source: decisions.md, D1; tokens/pluto.tokens.json, type.families -->
        <li data-claim="settled" class="grid gap-1">
          <span class={f.class} aria-hidden="true">Work runs on data.</span>
          <span>{name(data.families[f.id].family)} {f.job}</span>
        </li>
      {/each}
    </ul>
  </Section>

  <Section id="ladder" title="The display ladder">
    <!-- source: 011 decision 9; tokens/pluto.tokens.json, expressive.display.steps -->
    <p data-claim="settled">
      Display type comes in four steps. Each grows with the window, between its
      smallest and its largest size, and is set tight, with little leading.
    </p>
    <figure class="mt-4 grid gap-4">
      <LadderFigure steps={data.steps} />
      <figcaption data-claim="none" class="text-sm text-muted-foreground">
        Each step's em box at its smallest and its largest, and its line height,
        drawn from the token file.
      </figcaption>
    </figure>
    <ul data-figure-dims="ladder" class="grid gap-1 text-sm">
      {#each data.steps as [id, s] (id)}
        <!-- source: tokens/pluto.tokens.json, expressive.display.steps -->
        <li
          data-claim="settled"
          data-dim={id}
          data-value="{s.minPx} {s.maxPx} {s.lineHeight}"
        >
          <code>type-{id}</code>: from {s.minPx} px to {s.maxPx} px, leading {s.lineHeight}.
        </li>
      {/each}
    </ul>
  </Section>

  <Section id="poster" title="Poster type, for launches">
    <!-- source: decisions.md, "The identity: the owner's first answers", K3; the identity options, K3: reserved for launches and campaigns -->
    <p data-claim="settled">
      The largest step, <code>type-poster</code>, reaches {poster.maxPx} px. It is
      for launches and campaigns, where two or three words fill the screen.
    </p>
    <p
      data-claim="none"
      aria-hidden="true"
      class="type-poster pb-16 text-mark-1"
    >
      Launch
    </p>
  </Section>
</Page>
