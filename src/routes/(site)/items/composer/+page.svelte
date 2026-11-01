<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Composer, type ComposerStatus } from "#lib/registry/ui/composer";
  import * as Message from "#lib/registry/ui/message";
  import { MessageLog } from "#lib/registry/ui/message-log";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  type Turn = { who: "you" | "assistant"; text: string };

  const reply =
    "Throw points at a unit square and count the ones inside the quarter circle. The share inside, times four, approaches pi as the throws grow. The error falls with the square root of the count, so two decimal places take about a million throws and three take a hundred million. Ten thousand throws land within a few hundredths most of the time, which is enough to see the idea.".split(
      " ",
    );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  /** A fake chat: send starts a reply that streams sixty words; stop ends it. */
  function makeChat() {
    let turns = $state<Turn[]>([]);
    let status = $state<ComposerStatus>("ready");
    let sent = $state("");
    let value = $state("");
    let run = 0;
    return {
      get turns() {
        return turns;
      },
      get status() {
        return status;
      },
      set status(next) {
        status = next;
      },
      get sent() {
        return sent;
      },
      get value() {
        return value;
      },
      set value(next) {
        value = next;
      },
      clear() {
        value = "";
      },
      async send(text: string) {
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
      },
      stop() {
        run++;
        status = "ready";
      },
    };
  }

  const main = makeChat();
  const labelled = makeChat();
  const fixture = makeChat();
</script>

<ItemHeader name="composer" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A textarea that grows from 64 px to 256 px and scrolls inside after that, a 48 px send button, and a hint with the keys. Send becomes Stop while a reply runs. The reply here is a fake stream, started by your message."
>
  <div class="grid max-w-2xl gap-4">
    <MessageLog
      data-testid="log-composer"
      class="h-64 rounded border border-border p-4"
      busy={main.status === "streaming"}
    >
      {#each main.turns as turn, i (i)}
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
      bind:value={main.value}
      status={main.status}
      onsend={(text) => main.send(text)}
      onstop={() => main.stop()}
      placeholder="Ask about the dart throws"
    />
    <div class="flex items-center gap-4">
      <Button
        variant="secondary"
        size="sm"
        data-testid="composer-clear"
        onclick={() => main.clear()}>Clear the draft</Button
      >
      <p class="text-sm text-muted-foreground">
        {main.sent ? "Last sent: " : "Nothing sent yet."}<span
          data-testid="composer-sent">{main.sent}</span
        >
      </p>
    </div>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Four states, the AI SDK's names: ready, submitted, streaming, error. At submitted and streaming the same button is Stop, secondary, with the spinner while submitted. Nothing is ever disabled: an empty submit is ignored and focus stays. The label can be shown."
>
  <div class="grid max-w-2xl gap-4">
    <Composer
      data-testid="composer-labelled"
      labelVisible
      label="Your message"
      bind:value={labelled.value}
      status={labelled.status}
      onsend={(text) => labelled.send(text)}
      onstop={() => labelled.stop()}
    />
    <p class="max-w-prose text-sm text-muted-foreground">
      An error is the app's alert in the log, with a retry; the composer only
      returns to Send. Where <code>field-sizing</code> is absent, the textarea keeps
      its minimum and scrolls inside. The composer's file must be among Tailwind's
      sources, so that its height cap emits its variable.
    </p>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The textarea is named "Message" (visually hidden unless
      <code>labelVisible</code>) and described by the visible hint, wired by
      <code>aria-describedby</code>.
    </li>
    <li>
      Enter sends; Shift Enter inserts a line; Enter while an input method
      editor is composing confirms its candidate and does not send; Escape stops
      a running reply; Enter while a reply runs does nothing.
    </li>
    <li>
      One button, "Send message", becomes "Stop response" and back, so focus
      never has to move; focus stays in the textarea after send and after stop.
    </li>
    <li>
      A polite status says "Responding" when a message is sent, "Stopped" on a
      stop, and "Response complete" when a reply ends; the ready after a stop is
      silent.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: the textarea and the send button. Enter sends and clears; Shift Enter adds a line; while a reply runs the button is Stop and Escape stops it."
>
  <div class="grid max-w-2xl gap-4">
    <div data-testid="keyboard-fixture">
      <Composer
        bind:value={fixture.value}
        status={fixture.status}
        onsend={(text) => fixture.send(text)}
        onstop={() => fixture.stop()}
      />
    </div>
    <p class="text-sm text-muted-foreground">
      {fixture.sent ? "Last sent: " : "Nothing sent yet."}<span
        data-testid="kb-sent">{fixture.sent}</span
      >
    </p>
  </div>
</PreviewSection>
