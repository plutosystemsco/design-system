<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One turn of a conversation: an avatar slot, then a column of a heading that says who, the content, and a footer. A user turn is a bubble on the muted inset at the end of the row; the assistant's is plain prose, full width, with no ground.",
  };
</script>

<script lang="ts">
  import * as Avatar from "#lib/registry/ui/avatar";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import * as Message from "#lib/registry/ui/message";

  const code = `import random

inside = 0
for _ in range(10_000):
    x, y = random.random(), random.random()
    if x * x + y * y <= 1:
        inside += 1
print(4 * inside / 10_000)`;
</script>

<div class="grid max-w-2xl gap-6">
  <Message.Root align="end" data-testid="message-user">
    <Message.Avatar>
      <Avatar.Root>
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar.Root>
    </Message.Avatar>
    <Message.Group>
      <Message.Header>you</Message.Header>
      <Message.Content variant="bubble"
        >Estimate pi by throwing darts at a square, in Python.</Message.Content
      >
    </Message.Group>
  </Message.Root>
  <Message.Root data-testid="message-assistant">
    <Message.Group>
      <Message.Header>assistant</Message.Header>
      <Message.Content>
        <p>
          Throw points at a unit square and count the ones inside the quarter
          circle. The share inside, times four, approaches pi as the throws
          grow.
        </p>
        <CodeBlock.Root size="sm">
          <CodeBlock.Content {code} lineNumbers />
        </CodeBlock.Root>
        <p>Ten thousand throws land within a few hundredths most runs.</p>
      </Message.Content>
    </Message.Group>
  </Message.Root>
  <Message.Root data-testid="message-footer">
    <Message.Group>
      <Message.Header level={4}>assistant</Message.Header>
      <Message.Content
        >1.2 billion instructions of the 30 billion budget.</Message.Content
      >
      <Message.Footer>ran in 0.4 s</Message.Footer>
    </Message.Group>
  </Message.Root>
</div>
