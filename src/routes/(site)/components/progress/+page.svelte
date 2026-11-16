<script lang="ts">
  import * as doNumbers from "#lib/site/examples/progress/do-numbers.svelte";
  import * as doUnknown from "#lib/site/examples/progress/do-unknown.svelte";
  import * as dontNumbers from "#lib/site/examples/progress/dont-numbers.svelte";
  import * as dontUnknown from "#lib/site/examples/progress/dont-unknown.svelte";
  import * as inACard from "#lib/site/examples/progress/in-a-card.svelte";
  import * as states from "#lib/site/examples/progress/states.svelte";
  import * as upload from "#lib/site/examples/progress/upload.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="progress" examples={{ upload, states, "in-a-card": inACard }}>
  {#snippet when()}
    <p>
      Use a progress bar for a task with a known amount to do, such as files
      uploaded or steps run. For a measurement within a range, such as memory
      against a limit, use a <code>meter</code>. For a wait of unknown length,
      use a <code>spinner</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Write the numbers beside it, and pass them as <code>valuetext</code>.
      {doNumbers.meta.caption}
      <div
        data-pair="numbers"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doNumbers.default />
      </div>
    </li>
    <li>
      Use a spinner when you cannot say how much is left.
      {doUnknown.meta.caption}
      <div
        data-pair="unknown"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doUnknown.default />
      </div>
    </li>
    <li>
      Announce the start and the end with a <code>status</code>, and say a
      failure in words beside the destructive fill.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Show the bar alone. {dontNumbers.meta.breaks}
      <div
        data-pair="numbers"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontNumbers.default />
      </div>
    </li>
    <li>
      Hold a bar at 0 for an unknown wait. {dontUnknown.meta.breaks}
      <div
        data-pair="unknown"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontUnknown.default />
      </div>
    </li>
    <li>Make the bar a live region: a reader would hear every step.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          A native <code>&lt;progress&gt;</code>, exposed as
          <code>progressbar</code> with its value; <code>valuetext</code>
          becomes
          <code>aria-valuetext</code>, so a reader hears "3 of 12 files", not a
          percentage. No <code>aria-valuemax</code> is set: the element has its own.
        </li>
        <li>
          It always has a value. A <code>null</code> from untyped code draws as 0,
          so no engine shows its own indeterminate bar.
        </li>
        <li>
          The fill reaches 3:1 against the track in both themes, and keeps its
          colours under forced colours, so it stays drawn.
        </li>
        <li>
          It is silent by design: not a live region, and no keyboard behaviour.
        </li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          Name it, with a <code>&lt;Label for&gt;</code> or an
          <code>aria-label</code>.
        </li>
        <li>Write the numbers beside it.</li>
        <li>
          Announce the start and the end with a <code>status</code>.
        </li>
      </ul>
    </li>
  {/snippet}
</Component>
