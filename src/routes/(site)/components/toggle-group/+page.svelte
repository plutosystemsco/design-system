<script lang="ts">
  import * as keyboard from "#lib/site/examples/toggle-group/keyboard.svelte";
  import * as states from "#lib/site/examples/toggle-group/states.svelte";
  import * as variants from "#lib/site/examples/toggle-group/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="toggle-group" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a toggle group for a short row of related choices that apply at once:
      a time range, a view, text styles. Single mode picks one; multiple mode
      picks several. For a choice saved with a form, use a radio group or
      checkboxes.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Name the row with an <code>aria-label</code>, such as "Time range".</li>
    <li>Keep it to a few short items that fit on one line.</li>
    <li>Give each icon-only item an <code>aria-label</code>.</li>
  {/snippet}
  {#snippet donts()}
    <li>Run a query as focus moves. Act when an item is selected.</li>
    <li>
      Space the items apart. For separate toggles, use <code>Toggle</code>s.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The row is a <code>group</code>; give it an <code>aria-label</code>. In
      single mode the items are radios with <code>aria-checked</code>; in
      multiple mode they are buttons with <code>aria-pressed</code>.
    </li>
    <li>
      One Tab stop for the row. The arrow keys, Home and End move focus without
      selecting; Space or Enter selects. Browse, then apply: a preset strip that
      selected on arrow would fire a query per key press.
    </li>
    <li>
      The selected item is inverted, never a faint tint. Icon-only items need an
      <code>aria-label</code> each.
    </li>
    <li>
      Items join; there is no spacing prop. For separate toggles, put
      <code>Toggle</code>s in a flex row.
    </li>
  {/snippet}
</Component>
