<script lang="ts">
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // Each colour's job, in one sentence on its glass.
  const JOBS = [
    "Blue is action: in a product, the primary button, the link and the focus ring.",
    "Red is danger: in a product, an error, or an action that cannot be undone.",
    "There is one yellow: the third dot, the third field, the third chart series and the caution fill.",
    "Green is success: in a product, the sign that something worked.",
  ];
</script>

<Page path="/brand/colour/">
  <div class="mt-16 grid">
    {#each data.fields as fd, i (fd.field)}
      <section
        data-slot="colour-band"
        aria-labelledby="band-{fd.n}"
        class="field-{fd.n} py-20 lg:-me-(--site-edge) lg:pe-(--site-edge)"
      >
        <div
          class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-end gap-10 px-(--gutter-stage) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-md))]"
        >
          <h2 id="band-{fd.n}" class="type-poster">{fd.name}</h2>
          <div
            class="glass grid gap-3 p-5 text-foreground"
            {@attach pointerLight}
          >
            <ul class="grid gap-1 font-mono text-sm">
              <!-- source: tokens/pluto.tokens.json, expressive.field; 016 decision 5 for the yellow -->
              <li data-claim="settled">
                Light: {fd.light.fill}, text {fd.light.legend}, {fd.light.ratio.toFixed(
                  2,
                )}:1
              </li>
              <!-- source: tokens/pluto.tokens.json, expressive.field; 011 decision 11, fieldRows -->
              <li data-claim="settled">
                Dark: {fd.dark.fill}, text {fd.dark.legend}, {fd.dark.ratio.toFixed(
                  2,
                )}:1
              </li>
            </ul>
            <!-- source: decisions.md, "A yellower yellow, in code and in the brand"; 011 decision 6, the four fields; tokens/pluto.tokens.json, the theme roles primary, ring, destructive and success -->
            <p data-claim="settled">{JOBS[i]}</p>
          </div>
        </div>
      </section>
    {/each}
  </div>

  <Section id="grounds" title="The canvas and graphite">
    <!-- source: decisions.md, "The identity: round two answered", I5 with I9 -->
    <p data-claim="settled">
      The four colours sit on a warm canvas, {data.canvas}, in light, and on
      graphite, {data.graphite}, in dark. Neither is pure white or pure black.
    </p>
  </Section>

  <Section id="together" title="Four together, only in owned moments">
    <!-- source: decisions.md, "The identity: the owner's first answers", C2 -->
    <p data-claim="settled">
      A product screen stays neutral: the canvas, ink and one blue for action.
      The four colours come together only in an owned moment, such as a home
      page, a launch or this section.
    </p>
  </Section>

  <Section id="yellow" title="One yellow, never the only signal">
    <!-- source: decisions.md, "The identity: round two answered", one yellow and colour never the only signal; "A yellower yellow" -->
    <p data-claim="settled">
      There is one brand yellow. Where it carries meaning on a light ground, as
      a status or a chart series, it is never the only signal: a label, a legend
      or a value says the same thing in words.
    </p>
  </Section>

  <Section id="red" title="Brand red and error red">
    <!-- source: 017 decision 1, brand red kept apart from error red by place -->
    <p data-claim="settled">
      The brand's red and an error's red are kept apart by where they appear,
      not by their hue. The brand's red fills a field in an owned moment. An
      error's red sits beside what went wrong, with words that say what
      happened.
    </p>
    <div class="pb-16"></div>
  </Section>
</Page>
