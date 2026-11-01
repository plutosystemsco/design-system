<script lang="ts">
  import ChatView from "#lib/preview/chat-view.svelte";
</script>

<ChatView
  messages={[
    { id: "m1", role: "user", text: "What can you do here?" },
    {
      id: "m2",
      role: "assistant",
      text: "I answer in prose, and show code in a block you can copy.",
    },
    {
      id: "m3",
      role: "user",
      text: "Show me a function that adds two numbers.",
    },
    {
      id: "m4",
      role: "assistant",
      text: 'Here is one, with a docstring.\n\n```python\ndef add(a, b):\n    """Add two numbers."""\n    return a + b\n```\n\nCall it with two numbers.',
    },
  ]}
  newReply
/>
