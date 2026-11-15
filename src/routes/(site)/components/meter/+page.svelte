<script lang="ts">
  import * as states from "#lib/site/examples/meter/states.svelte";
  import * as variants from "#lib/site/examples/meter/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="meter" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a meter for a measurement within a known range, such as fuel used
      against a cap, or memory against a limit. For a task that moves towards
      done, use a native <code>&lt;progress&gt;</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Name every meter, with a label or an <code>aria-label</code>.</li>
    <li>
      Write the numbers beside it, and pass them as <code>valuetext</code>.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Let the fill be the only sign of the value.</li>
    <li>Use it to warn. Say "Stopped: out of fuel" in an alert.</li>
    <li>
      Use it for a task's progress. Use <code>&lt;progress&gt;</code>, which has
      its own role.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A native <code>&lt;meter&gt;</code>, exposed as <code>meter</code> with
      its value; <code>valuetext</code> becomes <code>aria-valuetext</code>, so
      a reader hears "4.81 billion instructions of 30 billion", not a
      percentage.
    </li>
    <li>
      <strong>A meter needs a name.</strong> Give it a
      <code>&lt;Label for&gt;</code>
      or an <code>aria-label</code>; this page shows both.
    </li>
    <li>
      <strong>Write the numbers beside it.</strong> The fill is a sign, not the only
      sign. The primary fill on the muted track passes the 3:1 a non-text mark needs,
      in both themes.
    </li>
    <li>
      It sets no <code>low</code>, <code>high</code> or <code>optimum</code>:
      fuel is a number, not a warning. A warning such as "Stopped: out of fuel"
      belongs in an alert.
    </li>
    <li>A meter is not interactive and has no keyboard behaviour.</li>
  {/snippet}
</Component>
