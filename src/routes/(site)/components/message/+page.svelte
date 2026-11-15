<script lang="ts">
  import * as variants from "#lib/site/examples/message/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="message" examples={{ variants }}>
  {#snippet when()}
    <p>
      Use a message for one turn of a conversation, inside a message log. A user
      turn is a bubble; the assistant's is plain prose.
    </p>
    <p>
      Two contents and no more: plain and bubble. An error reply is an Alert in
      the log, not a bubble; a status line is a marker. The avatar slot has no
      ground and no radius of its own: the avatar item inside it has both.
    </p>
    <p>
      The seven stock bubble variants are not served: their tints are computed
      colours, the solid primary spends the one accent the send button owns, and
      red is the alert's.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Say who speaks in the header: "you", "assistant".</li>
    <li>Set the header's <code>level</code> to fit the page's headings.</li>
    <li>Put fenced code in a code block at <code>sm</code>.</li>
  {/snippet}
  {#snippet donts()}
    <li>Show an error as a bubble. Use an alert in the log.</li>
    <li>Use a message for a status line. Use a marker.</li>
    <li>Colour a bubble to tell turns apart.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The header is a heading (<code>level</code>, default 3) with
      <code>tabindex="-1"</code>: a reader can walk the turns by heading, and a
      "Latest reply" control can move focus to the newest one. Tab does not stop
      on it.
    </li>
    <li>
      Inside a message log, a turn added whole is announced; a streamed reply is
      not. The composer's status carries the words.
    </li>
    <li>
      Fenced code in a reply is a <code>code-block</code> at <code>sm</code>;
      markdown is the consuming app's.
    </li>
  {/snippet}
</Component>
