<script lang="ts">
  import * as heights from "#lib/site/examples/button/heights.svelte";
  import * as keyboard from "#lib/site/examples/button/keyboard.svelte";
  import * as states from "#lib/site/examples/button/states.svelte";
  import * as variants from "#lib/site/examples/button/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="button" examples={{ variants, states, heights, keyboard }}>
  {#snippet when()}
    <p>
      Use a button to start an action: save, send, delete. To go somewhere, use
      a link. Each surface has one default button, for the thing most people
      came to do. The others step back as secondary or ghost.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Name the action with a verb: "Save changes", not "OK".</li>
    <li>Keep one default button per surface.</li>
    <li>Show busy while the action runs, so it is not sent twice.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a button to go to another page. Use a link.</li>
    <li>Put two default buttons side by side.</li>
    <li>Disable a button with no reason shown beside it.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>&lt;button type="button"&gt;</code> by default, pressed by Enter
      or Space. With <code>href</code> it is an <code>&lt;a&gt;</code>, which
      Enter follows.
    </li>
    <li>
      An icon-only button needs an <code>aria-label</code>. A tooltip, if any,
      repeats it.
    </li>
    <li>
      Busy shows a spinner and sets <code>aria-busy="true"</code>. The button
      stays enabled and focused but ignores clicks, so a form is not sent twice.
      Disabled leaves the tab order.
    </li>
    <li>Focus shows the 2 px ring. Every button is at least 32 px tall.</li>
    <li>
      An icon you pass into a button is decoration. Give it <code
        >aria-hidden="true"</code
      >: phosphor icons render <code>role="img"</code> with no name.
    </li>
  {/snippet}
</Component>
