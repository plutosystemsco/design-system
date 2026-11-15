<script lang="ts">
  import { FourDot } from "#lib/registry/ui/four-dot";
  import Page from "#lib/site/brand/page.svelte";
  import Section from "#lib/site/brand/section.svelte";
  import { componentPath } from "#lib/site/sitemap";
</script>

<Page path="/brand/products/">
  <Section id="suite" title="A branded suite">
    <!-- source: decisions.md, "The identity: the owner's first answers", A4 -->
    <p data-claim="settled">
      Every workspace product carries the Pluto name: Pluto Docs, Pluto Sheets.
      An open-source core keeps its own name, as <code>vfs</code> does.
    </p>
  </Section>

  <Section id="identity" title="What a product makes its own">
    <!-- source: decisions.md, "One system, many products", identity only -->
    <p data-claim="settled">
      A product sets its logo, its name and its copy. Everything else is shared:
      the colours, the type, the space, the radius and the motion, all from the
      one token file.
    </p>
    <!-- source: decisions.md, "One system, many products", its own logo, with its name as the fallback -->
    <p data-claim="settled">
      The app shell takes a product's logo as a snippet: an SVG, an image or
      markup. Without one, it sets the product's name as a wordmark in the
      heading face. The <a
        href={componentPath("app-shell")}
        class="text-primary underline underline-offset-4">app shell</a
      > shows how.
    </p>
  </Section>

  <Section id="endorsement" title="The endorsement">
    <!-- source: decisions.md, "One system, many products", an optional endorsement -->
    <p data-claim="settled">
      A product's footer may carry one line, “A Pluto Systems product”. It is
      off until a product turns it on. When a reader points at it, the four dots
      appear beside it.
    </p>
    <div
      class="flex items-center gap-2 text-sm text-muted-foreground"
      aria-hidden="true"
    >
      A Pluto Systems product <FourDot />
    </div>
  </Section>

  <Section id="icons" title="Product icons">
    <!-- source: decisions.md, "The identity: round two answered", G5 -->
    <p data-claim="settled">
      The tile is set: flat colour, a white glyph (ink on yellow), two products
      per colour. The icons themselves are not drawn yet.
    </p>
    <!-- source: decisions.md, G5, the radius scales with the icon -->
    <p data-claim="settled" class="pb-16">
      The tile's corner scales with it: 8 px at 64 px, 6 at 48, 4 at 32 and 2 at
      16.
    </p>
  </Section>
</Page>
