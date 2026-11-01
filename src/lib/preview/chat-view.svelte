<script lang="ts">
  import ChatPane from "#lib/registry/components/chat-pane.svelte";
  import type {
    ChatMessage,
    ChatStatus,
  } from "#lib/registry/components/chat-types";

  /**
   * A state view of the chat (006 decision 12): the pane with its turns and
   * status set, around the same stub the page file carries.
   */
  let {
    messages,
    status = "ready",
    newReply = false,
  }: {
    messages: ChatMessage[];
    status?: ChatStatus;
    newReply?: boolean;
  } = $props();

  // The props seed the state; the stub then drives it (a view's own copy).
  // svelte-ignore state_referenced_locally
  let current = $state(status);
  // svelte-ignore state_referenced_locally
  let turns = $state(messages);
  // svelte-ignore state_referenced_locally
  let latest = $state(newReply);
  let run = 0;
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function reply(): Promise<void> {
    const id = ++run;
    current = "submitted";
    await sleep(700);
    if (id !== run) return;
    current = "streaming";
    turns.push({ id: `r${id}`, role: "assistant", text: "" });
    const last = turns.length - 1;
    for (const token of "Here is one, with a docstring.".split(/(?<=\s)/)) {
      await sleep(60);
      if (id !== run) return;
      turns[last]!.text += token;
    }
    current = "ready";
    latest = true;
  }
</script>

<svelte:head><title>Chat</title></svelte:head>

<h1 class="sr-only">Chat</h1>
<ChatPane
  messages={turns}
  status={current}
  newReply={latest}
  onsend={(text) => {
    latest = false;
    turns.push({ id: `u${++run}`, role: "user", text });
    void reply();
  }}
  onstop={() => {
    run++;
    current = "ready";
    turns.push({ id: `s${run}`, role: "marker", text: "Stopped" });
  }}
  onnew={() => {
    run++;
    turns = [];
    current = "ready";
    latest = false;
  }}
  onretry={() => {
    latest = false;
    void reply();
  }}
/>
