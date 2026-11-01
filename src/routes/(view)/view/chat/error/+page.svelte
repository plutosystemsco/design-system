<script lang="ts">
  import ChatView from "#lib/preview/chat-view.svelte";
</script>

<ChatView
  messages={[
    {
      id: "m1",
      role: "user",
      text: "Show me a function that adds two numbers.",
    },
  ]}
  status="error"
/>
