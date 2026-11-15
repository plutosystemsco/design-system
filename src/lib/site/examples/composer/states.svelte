<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Four states, the AI SDK's names: ready, submitted, streaming, error. At submitted and streaming the same button is Stop, secondary, with the spinner while submitted. Nothing is ever disabled: an empty submit is ignored and focus stays. The label can be shown.",
  };
</script>

<script lang="ts">
  import { Composer, type ComposerStatus } from "#lib/registry/ui/composer";

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  let status = $state<ComposerStatus>("ready");
  let value = $state("");
  let run = 0;

  // A fake reply: submitted for 700 ms, then streaming for 4 s.
  async function send() {
    const id = ++run;
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

<div class="max-w-2xl">
  <Composer
    data-testid="composer-labelled"
    labelVisible
    label="Your message"
    bind:value
    {status}
    onsend={send}
    onstop={stop}
  />
</div>
