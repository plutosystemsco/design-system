<script lang="ts">
  import type { Snippet } from "svelte";
  import { version } from "$app/env";
  import AppShellFooter from "#lib/registry/components/app-shell-footer.svelte";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { ThemeScript, ThemeToggle } from "#lib/registry/ui/theme";

  let { children }: { children: Snippet } = $props();

  // 006 decision 16: this repository's commit (vite.config.ts sets the
  // version name from git; its default would be a timestamp) and the
  // commit's date, for the shell's footer.
  const commit = /^\d+$/.test(version) ? undefined : version;
  const builtAt = import.meta.env.VITE_BUILT_AT as string | undefined;
</script>

<!-- The theme's head script, once per page (005 decision 16). -->
<ThemeScript />

<!-- The lockup plays the page's one entrance, once per full load (006 decision 5). -->
<header class="groove-b bg-background">
  <div
    class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4"
  >
    <Lockup
      href="/"
      label="Pluto Systems design system"
      entrance
      class="text-2xl"
    />
    <ThemeToggle />
  </div>
</header>

<main class="mx-auto max-w-5xl px-6 py-12">
  {@render children()}
</main>

<!-- 008 decision 8: the site is Pluto Systems' own, so its footer carries the lockup (no entrance) and the brand line. -->
{#snippet logo()}
  <Lockup class="text-2xl" />
{/snippet}

<AppShellFooter
  appName="Pluto Systems"
  {logo}
  tagline="Work runs on data."
  {commit}
  {builtAt}
  sourceHref="https://github.com/plutosystemsco/design-system"
/>
