<script lang="ts" module>
  export const meta = {
    title: "In a card",
    intro:
      "In a card row, a narrower bar is named by its aria-label, with its numbers beside it.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { Progress } from "#lib/registry/ui/progress";

  const steps = [
    { label: "Build", done: 7, of: 10, unit: "steps" },
    { label: "Tests", done: 212, of: 340, unit: "tests" },
  ];
</script>

<Card.Root size="sm" class="max-w-md">
  <Card.Content>
    <dl class="grid gap-3 text-sm">
      {#each steps as step (step.label)}
        <div class="flex items-center justify-between gap-4">
          <dt class="text-muted-foreground">{step.label}</dt>
          <dd class="flex items-center gap-3">
            <span class="font-mono tabular-nums"
              >{step.done} of {step.of} {step.unit}</span
            >
            <Progress
              class="w-24"
              aria-label={step.label}
              value={step.done}
              max={step.of}
              valuetext="{step.done} of {step.of} {step.unit}"
            />
          </dd>
        </div>
      {/each}
    </dl>
  </Card.Content>
</Card.Root>
