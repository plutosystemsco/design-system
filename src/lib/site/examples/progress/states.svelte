<script lang="ts" module>
  export const meta = {
    title: "Not started, part way, done and failed",
    intro:
      "Each bar keeps its label and its numbers. A failed task takes the destructive fill, and says so in words beside it.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { Progress } from "#lib/registry/ui/progress";

  const bars = [
    { id: "0", label: "Not started", value: 0, text: "0 of 100" },
    { id: "40", label: "Indexing", value: 40, text: "40 of 100" },
    { id: "done", label: "Indexed", value: 100, text: "100 of 100" },
  ];
  // site:hide
  // A value from untyped code: the bar draws it as 0, never indeterminate.
  const untyped = null as unknown as number;
  // site:show
</script>

<div class="grid max-w-md gap-8">
  {#each bars as bar (bar.id)}
    <div class="grid gap-2" data-testid="progress-{bar.id}">
      <div
        class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
      >
        <Label for="index-{bar.id}">{bar.label}</Label>
        <span class="font-mono text-sm text-muted-foreground tabular-nums"
          >{bar.text}</span
        >
      </div>
      <Progress id="index-{bar.id}" value={bar.value} valuetext={bar.text} />
    </div>
  {/each}
  <div class="grid gap-2" data-testid="progress-failed">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <Label for="index-failed">Indexing</Label>
      <span class="text-sm text-destructive">Failed at 40%</span>
    </div>
    <Progress
      id="index-failed"
      value={40}
      variant="destructive"
      valuetext="Failed at 40 of 100"
    />
  </div>
  <!-- site:hide -->
  <div hidden data-testid="progress-untyped">
    <Progress value={untyped} aria-label="Untyped" />
  </div>
  <!-- site:show -->
</div>
