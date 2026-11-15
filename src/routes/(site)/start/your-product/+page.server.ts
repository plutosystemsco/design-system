import { highlightCode } from "#lib/registry/lib/highlighter";
import { addCommand } from "#lib/site/site";
import type { PageServerLoad } from "./$types";

const SHELL = `<script lang="ts">
  import AppShellFooter from "#lib/components/app-shell-footer.svelte";
  import AppShellHeader from "#lib/components/app-shell-header.svelte";
  import Logo from "#lib/logo.svelte";
  let { children } = $props();
</script>

{#snippet logo(place: "header" | "footer")}
  <Logo class={place === "header" ? "h-8 w-auto" : "h-6 w-auto"} />
{/snippet}

<AppShellHeader appName="Pluto Docs" {logo} />
{@render children()}
<AppShellFooter appName="Pluto Docs" {logo} endorsed />`;

/** The guide's code, highlighted at prerender. */
export const load: PageServerLoad = async () => {
  const add = addCommand("app-shell");
  return {
    add: { code: add, lines: await highlightCode(add, "bash") },
    shell: { code: SHELL, lines: await highlightCode(SHELL, "svelte") },
  };
};
