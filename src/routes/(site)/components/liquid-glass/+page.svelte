<script lang="ts">
  import * as variants from "#lib/site/examples/liquid-glass/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="liquid-glass" examples={{ variants }}>
  {#snippet when()}
    <p>
      Use glass on expressive pages only, for one panel that should sit over the
      canvas or over a colour field. Product screens are flat.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        It needs Svelte 5.29 or later. <code>pointerLight</code> is an
        attachment, Svelte's way to add behaviour to an element, written
        <code>{"{@attach pointerLight}"}</code>.
      </li>
      <li>
        Everywhere it is not opaque, the glass is frosted: a 16 px blur and
        nothing more.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>
      Set text on glass in <code>foreground</code>,
      <code>muted-foreground</code> or <code>primary</code>.
    </li>
    <li>
      On a colour field, put a control on glass, never on the field itself.
    </li>
    <li>
      Attach <code>pointerLight</code> to the element that carries the glass.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Set text on glass in red, green or yellow.</li>
    <li>Put glass inside glass.</li>
    <li>
      Lay dark glass over a light-theme ground, a <code>paper</code> or
      <code>raised</code> surface, or an image.
    </li>
    <li>Use glass on a product screen.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Under <code>prefers-reduced-transparency: reduce</code>, under forced
      colours (with a system-colour edge), and in a browser with no backdrop
      filter, the glass gives up its blur and takes an opaque ground, the
      theme's glass fallback.
    </li>
    <li>
      Under <code>prefers-reduced-motion: reduce</code>,
      <code>pointerLight</code> sets nothing, and the edge stays unlit.
    </li>
    <li>
      The light follows the pointer only; it adds no focus state and no keyboard
      stop. Focus inside the glass shows the theme's own ring.
    </li>
    <li>
      Glass is a style, not a role: give a panel the element and the name its
      content needs.
    </li>
  {/snippet}
</Component>
