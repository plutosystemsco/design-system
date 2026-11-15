<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="stage-hero">
  {#snippet when()}
    <p>
      Use the stage hero to open an expressive page: words on glass, and an
      object on a colour field beside them. Its title is the page's one heading
      by default.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Place it in a <code>{"<Stage>"}</code>. Pass <code>title</code>,
        <code>description</code>, one or two <code>actions</code>, an
        <code>object</code> snippet of opaque things (cards carrying
        <code>surface-plain</code>, figures, images), and a <code>strip</code>.
      </li>
      <li>
        The words sit in a glass panel; the object sits on the colour field that
        <code>field</code> names (<code>"field-1"</code> by default). From lg the
        glass overlaps the field by three of twelve columns and the object stays clear
        of it; below lg the glass comes first and overlaps the field's top.
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
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>
      Pass opaque things as the object: cards carrying <code>surface-plain</code
      >, figures, images.
    </li>
    <li>Keep to one or two actions.</li>
    <li>Set <code>underBar</code> when an overlaying bar sits above it.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use <code>poster</code> for anything but a launch.</li>
    <li>
      Leave out the object in a field stage. The words would sit on the field.
    </li>
    <li>
      Leave its title an <code>h1</code> on a page that already has one. Pass
      <code>headingLevel={2}</code> there.
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
