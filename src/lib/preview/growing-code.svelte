<script lang="ts">
  import { onDestroy } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { Status } from "#lib/registry/ui/status";

  let {
    code,
    language,
    label = "Start",
  }: { code: string; language: string; label?: string } = $props();

  // Nothing moves until the visitor asks (the design book §06): the string grows only after
  // the button is pressed, a few characters at a time.
  let shown = $state("");
  let timer: ReturnType<typeof setInterval> | undefined;
  // State, not derived from the timer: a plain `let` is not tracked.
  let running = $state(false);
  const done = $derived(shown.length >= code.length);

  function start() {
    stop();
    shown = "";
    running = true;
    timer = setInterval(() => {
      shown = code.slice(0, shown.length + 3);
      if (shown.length >= code.length) stop();
    }, 40);
  }

  function stop() {
    clearInterval(timer);
    timer = undefined;
    running = false;
  }

  onDestroy(stop);
</script>

<div class="grid w-full gap-4">
  <div class="flex flex-wrap items-center gap-3">
    <Button variant="secondary" size="sm" onclick={start} disabled={running}>
      {shown ? "Start again" : label}
    </Button>
    <Status
      visible
      class="font-mono text-xs text-muted-foreground"
      text={done ? "Highlighted as it arrived" : running ? "Streaming…" : ""}
    />
  </div>
  <CodeBlock.Root data-testid="growing-block">
    <CodeBlock.Content code={shown} {language} lineNumbers />
  </CodeBlock.Root>
</div>
