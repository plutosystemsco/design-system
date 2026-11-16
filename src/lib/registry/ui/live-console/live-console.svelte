<script lang="ts" module>
  /** A command the console offers, under its tab's label. */
  export type LiveConsoleExample = {
    /** The example's tab label. */
    label: string;
    /** The command the example runs, shown and passed to `run`. */
    command: string;
  };
  /** One measurement of a run, shown as a meter with its numbers. */
  export type LiveConsoleMeter = {
    /** What the meter measures. */
    label: string;
    /** The measured value. */
    value: number;
    /** The value a full meter stands for. */
    max: number;
  };
  /** What a run resolves to. */
  export type LiveConsoleResult = {
    /** The meters to show, filled from zero. */
    meters: LiveConsoleMeter[];
    /** The run's output, one line each. */
    lines: string[];
  };
</script>

<script lang="ts">
  import { tween } from "#lib/registry/lib/read-token";
  import { Button } from "#lib/registry/ui/button";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import { Meter } from "#lib/registry/ui/meter";
  import { Status } from "#lib/registry/ui/status";
  import * as Tabs from "#lib/registry/ui/tabs";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    examples,
    run,
    title,
    language,
    class: className,
    ...restProps
  }: WithElementRef<Omit<HTMLAttributes<HTMLElement>, "title" | "children">> & {
    /** One to four. */
    examples: LiveConsoleExample[];
    /** Runs a command; a rejection's message is shown. */
    run: (command: string) => Promise<LiveConsoleResult>;
    /** The console's heading, which names it. */
    title: string;
    /** The language the commands are highlighted in, as `code-block` takes it. */
    language?: string;
  } = $props();

  const uid = $props.id();
  let selected = $state("0");
  let busy = $state(false);
  let meters = $state<LiveConsoleMeter[]>([]);
  let fills = $state<number[]>([]);
  let lines = $state<string[]>([]);
  let error = $state("");
  let said = $state("");
  let frame = 0;
  let cancels: (() => void)[] = [];
  // Each run and each tab change takes a new ticket; a result that arrives
  // for an older one is dropped, since it belongs to another command.
  let ticket = 0;

  function clear() {
    cancelAnimationFrame(frame);
    cancels.forEach((cancel) => cancel());
    cancels = [];
    meters = [];
    fills = [];
    lines = [];
    error = "";
    said = "";
  }

  // As the stage card: cleared, then set on the next frame, so the same
  // result twice is announced twice.
  function announce(text: string) {
    said = "";
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => (said = text));
  }

  async function start() {
    const command = examples[Number(selected)]?.command;
    if (busy || command === undefined) return;
    clear();
    busy = true;
    const mine = ++ticket;
    try {
      const result = await run(command);
      if (mine !== ticket) return;
      busy = false;
      lines = result.lines;
      // The meters mount at 0, then fill to the result on the next frame
      // over the fill duration.
      meters = result.meters;
      fills = result.meters.map(() => 0);
      requestAnimationFrame(() => {
        if (mine !== ticket) return;
        cancels = result.meters.map((meter, index) =>
          tween({
            from: 0,
            to: meter.value,
            duration: "motion-fill",
            ease: "ease-standard",
            element: ref ?? undefined,
            onFrame: (value) => (fills[index] = value),
          }),
        );
      });
      announce(
        `Ran. ${result.lines.length} ${result.lines.length === 1 ? "line" : "lines"}.`,
      );
    } catch (reason) {
      if (mine !== ticket) return;
      busy = false;
      error = reason instanceof Error ? reason.message : String(reason);
      announce("Run failed.");
    }
  }

  // A tab change clears the output: it belongs to the other command.
  function changed() {
    ticket++;
    busy = false;
    clear();
  }

  // Gone: a later result's ticket is stale, so it changes nothing.
  $effect(() => () => {
    ticket++;
    cancelAnimationFrame(frame);
    cancels.forEach((cancel) => cancel());
  });
</script>

<!--
  A working tool shown on a stage, so it is productive: its tabs and buttons
  keep the productive corner and size. A flat card with the
  theme's own roles (surface-plain), so it reads the same on a field, and an
  edge in the primary inside it while a run works (busy-edge).
  One tab per example, each panel its
  command in a code block; the panels are not stops of their own, the code is.
  After a run, a row per meter: its label, the meter at the track height,
  and its numbers beside it; then the lines, and the status says the outcome.
-->
<section
  bind:this={ref}
  data-slot="live-console"
  data-mode="productive"
  data-busy={busy ? "" : undefined}
  aria-labelledby="{uid}-title"
  class={cn(
    "surface-plain busy-edge grid gap-6 overflow-hidden rounded-lg border border-border bg-card p-6 text-card-foreground",
    className,
  )}
  {...restProps}
>
  <h2 id="{uid}-title" class="text-2xl font-bold tracking-section">{title}</h2>
  <Tabs.Root bind:value={selected} onValueChange={changed} class="gap-4">
    <Tabs.List>
      {#each examples as example, index (index)}
        <Tabs.Trigger value={String(index)}>{example.label}</Tabs.Trigger>
      {/each}
    </Tabs.List>
    {#each examples as example, index (index)}
      <Tabs.Content value={String(index)} tabindex={-1}>
        <CodeBlock.Root>
          <CodeBlock.Content code={example.command} {language} />
        </CodeBlock.Root>
      </Tabs.Content>
    {/each}
  </Tabs.Root>
  <div>
    <Button {busy} onclick={start}>Run</Button>
  </div>
  {#if meters.length}
    <div class="grid gap-4">
      {#each meters as meter, index (index)}
        <div data-slot="live-console-meter" class="grid gap-2">
          <div class="flex items-baseline justify-between gap-4">
            <label for="{uid}-meter-{index}" class="text-sm"
              >{meter.label}</label
            >
            <span
              data-console="numbers"
              class="font-mono text-sm text-muted-foreground"
              >{meter.value} / {meter.max}</span
            >
          </div>
          <Meter
            id="{uid}-meter-{index}"
            value={fills[index] ?? 0}
            max={meter.max}
            valuetext="{meter.value} of {meter.max}"
            class="h-(--size-track)"
          />
        </div>
      {/each}
    </div>
  {/if}
  <ul
    data-slot="live-console-output"
    aria-label="Output"
    aria-busy={busy ? "true" : undefined}
    class={cn(
      "grid gap-1 font-mono text-sm wrap-anywhere",
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
  <Status data-console="status" text={said} />
</section>
