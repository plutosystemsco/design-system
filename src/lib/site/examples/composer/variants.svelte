<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A textarea that grows from 64 px to 256 px and scrolls inside after that, a 48 px send button, and a hint with the keys. Send becomes Stop while a reply runs. The reply here is a fake stream, started by your message.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Composer, type ComposerStatus } from "#lib/registry/ui/composer";
  import * as Message from "#lib/registry/ui/message";
  import { MessageLog } from "#lib/registry/ui/message-log";

  type Turn = { who: "you" | "assistant"; text: string };

  const reply =
    "Throw points at a unit square and count the ones inside the quarter circle. The share inside, times four, approaches pi as the throws grow. The error falls with the square root of the count, so two decimal places take about a million throws and three take a hundred million. Ten thousand throws land within a few hundredths most of the time, which is enough to see the idea.".split(
      " ",
    );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let turns = $state<Turn[]>([]);
  let status = $state<ComposerStatus>("ready");
  let value = $state("");
  let sent = $state("");
  let run = 0;

  // A fake chat: send starts a reply that streams word by word; stop ends it.
  async function send(text: string) {
    const id = ++run;
    sent = text;
    turns.push({ who: "you", text });
    status = "submitted";
    await sleep(700);
    if (id !== run) return;
    status = "streaming";
    turns.push({ who: "assistant", text: "" });
    const last = turns.length - 1;
    for (const word of reply) {
      await sleep(60);
      if (id !== run) return;
      turns[last].text += (turns[last].text ? " " : "") + word;
    }
    status = "ready";
  }

  function stop() {
    run++;
    status = "ready";
  }
</script>

<div class="grid max-w-2xl gap-4">
  <MessageLog
    data-testid="log-composer"
    class="h-64 rounded border border-border p-4"
    busy={status === "streaming"}
  >
    {#each turns as turn, i (i)}
      <Message.Root align={turn.who === "you" ? "end" : "start"}>
        <Message.Group>
          <Message.Header>{turn.who}</Message.Header>
          <Message.Content variant={turn.who === "you" ? "bubble" : "plain"}
            >{turn.text}</Message.Content
          >
        </Message.Group>
      </Message.Root>
    {/each}
  </MessageLog>
  <Composer
    data-testid="composer-main"
    bind:value
    {status}
    onsend={send}
    onstop={stop}
    placeholder="Ask about the dart throws"
  />
  <div class="flex items-center gap-4">
    <Button
      variant="secondary"
      size="sm"
      data-testid="composer-clear"
      onclick={() => (value = "")}>Clear the draft</Button
    >
    <p class="text-sm text-muted-foreground">
      {sent ? "Last sent: " : "Nothing sent yet."}<span
        data-testid="composer-sent">{sent}</span
      >
    </p>
  </div>
</div>
