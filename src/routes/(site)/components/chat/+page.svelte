<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="chat" files={data.files}>
  {#snippet when()}
    <p>
      Use chat for a conversation with an assistant: a log of turns, and a
      composer that sends and stops. It fills the screen, or a box your app
      sizes. Replies are prose with code blocks, never markdown.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Wire <code>onsend</code> to your transport, and set <code>status</code> as the
      reply arrives.
    </li>
    <li>
      Set <code>newReply</code> when a reply ends, and clear it on the next send.
    </li>
    <li>
      Use <code>fill="parent"</code> inside a box that has a height of its own.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Give the assistant an avatar, or use the mark as its face.</li>
    <li>Pass raw markdown. Render it before the pane if your app wants it.</li>
    <li>Show a server's error detail in the log.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The log has two names. The outer region, "Messages", is a stop a keyboard
      can scroll. Inside it, a log named "Conversation" announces each addition
      whole: a turn, the "Responding" line, the "Stopped" line, the error. A
      streamed reply's words are never announced. The composer's status says
      "Responding", "Stopped" and "Response complete", once each.
    </li>
    <li>
      "Latest reply" appears when a reply has finished, and moves focus to its
      heading. The log's own "Scroll to end" button moves only the view. Each
      turn is headed "you" or "assistant", a level 3 heading in mono. It sits
      under the pane's level 2 title and the page's hidden <code>h1</code>.
    </li>
    <li>
      In the composer, Enter sends, Shift Enter breaks a line and Escape stops.
      One button is Send, then Stop while a reply runs. Nothing is ever
      disabled. Focus stays in the textarea after a send and a stop.
    </li>
    <li>
      An error is an alert inside the log, with one sentence and Retry. It has
      no live role, because the log announces it. No server detail is shown.
    </li>
    <li>
      No avatars: the mark is never the assistant's face. No markdown: fenced
      code becomes a small code block with its language and a copy button,
      highlighted as it streams. Everything else is prose, so no reply can carry
      a heading. An app that wants markdown renders it before the pane.
    </li>
    <li>
      The pane has a fixed height, so the log overflows and scrolls. It fills
      the viewport with <code>fill="screen"</code>, or a box your app sizes with
      <code>fill="parent"</code>. On a phone the pane is full-bleed, with the
      composer at the bottom.
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
