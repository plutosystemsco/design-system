<script lang="ts" module>
  export const meta = {
    title: "Three calls",
    intro:
      "A later class of the same kind wins. A size and a colour are different kinds, so text-sm and text-destructive both stay.",
  };
</script>

<script lang="ts">
  import { cn } from "#lib/utils";

  const calls: string[][] = [
    ["p-2", "p-4"],
    ["bg-primary", "bg-destructive"],
    ["text-sm", "text-destructive"],
  ];
</script>

<ul class="grid gap-3">
  {#each calls as args (args.join())}
    <li class="rounded border border-border bg-card p-4 text-sm">
      <code class="break-all"
        >cn({args.map((a) => JSON.stringify(a)).join(", ")})</code
      >
      returns
      <code class="break-all">{JSON.stringify(cn(...args))}</code>
    </li>
  {/each}
</ul>
