<script lang="ts">
  import { cn } from "#lib/utils";
  import Eyebrow from "#lib/preview/eyebrow.svelte";
  import InstallCommand from "#lib/preview/install-command.svelte";

  const calls: [string[], string][] = [
    [["p-2", "p-4"], cn("p-2", "p-4")],
    [["bg-primary", "bg-destructive"], cn("bg-primary", "bg-destructive")],
    [["text-sm", "text-destructive"], cn("text-sm", "text-destructive")],
  ];
</script>

<svelte:head><title>Utils · Pluto Systems design system</title></svelte:head>

<Eyebrow>registry:lib · utils</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">Utils</h1>
<p class="mt-4 max-w-prose text-muted-foreground">
  <code>cn</code> merges class names the way Tailwind reads them: a later class
  of the same kind wins. The file also exports the prop-type helpers stock
  components import:
  <code>WithoutChild</code>, <code>WithoutChildren</code>,
  <code>WithoutChildrenOrChild</code>
  and
  <code>WithElementRef</code>.
</p>
<div class="mt-6"><InstallCommand name="utils" /></div>

<h2 class="mt-12 text-2xl font-bold tracking-section">Three calls</h2>
<ul class="mt-6 grid gap-3">
  {#each calls as [args, result] (args.join())}
    <li class="rounded border border-border bg-card p-4">
      <code class="text-sm break-all"
        >cn({args.map((a) => JSON.stringify(a)).join(", ")}) → {JSON.stringify(
          result,
        )}</code
      >
    </li>
  {/each}
</ul>
