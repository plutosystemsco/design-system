<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
  import * as Marker from "#lib/registry/ui/marker";
  import * as Message from "#lib/registry/ui/message";
  import { MessageLog } from "#lib/registry/ui/message-log";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  type Turn = { who: "you" | "assistant"; text: string };

  const opening: Turn[] = [
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
  ];

  const reply =
    "The square has a side of one. A point lands inside the quarter circle when the sum of its squared coordinates is at most one. Counting those and dividing by every throw gives a quarter of pi, so the estimate is four times that share. The error falls with the square root of the count, which is why two decimal places take about a million throws and three take a hundred million.".split(
      " ",
    );

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function makeThread() {
    let turns = $state<Turn[]>(opening.map((t) => ({ ...t })));
    let streaming = $state(false);
    return {
      get turns() {
        return turns;
      },
      get streaming() {
        return streaming;
      },
      add() {
        turns.push({ who: "you", text: "And with a hundred thousand?" });
      },
      async stream() {
        if (streaming) return;
        streaming = true;
        turns.push({ who: "assistant", text: "" });
        const last = turns.length - 1;
        for (const word of reply) {
          await sleep(40);
          turns[last].text += (turns[last].text ? " " : "") + word;
        }
        streaming = false;
      },
    };
  }

  const main = makeThread();
  const fixture = makeThread();
</script>

<ItemHeader name="message-log" />

{#snippet thread(turns: Turn[], marker: boolean)}
  {#each turns as turn, i (i)}
    {#if marker && i === 4}
      <Marker.Root variant="separator">
        <Marker.Content>Earlier today</Marker.Content>
      </Marker.Root>
    {/if}
    <Message.Root align={turn.who === "you" ? "end" : "start"}>
      <Message.Group>
        <Message.Header>{turn.who}</Message.Header>
        <Message.Content variant={turn.who === "you" ? "bubble" : "plain"}>
          {turn.text}
        </Message.Content>
      </Message.Group>
    </Message.Root>
  {/each}
{/snippet}

<PreviewSection
  id="variants"
  title="Variants"
  intro="A scroll box named Messages, with a stop of its own, holding a log named Conversation. It opens at its end and follows new content until the reader scrolls away; a button then pins over the bottom edge to bring them back. Nothing moves on load: the stream starts when you press the button."
>
  <div class="grid gap-4">
    <MessageLog
      data-testid="log-main"
      class="h-96 rounded border border-border p-4"
      busy={main.streaming}
    >
      {@render thread(main.turns, true)}
    </MessageLog>
    <div class="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        data-testid="log-add"
        onclick={() => main.add()}>Add a turn</Button
      >
      <Button
        variant="secondary"
        size="sm"
        data-testid="log-stream"
        busy={main.streaming}
        onclick={() => main.stream()}
        >{main.streaming ? "Streaming" : "Stream a reply"}</Button
      >
    </div>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Following: the end stays in view as a turn is added or a reply streams. Released: a wheel, a touch, a scrolling key or a scroll up lets the reader read; nothing moves them again until they return within 8 px of the end or press the button. A sm log fits a card."
>
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
        {@render thread(opening.slice(4), false)}
      </MessageLog>
    </Card.Content>
  </Card.Root>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The box is a <code>region</code> named "Messages" with
      <code>tabindex="0"</code>, so a keyboard user can focus and scroll it; the
      log inside is <code>role="log"</code> named "Conversation". Both names are props.
      A reader entering the box hears both.
    </li>
    <li>
      The log announces what is added whole: a user turn, a marker line, an
      alert. A streamed reply is never read by the log (<code
        >aria-relevant="additions"</code
      >); the composer's status says "Responding", "Stopped" and "Response
      complete". Pass
      <code>busy</code> while a reply streams for readers that honour
      <code>aria-busy</code>.
    </li>
    <li>
      The button, "Scroll to end", is hidden while the box is at its end or
      following, so it is a stop only when there is somewhere to go. It scrolls
      smoothly unless the reader prefers reduced motion.
    </li>
    <li>
      <code>scroll-padding-bottom</code> of 96 px keeps a focused element above a
      sticky composer.
    </li>
    <li>
      The button pins over the box's bottom-end corner, and while the reader is
      scrolled away it may cover the corner of whatever sits there. An app that
      wants it clear of the text places a control of its own outside the box,
      over the composer's groove.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="One stop: the region. End scrolls it to the end; ArrowUp releases the follow, and a streamed reply then does not move it; the button appears, and Enter on it returns to the end. Two stops while released."
>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        data-testid="kb-add"
        onclick={() => fixture.add()}>Add a turn to the log</Button
      >
      <Button
        variant="secondary"
        size="sm"
        class="w-fit"
        data-testid="kb-stream"
        busy={fixture.streaming}
        onclick={() => fixture.stream()}
        >{fixture.streaming
          ? "Streaming"
          : "Stream a reply into the log"}</Button
      >
    </div>
    <div data-testid="keyboard-fixture">
      <MessageLog
        label="Keyboard messages"
        class="h-64 rounded border border-border p-4"
      >
        {@render thread(fixture.turns, false)}
      </MessageLog>
    </div>
  </div>
</PreviewSection>
