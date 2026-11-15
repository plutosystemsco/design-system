<script lang="ts">
  import * as keyboard from "#lib/site/examples/composer/keyboard.svelte";
  import * as states from "#lib/site/examples/composer/states.svelte";
  import * as variants from "#lib/site/examples/composer/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="composer" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use the composer where a reader writes a message to an assistant, under a
      message log. Pass it the chat's status, and it turns Send into Stop while
      a reply runs.
    </p>
    <p>
      An error is the consuming app's alert in the log, with a retry; the
      composer only returns to Send. Where <code>field-sizing</code> is absent, the
      textarea keeps its minimum and scrolls inside. The composer's file must be among
      Tailwind's sources, so that its height cap emits its variable.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Pass the chat's status: ready, submitted, streaming or error.</li>
    <li>Handle <code>onstop</code>, so a reader can stop a reply.</li>
    <li>Show the label when the composer is not the page's only field.</li>
  {/snippet}
  {#snippet donts()}
    <li>Disable the composer while a reply runs.</li>
    <li>Show an error in the composer. Put an alert in the log.</li>
    <li>Add a second button to stop a reply.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The textarea is named "Message" (visually hidden unless
      <code>labelVisible</code>) and described by the visible hint, wired by
      <code>aria-describedby</code>.
    </li>
    <li>
      Enter sends; Shift Enter inserts a line; Enter while an input method
      editor is composing confirms its candidate and does not send; Escape stops
      a running reply; Enter while a reply runs does nothing.
    </li>
    <li>
      One button, "Send message", becomes "Stop response" and back, so focus
      never has to move; focus stays in the textarea after send and after stop.
    </li>
    <li>
      A polite status says "Responding" when a message is sent, "Stopped" on a
      stop, and "Response complete" when a reply ends; the ready after a stop is
      silent.
    </li>
  {/snippet}
</Component>
