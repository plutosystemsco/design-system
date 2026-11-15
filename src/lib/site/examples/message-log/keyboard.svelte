<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the region. End scrolls it to the end; ArrowUp releases the follow, and a streamed reply then does not move it; the button appears, and Enter on it returns to the end. Two stops while released.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as Message from "#lib/registry/ui/message";
  import { MessageLog } from "#lib/registry/ui/message-log";

  type Turn = { who: "you" | "assistant"; text: string };

  let turns = $state<Turn[]>([
    { who: "you", text: "Estimate pi by throwing darts at a square." },
    {
      who: "assistant",
      text: "Throw points at a unit square and count the ones inside the quarter circle. The share inside, times four, approaches pi as the throws grow.",
    },
    { who: "you", text: "How many throws for two decimal places?" },
    {
      who: "assistant",
      text: "About a million. The error falls with the square root of the count, so each extra digit costs a hundred times the throws.",
    },
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
  ]);
  let streaming = $state(false);

  const reply =
    "The square has a side of one. A point lands inside the quarter circle when the sum of its squared coordinates is at most one. Counting those and dividing by every throw gives a quarter of pi, so the estimate is four times that share. The error falls with the square root of the count, which is why two decimal places take about a million throws and three take a hundred million.".split(
      " ",
    );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function add() {
    turns.push({ who: "you", text: "And with a hundred thousand?" });
  }

  // A fake reply, one word every 40 ms.
  async function stream() {
    if (streaming) return;
    streaming = true;
    turns.push({ who: "assistant", text: "" });
    const last = turns.length - 1;
    for (const word of reply) {
      await sleep(40);
      turns[last].text += (turns[last].text ? " " : "") + word;
    }
    streaming = false;
  }
</script>

<div class="grid gap-4">
  <div class="flex flex-wrap gap-2">
    <Button variant="secondary" size="sm" data-testid="kb-add" onclick={add}
      >Add a turn to the log</Button
    >
    <Button
      variant="secondary"
      size="sm"
      data-testid="kb-stream"
      busy={streaming}
      onclick={stream}
      >{streaming ? "Streaming" : "Stream a reply into the log"}</Button
    >
  </div>
  <div data-testid="keyboard-fixture">
    <MessageLog
      label="Keyboard messages"
      class="h-64 rounded border border-border p-4"
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
  </div>
</div>
