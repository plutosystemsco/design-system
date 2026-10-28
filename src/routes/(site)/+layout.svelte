<script lang="ts">
  import type { Snippet } from "svelte";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import ThemeToggle from "#lib/preview/theme-toggle.svelte";

  let { children }: { children: Snippet } = $props();
</script>

<header class="border-b border-border">
  <div
    class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4"
  >
    <Lockup href="/" label="Pluto Systems design system" class="text-2xl" />
    <ThemeToggle />
  </div>
</header>

<main class="mx-auto max-w-5xl px-6 py-12">
  {@render children()}
</main>
