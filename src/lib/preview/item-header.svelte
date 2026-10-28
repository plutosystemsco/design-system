<script lang="ts">
  import { page } from "$app/state";
  import Eyebrow from "./eyebrow.svelte";
  import InstallCommand from "./install-command.svelte";

  type Entry = { type: string; title: string; description: string };
  let { name }: { name: string } = $props();

  const item = $derived(
    (page.data.registry as Record<string, Entry> | undefined)?.[name],
  );
</script>

<svelte:head
  ><title>{item?.title ?? name} · Pluto Systems design system</title
  ></svelte:head
>

<Eyebrow>{item?.type ?? "registry:ui"} · {name}</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">{item?.title ?? name}</h1>
<p class="mt-4 max-w-prose text-muted-foreground">{item?.description}</p>
<div class="mt-6"><InstallCommand {name} /></div>
