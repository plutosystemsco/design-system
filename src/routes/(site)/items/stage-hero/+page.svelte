<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="stage-hero">
  {#snippet usage()}
    <li>
      Place it in a <code>{"<Stage>"}</code>. Pass <code>title</code>,
      <code>description</code>, one or two <code>actions</code>, an
      <code>object</code> snippet of opaque things (cards carrying
      <code>surface-plain</code>, figures, images), and a <code>strip</code>.
    </li>
    <li>
      The words sit in a glass panel; the object sits on the colour field that
      <code>field</code> names (<code>"field-1"</code> by default). From lg the glass
      overlaps the field by three of twelve columns and the object stays clear of
      it; below lg the glass comes first and overlaps the field's top.
    </li>
    <li>
      Without an <code>object</code> there is no field and no glass: the words sit
      on the stage's ground, so place it only in a canvas stage.
    </li>
    <li>
      <code>poster</code> sets the title at the poster step, 56 to 160 px: for
      launches only. With <code>fill</code> (the default) the hero is the
      screen's height less the bar; with <code>underBar</code>, beneath an
      overlaying bar, the whole screen.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Its title is the page's one <code>h1</code>; pass
      <code>headingLevel={2}</code> where the page has another.
    </li>
    <li>
      The actions are links, 52 px tall. The words on the glass take the theme's
      own roles, measured over the canvas and every field; under reduced
      transparency or forced colours the glass is opaque.
    </li>
    <li>
      The words come before the object in the reading order at every width. A
      poster title breaks and hyphenates rather than overflow on a phone.
    </li>
  {/snippet}
</CompositionPage>
