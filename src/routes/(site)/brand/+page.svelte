<script lang="ts">
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { door } from "#lib/site/doors";
  import Brand from "#lib/site/page/brand.svelte";
  import Landing from "#lib/site/page/landing.svelte";
  import { doorPages } from "#lib/site/sitemap";

  const pages = doorPages("brand");
</script>

<Landing door={door("brand")}>
  {#snippet title()}
    <span class="sr-only">Brand</span>
    <!-- The lockup in the field's legend, one colour: on the yellow field a
         four-colour mark would lose its third dot. -->
    <span aria-hidden="true"
      ><Lockup tone="mono" class="text-(length:--type-display-size)" /></span
    >
  {/snippet}
  {#snippet sentence()}
    <p>Pluto Systems is a workspace suite on one governed data layer.</p>
    <p>Work runs on data.</p>
  {/snippet}

  <Brand>
    <div class="mx-auto max-w-7xl px-(--gutter-stage) pt-12 pb-20">
      <div class="grid max-w-(--site-measure) gap-4">
        <h2 class="text-2xl font-semibold tracking-section">How Pluto looks</h2>
        <p>
          Four colours, blue, red, yellow and green, the mark's four dots. A
          warm canvas in light and graphite in dark. IBM Plex Sans for display,
          Geist for reading, JetBrains Mono for code.
        </p>
        <p>
          Product screens stay quiet and flat. The colours come together, as
          fields and glass, only in owned moments: a home page, a launch, this
          section.
        </p>
      </div>
      {#if pages.length}
        <ul class="groove-b mt-12 max-w-(--site-measure)">
          {#each pages as p (p.path)}
            <li class="groove py-3">
              <a
                href={p.path}
                class="font-medium text-foreground hover:underline">{p.title}</a
              >
              <p class="text-sm text-muted-foreground">{p.summary}</p>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </Brand>
</Landing>
