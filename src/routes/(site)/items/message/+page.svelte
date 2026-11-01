<script lang="ts">
  import * as Avatar from "#lib/registry/ui/avatar";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import * as Message from "#lib/registry/ui/message";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  const code = `import random

inside = 0
for _ in range(10_000):
    x, y = random.random(), random.random()
    if x * x + y * y <= 1:
        inside += 1
print(4 * inside / 10_000)`;
</script>

<ItemHeader name="message" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One turn of a conversation: an avatar slot, then a column of a heading that says who, the content, and a footer. A user turn is a bubble on the muted inset at the end of the row; the assistant's is plain prose, full width, with no ground."
>
  <div class="grid max-w-2xl gap-6">
    <Message.Root align="end" data-testid="message-user">
      <Message.Avatar>
        <Avatar.Root>
          <Avatar.Fallback>CG</Avatar.Fallback>
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
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Two contents and no more: plain and bubble. An error reply is an Alert in the log, not a bubble; a status line is a marker. The avatar slot has no ground and no radius of its own: the avatar item inside it has both."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    The seven stock bubble variants are not served: their tints are computed
    colours, the solid primary spends the one accent the send button owns, and
    red is the alert's.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
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
      markdown is the app's.
    </li>
  </ul>
</PreviewSection>
