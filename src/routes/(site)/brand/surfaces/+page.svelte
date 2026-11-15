<script lang="ts">
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<Page path="/brand/surfaces/">
  <Section id="radius" title="One radius">
    <!-- source: decisions.md, "The identity: the owner's first answers", H1 -->
    <p data-claim="settled">
      Every card, control and panel has the same corner: {data.radius} px. Only a
      dot is round.
    </p>
    <div class="flex items-center gap-4" aria-hidden="true">
      <span class="size-16 rounded border border-border bg-card"></span>
      <span class="size-6 rounded-full bg-mark-1"></span>
    </div>
  </Section>

  <Section id="flat" title="Product screens are flat">
    <!-- source: decisions.md, "The identity: round two answered", I5 with I9 -->
    <p data-claim="settled">
      A product screen is flat: hairlines and flat fills, with no shadow and no
      glass.
    </p>
  </Section>

  <Section id="fields" title="The four fields">
    <!-- source: 011 decision 6, the colour fields -->
    <p data-claim="settled">
      A field is a band of one of the four colours, in the mark's order, on an
      expressive page. Its text is the field's legend, the one colour measured
      on it.
    </p>
    <!-- source: 011 decision 6, what a field may hold -->
    <p data-claim="settled">
      A field holds headings, prose and figures in its legend, opaque surfaces,
      and glass. A control sits on a surface or on glass, never on the field
      itself.
    </p>
  </Section>
  <div
    class="mx-auto mt-6 grid max-w-7xl gap-3 px-(--gutter-stage) sm:grid-cols-2"
  >
    {#each data.fields as fd (fd.field)}
      <div class="field-{fd.n} grid min-h-32 content-end rounded p-6">
        <span class="text-xl font-semibold">{fd.name}</span>
      </div>
    {/each}
  </div>

  <Section id="glass" title="Frosted glass">
    <!-- source: decisions.md, "Frost only: the lens is removed"; round two, I9 -->
    <p data-claim="settled">
      Glass is frosted, with a rim that catches the light as the pointer moves.
      It lies over a field, on an expressive page only, and carries the theme's
      own text.
    </p>
    <!-- source: decisions.md, "The identity: round two answered", I9; 016, the glass fallback rows -->
    <p data-claim="settled">
      When a reader asks for reduced transparency or forced colours, or the
      browser cannot blur, the glass turns opaque. Its text passes on both
      grounds.
    </p>
  </Section>
  <div class="mx-auto mt-6 max-w-7xl px-(--gutter-stage) pb-16">
    <div class="field-1 rounded p-8 sm:p-12">
      <div class="glass max-w-sm p-5" {@attach pointerLight}>
        <!-- source: 011 decision 8, the liquid glass -->
        <p data-claim="settled">
          Text on glass is the theme's own: here, the foreground on the frost
          over blue.
        </p>
      </div>
    </div>
  </div>
</Page>
