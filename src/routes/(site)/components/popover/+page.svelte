<script lang="ts">
  import * as keyboard from "#lib/site/examples/popover/keyboard.svelte";
  import * as variants from "#lib/site/examples/popover/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="popover" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use a popover for a little more detail, or a short form, next to the
      button that asked for it. For a choice that must be made before going on,
      use an alert dialog.
    </p>
    <p>
      It is closed until its trigger is pressed, which says
      <code>aria-expanded</code>. Open, focus moves to the first stop inside and
      loops; Escape or a click outside closes it and focus returns to the
      trigger.
    </p>
    <p>
      It has no border: the elevation shadow already draws the hairline as a
      spread layer, and a border would draw it twice.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give every popover a title, or pass <code>label</code>.</li>
    <li>Keep it to one subject: a sentence, a link or a short form.</li>
    <li>Align it to the start when its trigger sits at the edge.</li>
  {/snippet}
  {#snippet donts()}
    <li>Put a long form or a second popover inside one.</li>
    <li>Open a popover on hover. Use a tooltip.</li>
    <li>Add a border to the content.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The trigger promises a dialog (<code>aria-haspopup="dialog"</code>); the
      content keeps the promise with <code>role="dialog"</code>.
    </li>
    <li>
      <strong>Every popover has a name.</strong> A <code>Popover.Title</code>
      inside it names it through <code>aria-labelledby</code>; without one, pass
      <code>label</code>. One of the two is mandatory, and the type checker
      cannot enforce it, so the tests open each popover under axe.
    </li>
    <li>
      The title is a heading, level 2 by default; pass <code>level</code> to fit the
      page's outline.
    </li>
    <li>
      Focus moves to the first tabbable element inside on open and loops within;
      Escape closes it and returns focus to the trigger.
    </li>
  {/snippet}
</Component>
