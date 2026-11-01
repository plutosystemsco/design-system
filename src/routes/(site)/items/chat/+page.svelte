<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="chat" files={data.files}>
  {#snippet accessibility()}
    <li>
      The log has two names: a region "Messages", a stop that a keyboard
      scrolls, holding a log "Conversation" that announces what is added whole:
      a turn, the "Responding" line, the "Stopped" line, the error. A streamed
      reply's words are never announced; the composer's status says
      "Responding", "Stopped" and "Response complete" once each.
    </li>
    <li>
      "Latest reply" appears when a reply has finished and moves the reader to
      its heading; the log's own "Scroll to end" button moves the view. Each
      turn is a level 3 heading in mono, "you" or "assistant", under the pane's
      level 2 title and the page's hidden <code>h1</code>.
    </li>
    <li>
      The composer: Enter sends, Shift Enter breaks a line, Escape stops. One
      button is Send and becomes Stop; nothing is ever disabled; focus stays in
      the textarea after a send and a stop.
    </li>
    <li>
      An error is an alert inside the log with no live role (the log announces
      it), one sentence, and Retry. No server detail is shown.
    </li>
    <li>
      No avatars: the mark is never the assistant's face. No markdown: fenced
      code becomes a small code block with its language and a copy button,
      highlighted as it streams; everything else is prose, so no reply can carry
      a heading. An app that wants markdown renders it before the pane.
    </li>
    <li>
      A fixed height (<code>fill="screen"</code> is the viewport; "parent" fills a
      box the app sizes), so the log overflows and scrolls. On a phone the pane is
      full-bleed with the composer at the bottom; iOS Safari's keyboard is untested.
    </li>
  {/snippet}
  {#snippet setup()}
    <li>
      Replace the stub in <code>+page.svelte</code> with your transport: push
      the user's turn and set <code>status</code> to <code>submitted</code> on
      send, <code>streaming</code> as text arrives, <code>ready</code> when it
      ends (and <code>newReply</code> true), <code>error</code> when it fails.
      Clear <code>newReply</code> on the next send.
    </li>
  {/snippet}
</BlockPage>
