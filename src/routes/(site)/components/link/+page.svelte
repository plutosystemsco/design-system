<script lang="ts">
  import * as doAction from "#lib/site/examples/link/do-action.svelte";
  import * as doWords from "#lib/site/examples/link/do-words.svelte";
  import * as dontAction from "#lib/site/examples/link/dont-action.svelte";
  import * as dontWords from "#lib/site/examples/link/dont-words.svelte";
  import * as inherit from "#lib/site/examples/link/inherit.svelte";
  import * as inline from "#lib/site/examples/link/inline.svelte";
  import * as newTab from "#lib/site/examples/link/new-tab.svelte";
  import * as standalone from "#lib/site/examples/link/standalone.svelte";
  import * as visited from "#lib/site/examples/link/visited.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="link"
  examples={{ inline, standalone, "new-tab": newTab, visited, inherit }}
>
  {#snippet when()}
    <p>
      Use a link to go somewhere: another page, or a place on this one, inside a
      sentence or alone in a list. To do something, such as save or delete, use
      a <code>button</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Write link text that makes sense alone. {doWords.meta.caption}
      <div
        data-pair="words"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doWords.default />
      </div>
    </li>
    <li>
      Use a button for an action. {doAction.meta.caption}
      <div
        data-pair="action"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doAction.default />
      </div>
    </li>
    <li>
      Set <code>standalone</code> on a link alone on its line, so its target is 24
      px tall.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Write "click here" or "read more". {dontWords.meta.breaks}
      <div
        data-pair="words"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontWords.default />
      </div>
    </li>
    <li>
      Make a link that does something. {dontAction.meta.breaks}
      <div
        data-pair="action"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontAction.default />
      </div>
    </li>
    <li>
      Open a new tab without a reason. It takes the Back button away; use
      <code>newTab</code> rarely.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          A native <code>&lt;a href&gt;</code>, one Tab stop. Enter follows it.
          Focus is the theme's ring.
        </li>
        <li>
          Always underlined, so a link is never told by its colour alone; on
          hover the line is thicker.
        </li>
        <li>
          The primary colour reaches 4.5:1 on the page and on a card, in both
          themes. <code>variant="inherit"</code> takes the surrounding text's colour,
          and keeps the underline.
        </li>
        <li>
          <code>standalone</code> gives a 24 px tall target.
        </li>
        <li>
          <code>newTab</code> shows an icon, hidden from assistive technology,
          says "(opens in a new tab)" to a screen reader, and merges
          <code>noopener noreferrer</code> into your <code>rel</code>.
        </li>
        <li>
          No disabled link: a link that goes nowhere is text.
          <code>visited</code> changes only the colour, so it is never the only sign.
        </li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>Write link text that makes sense alone, out of its sentence.</li>
        <li>Use a button for an action.</li>
      </ul>
    </li>
  {/snippet}
</Component>
