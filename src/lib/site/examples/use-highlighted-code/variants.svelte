<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "useHighlightedCode(() => code, () => language) returns lines: a plain string per line until the highlighter loads, then the line's tokens, each with its content and its class. Only the lines after the last complete newline are tokenised as the string grows, from the saved grammar state. Press Start to stream a run's result.",
  };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { useHighlightedCode } from "#lib/registry/hooks/use-highlighted-code.svelte.js";
  import { Button } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { Status } from "#lib/registry/ui/status";

  const result = `{
  "stdout": "5 3 4 6 7 8 9 1 2\\n",
  "stderr": "",
  "fuel": 4810000000,
  "ok": true
}`;

  // Nothing moves until the reader asks: the string grows only after the
  // button is pressed, three characters at a time.
  let shown = $state("");
  let running = $state(false);
  let timer: ReturnType<typeof setInterval> | undefined;
  const done = $derived(shown.length >= result.length);

  const lines = useHighlightedCode(
    () => shown,
    () => "json",
  );

  function start() {
    stop();
    shown = "";
    running = true;
    timer = setInterval(() => {
      shown = result.slice(0, shown.length + 3);
      if (shown.length >= result.length) stop();
    }, 40);
  }

  function stop() {
    clearInterval(timer);
    timer = undefined;
    running = false;
  }

  onDestroy(stop);
</script>

<div class="grid max-w-2xl gap-4">
  <div class="flex flex-wrap items-center gap-3">
    <Button variant="secondary" size="sm" onclick={start} disabled={running}>
      {shown ? "Start again" : "Start"}
    </Button>
    <Status
      visible
      class="font-mono text-xs text-muted-foreground"
      text={done ? "Highlighted as it arrived" : running ? "Streaming…" : ""}
    />
  </div>
  <CodeBlock.Root data-testid="growing-block">
    <CodeBlock.Content
      lineNumbers
      role="region"
      aria-label="The streamed result"
    >
      {#each lines.current as line, index (index)}
        <CodeBlock.Line code={line} />
      {/each}
    </CodeBlock.Content>
  </CodeBlock.Root>
</div>
