<script lang="ts">
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="liquid-glass" />

<div data-mode="expressive">
  <PreviewSection
    id="variants"
    title="On the canvas and on a field"
    intro="The glass utility on any element: a frosted tint, a lit edge and the 8 px case radius. The pointerLight attachment lights the edge where the pointer moves; the light goes out 600 ms after the last move. Inside, the text takes the theme's own roles, even on a field."
  >
    <div class="grid gap-8 lg:grid-cols-2">
      <Specimen caption="glass, on the canvas" class="w-full">
        <div
          data-testid="glass"
          class="glass grid w-full gap-1 p-6"
          {@attach pointerLight}
        >
          <p class="font-heading font-bold">Work runs on data.</p>
          <p class="text-sm text-muted-foreground">
            Move the pointer over this panel: its edge lights where you are.
          </p>
          <a
            href="/items/pluto-theme/"
            class="w-fit text-sm text-primary underline">The theme's tokens</a
          >
        </div>
      </Specimen>
      <Specimen caption="glass, on field-1" class="w-full">
        <section
          aria-labelledby="glass-field-heading"
          class="field-1 grid w-full gap-4 rounded p-6"
        >
          <h3
            id="glass-field-heading"
            class="font-heading text-2xl font-bold text-foreground"
          >
            One governed layer
          </h3>
          <div
            data-testid="glass-over-field"
            class="glass grid gap-1 p-4"
            {@attach pointerLight}
          >
            <p class="font-heading font-bold">Glass on the blue field</p>
            <p class="text-sm text-muted-foreground">
              The field's legend stops at the glass: its text is the theme's.
            </p>
            <a
              href="/items/pluto-theme/"
              class="w-fit text-sm text-primary underline">The colour fields</a
            >
          </div>
        </section>
      </Specimen>
    </div>
  </PreviewSection>

  <PreviewSection
    id="states"
    title="When it turns opaque"
    intro="The glass gives up its blur and takes an opaque ground, the theme's glass fallback, wherever the frosting could cost a reader. Everywhere else it is frosted: a 16 px blur and nothing more."
  >
    <ul class="grid max-w-prose list-disc gap-2 pl-6 text-sm">
      <li>
        Under <code>prefers-reduced-transparency: reduce</code>, under forced
        colours (with a system-colour edge), and in a browser with no backdrop
        filter, the glass is opaque.
      </li>
      <li>
        Under <code>prefers-reduced-motion: reduce</code>,
        <code>pointerLight</code>
        sets nothing, and the edge stays dark.
      </li>
    </ul>
  </PreviewSection>

  <PreviewSection
    id="usage"
    title="Where it goes"
    intro="Expressive pages only: product screens are flat. The review checklist's R25 holds the rest."
  >
    <ul class="grid max-w-prose list-disc gap-2 pl-6 text-sm">
      <li>
        It needs Svelte 5.29 or later: <code>pointerLight</code> is an
        attachment, used as <code>{"{@attach pointerLight}"}</code>, from
        <code>svelte/attachments</code>.
      </li>
      <li>
        Text on glass is <code>foreground</code>, <code>muted-foreground</code>
        or
        <code>primary</code>, never red, green or yellow.
      </li>
      <li>Glass never sits inside glass.</li>
      <li>
        Dark glass never lies over a light-theme ground, a <code>paper</code> or
        <code>raised</code> surface, or an image.
      </li>
    </ul>
  </PreviewSection>
</div>
