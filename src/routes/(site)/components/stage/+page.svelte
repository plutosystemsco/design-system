<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="stage">
  {#snippet when()}
    <p>
      Use a stage for each full-width section of an expressive page, such as a
      home page or a launch. It holds the section in the wide column and paints
      its ground: the canvas or a colour field.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        <code>{"<Stage>"}</code> holds a section's content in the wide column
        with the stage's fluid gutter. Pass <code>labelledby</code> or
        <code>label</code>
        to make it a named region; <code>element="div"</code> when it is not a section
        of its own.
      </li>
      <li>
        It sets <code>data-mode="expressive"</code> and paints its
        <code>ground</code>: <code>"canvas"</code> (the default, the page's own
        ground) or a colour field, <code>"field-1"</code> to
        <code>"field-4"</code>. A button inside keeps the 8 px case radius.
      </li>
      <li>
        On a field, headings, prose and figures take the field's roles. A
        control sits on a <code>surface-plain</code> surface with its own opaque
        ground (<code>bg-card</code>) or on glass, never on the field itself: a
        call to action, a footer and a hero without an object go in a canvas
        stage.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>
      Name a section stage with <code>labelledby</code> or <code>label</code>.
    </li>
    <li>
      Use <code>element="div"</code> when the stage is not a section of its own.
    </li>
    <li>
      Put a call to action, a footer, or a hero without an object, in a canvas
      stage.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Put a control straight on a colour field.</li>
    <li>
      Place it under a <code>.dark</code> ancestor other than <code>html</code>.
    </li>
    <li>Use it in an app's screens. It belongs on expressive pages.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      It follows the page's theme. It never carries <code>.dark</code>; never
      place it under a <code>.dark</code> ancestor other than
      <code>html</code>.
    </li>
    <li>
      Text on the canvas takes the theme's roles. On a field it takes the
      field's legend, 4.96:1 or more on each field in both themes, and so does a
      focus ring drawn on it.
    </li>
    <li>
      It clips sideways overflow, so nothing inside widens the page, and a
      sticky child still sticks.
    </li>
  {/snippet}
</CompositionPage>
