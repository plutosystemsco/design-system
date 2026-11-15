<script lang="ts" module>
  export const meta = {
    title: "In the browser",
    intro:
      "One engine labels code: tree-sitter parses it and this system's own queries name each node's role. On the server, highlightCode returns plain data for a load function. In the browser, a session re-parses only what changed as code streams. Nothing here moves until you press Start.",
  };
</script>

<script lang="ts">
  import { onDestroy } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { Status } from "#lib/registry/ui/status";

  const code = `import numpy as np

def mean(values: list[float]) -> float:
    """The arithmetic mean."""
    total = sum(values)  # no numpy needed here
    return total / len(values)

print(mean([1.5, 2.5, 3.5]), np.__version__)`;

  // Nothing moves until the reader asks: the string grows only after the
  // button is pressed, three characters at a time. Python's grammar loads
  // on first use.
  let shown = $state("");
  let running = $state(false);
  let timer: ReturnType<typeof setInterval> | undefined;
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
    <CodeBlock.Content code={shown} language="python" lineNumbers />
  </CodeBlock.Root>
</div>
