<script lang="ts" module>
  /** Where a run stands: before one, while it works, after it resolves, after it rejects. */
  export type StageCardState = "idle" | "busy" | "done" | "error";
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { Status } from "#lib/registry/ui/status";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    title,
    code,
    language,
    run,
    runLabel = "Run",
    onstate,
    class: className,
    ...restProps
  }: WithElementRef<
    Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">
  > & {
    /** The code block's title, such as a file name. Not a heading. */
    title: string;
    /** The code, copied as written. */
    code: string;
    /** The language the code is highlighted in, as `code-block` takes it. */
    language?: string;
    /** Runs the code and resolves to its output lines; a rejection's message is shown. Without it, no Run button. */
    run?: () => Promise<string[]>;
    runLabel?: string;
    /** Told each time the run's state changes, so a parent can answer it. */
    onstate?: (state: StageCardState) => void;
  } = $props();

  let busy = $state(false);
  let lines = $state<string[]>([]);
  let error = $state("");
  let said = $state("");
  let frame = 0;
  // Set when the card is gone: a run that settles later changes nothing.
  let gone = false;

  // A polite region announces a change, and the same text twice is none, so
  // it is cleared and set again on the next frame (010 decision 3).
  function announce(text: string) {
    said = "";
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => (said = text));
  }

  async function start() {
    if (!run || busy) return;
    busy = true;
    said = "";
    onstate?.("busy");
    try {
      const output = await run();
      if (gone) return;
      lines = output;
      error = "";
      busy = false;
      onstate?.("done");
      announce(
        `Ran. ${output.length} ${output.length === 1 ? "line" : "lines"}.`,
      );
    } catch (reason) {
      if (gone) return;
      // The rejection's own message, so the error directs (010 decision 3).
      lines = [];
      error = reason instanceof Error ? reason.message : String(reason);
      busy = false;
      onstate?.("error");
      announce("Run failed.");
    }
  }

  // An effect's cleanup runs in the browser only; the server has no frames.
  $effect(() => () => {
    gone = true;
    cancelAnimationFrame(frame);
  });
</script>

<!--
  A flat card: the theme's own roles on its raised ground (surface-plain), so
  it reads the same on the canvas or a field, and while a run works an edge
  in the primary inside it (busy-edge; 012 decision 5). The code block sits
  inset, so its focus
  indicator is never clipped by the card. Its header holds the title, the copy
  button and, with `run`, Run, which shows the button's busy state and keeps
  focus. The output list is there from the first render, so its busy state can
  be read; it shows once it holds a line. The status says the outcome.
-->
<div
  bind:this={ref}
  data-slot="stage-card"
  data-busy={busy ? "" : undefined}
  class={cn(
    "surface-plain busy-edge grid gap-2 overflow-hidden rounded-lg border border-border bg-card p-2 text-card-foreground",
    className,
  )}
  {...restProps}
>
  <CodeBlock.Root>
    <CodeBlock.Header>
      <CodeBlock.Title>{title}</CodeBlock.Title>
      <CodeBlock.Actions>
        <CodeBlock.CopyButton {code} />
        {#if run}
          <Button
            size="sm"
            class="h-(--size-action-small)"
            {busy}
            onclick={start}>{runLabel}</Button
          >
        {/if}
      </CodeBlock.Actions>
    </CodeBlock.Header>
    <CodeBlock.Content {code} {language} />
  </CodeBlock.Root>
  {#if run}
    <ul
      data-slot="stage-card-output"
      aria-label="Output"
      aria-busy={busy ? "true" : undefined}
      class={cn(
        "grid gap-1 px-2 pb-2 font-mono text-sm wrap-anywhere",
        !lines.length && !error && "hidden",
      )}
    >
      {#each lines as line, index (index)}
        <li>{line}</li>
      {/each}
      {#if error}
        <li class="text-destructive">{error}</li>
      {/if}
    </ul>
    <Status data-stage-card="status" text={said} />
  {/if}
</div>
