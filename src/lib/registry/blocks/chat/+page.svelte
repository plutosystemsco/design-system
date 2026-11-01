<script lang="ts">
  import ChatPane from "#lib/registry/components/chat-pane.svelte";
  import type {
    ChatMessage,
    ChatStatus,
  } from "#lib/registry/components/chat-types";

  // A stand-in for your server. Replace it: wire onsend to your transport,
  // set status as the reply arrives, and set newReply when it finishes.
  const REPLY = [
    "Here is one, with a docstring.",
    "",
    "```python",
    "def add(a, b):",
    '    """Add two numbers."""',
    "    return a + b",
    "```",
    "",
    "Call it with two numbers.",
  ].join("\n");

  let messages = $state<ChatMessage[]>([]);
  let status = $state<ChatStatus>("ready");
  let newReply = $state(false);
  let run = 0;
  let count = 0;
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  async function reply(): Promise<void> {
    const id = ++run;
    status = "submitted";
    await sleep(700);
    if (id !== run) return;
    status = "streaming";
    const turn: ChatMessage = {
      id: `m${++count}`,
      role: "assistant",
      text: "",
    };
    messages.push(turn);
    const last = messages.length - 1;
    // Word by word, over about two seconds; the fence's newlines stay.
    for (const token of REPLY.split(/(?<=\s)/)) {
      await sleep(60);
      if (id !== run) return;
      messages[last]!.text += token;
    }
    status = "ready";
    newReply = true;
  }

  function onsend(text: string): void {
    newReply = false;
    messages.push({ id: `m${++count}`, role: "user", text });
    void reply();
  }

  function onstop(): void {
    run++;
    status = "ready";
    messages.push({ id: `m${++count}`, role: "marker", text: "Stopped" });
  }

  function onnew(): void {
    run++;
    messages = [];
    status = "ready";
    newReply = false;
  }

  function onretry(): void {
    newReply = false;
    void reply();
  }
</script>

<svelte:head><title>Chat</title></svelte:head>

<h1 class="sr-only">Chat</h1>
<ChatPane {messages} {status} {newReply} {onsend} {onstop} {onnew} {onretry} />
