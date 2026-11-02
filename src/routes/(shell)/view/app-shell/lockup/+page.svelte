<script lang="ts">
  import AppShellView from "#lib/preview/app-shell-view.svelte";
  import { Lockup } from "#lib/registry/ui/four-dot";
</script>

<!-- 008 decision 8: a Pluto Systems property, whose logo is the lockup; only the header's plays the entrance. -->
{#snippet logo(place: "header" | "footer")}
  <Lockup entrance={place === "header"} class="text-2xl" />
{/snippet}

<AppShellView appName="Pluto Systems" {logo} tagline="Work runs on data." />
