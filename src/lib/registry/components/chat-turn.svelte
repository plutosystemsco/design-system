<script lang="ts">
  import ChatText from "#lib/registry/components/chat-text.svelte";
  import type { ChatMessage } from "#lib/registry/components/chat-types";
  import * as Marker from "#lib/registry/ui/marker";
  import * as Message from "#lib/registry/ui/message";

  let {
    message,
    names = { user: "you", assistant: "assistant" },
  }: {
    message: ChatMessage;
    /** The mono headings over the turns; an app may pass the agent's name. */
    names?: { user: string; assistant: string };
  } = $props();
</script>

<!--
  One turn: a user turn is a bubble at the end of the column, the
  assistant's is plain prose; each headed by who spoke, a level 3 heading in
  mono that "Latest reply" can focus. A marker is a separator line with its
  text, such as "Stopped". No avatars: the mark is never the assistant's face.
-->
{#if message.role === "marker"}
  <Marker.Root variant="separator" data-chat="marker">
    <Marker.Content>{message.text}</Marker.Content>
  </Marker.Root>
{:else}
  <Message.Root
    align={message.role === "user" ? "end" : "start"}
    data-chat="turn"
    data-role={message.role}
  >
    <Message.Group>
      <Message.Header level={3}>{names[message.role]}</Message.Header>
      <Message.Content variant={message.role === "user" ? "bubble" : "plain"}>
        <ChatText text={message.text} />
      </Message.Content>
    </Message.Group>
  </Message.Root>
{/if}
