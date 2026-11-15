<script lang="ts">
  import * as keyboard from "#lib/site/examples/field/keyboard.svelte";
  import * as states from "#lib/site/examples/field/states.svelte";
  import * as variants from "#lib/site/examples/field/variants.svelte";
  import * as wiring from "#lib/site/examples/field/wiring.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="field" examples={{ variants, states, wiring, keyboard }}>
  {#snippet when()}
    <p>
      Use a field around every form control that has a label. It ties the label,
      the description and the error to the control, so you never write an id by
      hand. Use a set, with a legend, for a group of radios or checkboxes.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Pass <code>description</code> and <code>error</code> as props.</li>
    <li>
      Use <code>orientation="horizontal"</code> for a checkbox or a switch.
    </li>
    <li>Say in the error what to do: "Enter a project name."</li>
  {/snippet}
  {#snippet donts()}
    <li>Wire <code>aria-describedby</code> by hand inside a field.</li>
    <li>Make the error a live region.</li>
    <li>Put two controls in one field: both would take its id.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>Field</code> gives its control three things: an <code>id</code> that
      its label's <code>for</code> names; <code>aria-describedby</code>, naming
      the description and the error; and <code>aria-invalid</code> when there is an
      error. All three come from props, so they are in the server HTML.
    </li>
    <li>
      The error is text, not a live region: errors appear on submit, and focus
      moves to an error summary or the first invalid field.
    </li>
    <li>
      A group of radios or checkboxes uses <code>FieldSet</code> and its legend.
      The set describes its own <code>&lt;fieldset&gt;</code> with its
      description and error. A radio group takes the set's wiring and is named
      by the legend; a checkbox never takes the set's ids, only its own
      <code>Field</code>'s.
    </li>
    <li>
      A choice card's label wraps its control, so the control also names itself
      with <code>aria-labelledby</code> on the card's title.
    </li>
  {/snippet}
</Component>
