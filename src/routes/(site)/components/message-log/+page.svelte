<script lang="ts">
  import * as keyboard from "#lib/site/examples/message-log/keyboard.svelte";
  import * as states from "#lib/site/examples/message-log/states.svelte";
  import * as variants from "#lib/site/examples/message-log/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="message-log" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use the message log to hold a conversation: the turns, the markers between
      them and the reply that is streaming. It keeps the newest content in view
      until the reader scrolls away to read.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give the log a fixed height, so it scrolls inside itself.</li>
    <li>Pass <code>busy</code> while a reply streams.</li>
    <li>Let the composer's status say what the reply is doing.</li>
  {/snippet}
  {#snippet donts()}
    <li>Scroll the reader back to the end while they read.</li>
    <li>Make the log announce a streamed reply word by word.</li>
    <li>Wrap the log in another scroll box.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The box is a <code>region</code> named "Messages" with
      <code>tabindex="0"</code>, so a keyboard user can focus and scroll it; the
      log inside is <code>role="log"</code> named "Conversation". Both names are props.
      A reader entering the box hears both.
    </li>
    <li>
      The log announces what is added whole: a user turn, a marker line, an
      alert. A streamed reply is never read by the log (<code
        >aria-relevant="additions"</code
      >); the composer's status says "Responding", "Stopped" and "Response
      complete". Pass
      <code>busy</code> while a reply streams for readers that honour
      <code>aria-busy</code>.
    </li>
    <li>
      The button, "Scroll to end", is hidden while the box is at its end or
      following, so it is a stop only when there is somewhere to go. It scrolls
      smoothly unless the reader prefers reduced motion.
    </li>
    <li>
      <code>scroll-padding-bottom</code> of 96 px keeps a focused element above a
      sticky composer.
    </li>
    <li>
      The button pins over the box's bottom-end corner, and while the reader is
      scrolled away it may cover the corner of whatever sits there. An app that
      wants it clear of the text places a control of its own outside the box,
      over the composer's groove.
    </li>
  {/snippet}
</Component>
