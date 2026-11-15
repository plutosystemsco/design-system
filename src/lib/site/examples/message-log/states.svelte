<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Following: the end stays in view as a turn is added or a reply streams. Released: a wheel, a touch, a scrolling key or a scroll up lets the reader read; nothing moves them again until they return within 8 px of the end or press the button. A sm log fits a card.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import * as Message from "#lib/registry/ui/message";
  import { MessageLog } from "#lib/registry/ui/message-log";

  type Turn = { who: "you" | "assistant"; text: string };

  const turns: Turn[] = [
    { who: "you", text: "Run it with ten thousand." },
    {
      who: "assistant",
      text: "3.1416 on this run, by luck; a second run gave 3.1284. Ten thousand throws land within a few hundredths most of the time.",
    },
    { who: "you", text: "What did that cost in fuel?" },
    {
      who: "assistant",
      text: "1.2 billion instructions of the 30 billion budget. A million throws would spend most of it.",
    },
  ];
</script>

<Card.Root class="max-w-md">
  <Card.Header>
    <Card.Title>Dart throws</Card.Title>
    <Card.Description>The last exchange.</Card.Description>
  </Card.Header>
  <Card.Content>
    <MessageLog
      data-testid="log-small"
      label="Last exchange"
      class="h-48 text-xs"
    >
      {#each turns as turn, i (i)}
        <Message.Root align={turn.who === "you" ? "end" : "start"}>
          <Message.Group>
            <Message.Header>{turn.who}</Message.Header>
            <Message.Content variant={turn.who === "you" ? "bubble" : "plain"}>
              {turn.text}
            </Message.Content>
          </Message.Group>
        </Message.Root>
      {/each}
    </MessageLog>
  </Card.Content>
</Card.Root>
