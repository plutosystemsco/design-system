<script lang="ts">
  // The identity exhibit (decisions.md, "The identity is commissioned, with
  // options"). A research exhibit: it shows candidates, so its specimens may
  // hold candidate values the token file does not. The candidate faces load
  // here only, never on the registry's own pages.
  import "@fontsource-variable/figtree";
  import "@fontsource-variable/funnel-display";
  import "@fontsource-variable/funnel-sans";
  import "@fontsource-variable/instrument-sans";
  import "@fontsource-variable/geist-mono";
  import "@fontsource/ibm-plex-mono/400.css";
  import "@fontsource/ibm-plex-mono/500.css";
  import type { Snippet } from "svelte";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { ThemeScript, ThemeToggle } from "#lib/registry/ui/theme";

  let { children }: { children: Snippet } = $props();
</script>

<ThemeScript />

<header class="groove-b bg-background">
  <div
    class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4"
  >
    <div class="flex items-center gap-4">
      <Lockup
        href="/identity/"
        label="Pluto identity, the options"
        class="text-2xl"
      />
      <span
        class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase"
        >identity · options for review</span
      >
    </div>
    <ThemeToggle />
  </div>
</header>

<main id="main">
  {@render children()}
</main>
