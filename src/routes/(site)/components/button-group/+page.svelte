<script lang="ts">
  import * as attached from "#lib/site/examples/button-group/attached.svelte";
  import * as doState from "#lib/site/examples/button-group/do-state.svelte";
  import * as doWeight from "#lib/site/examples/button-group/do-weight.svelte";
  import * as dontState from "#lib/site/examples/button-group/dont-state.svelte";
  import * as dontWeight from "#lib/site/examples/button-group/dont-weight.svelte";
  import * as spaced from "#lib/site/examples/button-group/spaced.svelte";
  import * as vertical from "#lib/site/examples/button-group/vertical.svelte";
  import * as withMenu from "#lib/site/examples/button-group/with-menu.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="button-group"
  examples={{ attached, "with-menu": withMenu, vertical, spaced }}
>
  {#snippet when()}
    <p>
      Use a button group for two or three related actions of equal weight, such
      as Edit and Duplicate with a More menu, or for a form's actions. For a
      choice of state, such as bold and italic, use a
      <code>toggle-group</code>. For more than three actions, use a menu.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Keep one primary at most, first, in a spaced group.
      {doWeight.meta.caption}
      <div
        data-pair="weight"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doWeight.default />
      </div>
    </li>
    <li>
      Use a toggle group for a state. {doState.meta.caption}
      <div
        data-pair="state"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doState.default />
      </div>
    </li>
    <li>
      Give attached groups secondary buttons, and a menu trigger last, for
      "more".
    </li>
    <li>Name the group with <code>aria-label</code>.</li>
  {/snippet}
  {#snippet donts()}
    <li>
      Join two primaries. {dontWeight.meta.breaks}
      <div
        data-pair="weight"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontWeight.default />
      </div>
    </li>
    <li>
      Use it for toggles. {dontState.meta.breaks}
      <div
        data-pair="state"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontState.default />
      </div>
    </li>
    <li>
      Put an input in it. An input with buttons is an <code>input-group</code>.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          A <code>role="group"</code>, named by your <code>aria-label</code>: a
          screen reader says "Clipboard, group" as focus enters it.
        </li>
        <li>
          Each button is its own Tab stop. Arrow keys do nothing here: roving
          focus belongs to a toolbar.
        </li>
        <li>
          Attached, a focused button is lifted above its neighbours, so its ring
          is never covered. Neighbours share one solid edge.
        </li>
        <li>Spaced, the buttons wrap, and stack full width below 640 px.</li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          Name the group, with <code>aria-label</code> or
          <code>aria-labelledby</code>.
        </li>
        <li>Keep attached groups to secondary buttons and menu triggers.</li>
        <li>Use one primary at most.</li>
      </ul>
    </li>
  {/snippet}
</Component>
