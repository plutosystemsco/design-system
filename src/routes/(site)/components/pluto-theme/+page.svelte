<script lang="ts">
  import * as code from "#lib/site/examples/pluto-theme/code.svelte";
  import * as colours from "#lib/site/examples/pluto-theme/colours.svelte";
  import * as contrast from "#lib/site/examples/pluto-theme/contrast.svelte";
  import * as display from "#lib/site/examples/pluto-theme/display.svelte";
  import * as elevation from "#lib/site/examples/pluto-theme/elevation.svelte";
  import * as expressiveMotion from "#lib/site/examples/pluto-theme/expressive-motion.svelte";
  import * as fields from "#lib/site/examples/pluto-theme/fields.svelte";
  import * as glass from "#lib/site/examples/pluto-theme/glass.svelte";
  import * as groove from "#lib/site/examples/pluto-theme/groove.svelte";
  import * as inlineCode from "#lib/site/examples/pluto-theme/inline-code.svelte";
  import * as measured from "#lib/site/examples/pluto-theme/measured.svelte";
  import * as modes from "#lib/site/examples/pluto-theme/modes.svelte";
  import * as motion from "#lib/site/examples/pluto-theme/motion.svelte";
  import * as radius from "#lib/site/examples/pluto-theme/radius.svelte";
  import * as spacing from "#lib/site/examples/pluto-theme/spacing.svelte";
  import * as spring from "#lib/site/examples/pluto-theme/spring.svelte";
  import * as surface from "#lib/site/examples/pluto-theme/surface.svelte";
  import * as type from "#lib/site/examples/pluto-theme/type.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="pluto-theme"
  examples={{
    colours,
    contrast,
    elevation,
    type,
    spacing,
    radius,
    groove,
    code,
    "inline-code": inlineCode,
    surface,
    motion,
    display,
    modes,
    fields,
    glass,
    spring,
    measured,
    "expressive-motion": expressiveMotion,
  }}
>
  {#snippet when()}
    <p>
      Install the theme before any other item. It holds every colour and size
      the brand uses, for light and dark, from one token file. Installing it
      brings the three font items too.
    </p>
    <p>
      Every colour pair is measured for contrast. Yellow is the one known
      exception: a yellow series is labelled directly.
    </p>
    <p>
      Expressive mode is a second voice on the same tokens, for home pages,
      launches and marketing sections. Set <code>data-mode="expressive"</code>
      on an element to give its subtree the mode's values.
      <code>data-mode="productive"</code>
      resets them. Only an item declared <code>["expressive"]</code> may use the display
      steps, the press (the slight shrink while pressed), the colour fields and the
      glass. Every other rule binds both modes.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        The code roles are written into both theme blocks, so a dark subtree
        inside a light page takes the dark palette.
      </li>
      <li>
        <code>shadow-elevation</code> is a hairline and a shadow layer. The layer
        is clear, and it stays, so the shape is the same in both themes.
      </li>
      <li>
        An ink surface, a dark panel for code and output, is graphite on a light
        page and <code>card</code> on a dark one. Set <code>--background</code>
        on the surface to move its ground, the code ground and the editor's ground
        together. The
        <code>muted</code> insets keep their tint inside it: the pill tab strip, the
        meter's track, a skeleton, a hover row.
      </li>
      <li>
        For a surface's overlays, wrap its content in
        <code>BitsConfig defaultPortalTo</code> with the surface element. Every
        popover, tooltip and menu opened inside then lands inside the surface,
        themed like it, in the same place. A modal passes
        <code>portalProps={'{{ to: "body" }}'}</code>
        and stays the page's.
      </li>
      <li>
        The surface must carry no <code>transform</code>, <code>filter</code> or
        <code>contain</code>, or a portalled overlay inside it is clipped or
        re-anchored.
      </li>
      <li>
        The <code>.surface-ink</code> rule wins over <code>.dark</code> by
        source order. Keep it after the <code>.dark</code> block in your stylesheet,
        where the install writes it.
      </li>
      <li>
        The groove inside a surface is the dark hairline alone, paper at 10%
        over graphite. A code block's or editor's bar inside a surface draws its
        track on the surface itself.
      </li>
      <li>
        On a colour field, a control sits on a surface or on glass, never on the
        field itself. Set the theme on <code>html</code> or on a wrapper outside
        the expressive subtree. A field never shares an element with
        <code>.dark</code>, and the dark theme's four-colour marks need
        <code>.dark</code> on or above the mode element.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Take every colour and size from the semantic tokens.</li>
    <li>
      Put code or output on an ink surface when it needs the dark theme on a
      light page.
    </li>
    <li>
      Give text on a field a <code>surface-plain</code> card or glass when it needs
      the theme's own roles.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Write a colour or a size as a literal in a component.</li>
    <li>Put a state tint on <code>muted</code>.</li>
    <li>Use the expressive utilities in an item that is productive only.</li>
    <li>Put <code>.dark</code> on the same element as a field.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Text pairs meet 4.5:1 and non-text pairs 3:1, measured in both themes,
      with yellow the one exception. The contrast tables list every pair.
    </li>
    <li>
      The focus ring inside a surface is the dark <code>ring</code>: 8.67:1 on
      graphite, 6.90:1 on its muted insets. On a field, the ring takes the
      field's legend colour.
    </li>
    <li>
      Give a scroll box <code>tabindex="0"</code>, a role and a label, so a
      keyboard can scroll it. <code>scrollbar</code> colours its bar from
      <code>input</code> on <code>muted</code>; <code>scrollbar-code</code> draws
      the same bar on the code ground.
    </li>
    <li>
      A scroll box inside a surface draws its bar from the dark
      <code>input</code> on the dark <code>muted</code>, and
      <code>color-scheme</code> is dark, so native controls draw dark too.
    </li>
    <li>
      The ink surface example holds seven keyboard stops: the editor, the copy
      button, the code, the tab strip and three triggers. Tab leaves the editor.
    </li>
    <li>
      Under reduced motion every motion duration reads 0 ms, and <code
        >--press-scale</code
      > reads 1.
    </li>
  {/snippet}
</Component>
