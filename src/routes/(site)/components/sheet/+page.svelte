<script lang="ts">
  import * as keyboard from "#lib/site/examples/sheet/keyboard.svelte";
  import * as variants from "#lib/site/examples/sheet/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="sheet" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use a sheet for a panel of related content beside the page: navigation on
      a phone, filters, a short form, a long read. For a single task that must
      finish before the page goes on, use a dialog.
    </p>
    <p>
      Its trigger opens it and reports <code>aria-expanded</code>. While it is
      open, the scrim, a dimmed layer, blocks the page behind. Escape, a click
      on the scrim or the close button closes it. It fades out before it leaves.
    </p>
    <p>
      It has no border: its shadow draws the edge. A long body scrolls inside
      the panel.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give every sheet a title, or a <code>label</code> when it has none.</li>
    <li>
      Open it from the edge its content belongs to: navigation from the start,
      details from the end, the default.
    </li>
    <li>
      Write the primary action last in its footer. On a phone it then shows on
      top.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Open a sheet from inside another sheet.</li>
    <li>Use a sheet for a quick confirm. Use a dialog.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>role="dialog"</code> with <code>aria-modal="true"</code>, named by
      its title and described by its description.
    </li>
    <li>
      <strong>A name is required.</strong> A <code>Sheet.Title</code> inside the
      content names it. Without one, pass <code>label</code>. The type checker
      cannot tell when both are missing, so open each sheet under axe to check.
    </li>
    <li>
      The title is a heading, level 2 by default. Pass <code>level</code> to fit the
      page's outline.
    </li>
    <li>
      On open, focus moves to the first tabbable element inside. Tab loops
      inside the sheet, and the 32 px close button is the last stop. Escape
      closes it and returns focus to the trigger.
    </li>
  {/snippet}
</Component>
