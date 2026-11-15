<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Two stops: the textarea and the send button. Enter sends and clears; Shift Enter adds a line; while a reply runs the button is Stop and Escape stops it.",
  };
</script>

<script lang="ts">
  import { Composer, type ComposerStatus } from "#lib/registry/ui/composer";

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let status = $state<ComposerStatus>("ready");
  let value = $state("");
  let sent = $state("");
  let run = 0;

  // A fake reply: submitted for 700 ms, then streaming for 4 s.
  async function send(text: string) {
    const id = ++run;
    sent = text;
    status = "submitted";
    await sleep(700);
    if (id !== run) return;
    status = "streaming";
    await sleep(4000);
    if (id !== run) return;
    status = "ready";
  }

  function stop() {
    run++;
    status = "ready";
  }
</script>

<div class="grid max-w-2xl gap-4">
  <div data-testid="keyboard-fixture">
    <Composer bind:value {status} onsend={send} onstop={stop} />
  </div>
  <p class="text-sm text-muted-foreground">
    {sent ? "Last sent: " : "Nothing sent yet."}<span data-testid="kb-sent"
      >{sent}</span
    >
  </p>
</div>
