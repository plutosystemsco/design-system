import { highlightCode } from "#lib/registry/lib/highlighter";
import { THEME_KEY } from "#lib/registry/ui/theme";
import { addCommand } from "#lib/site/site";
import type { PageServerLoad } from "./$types";

const LAYOUT = `<script lang="ts">
  import { ThemeScript } from "#lib/components/ui/theme";
  let { children } = $props();
</script>

<ThemeScript />
{@render children()}`;

const TOGGLE = `<script lang="ts">
  import { ThemeToggle, theme } from "#lib/components/ui/theme";
</script>

<ThemeToggle />
<p>In force: {theme.resolved}. Chosen: {theme.preference}.</p>`;

/** The guide's code, highlighted at prerender. */
export const load: PageServerLoad = async () => {
  const add = addCommand("theme");
  return {
    key: THEME_KEY,
    add: { code: add, lines: await highlightCode(add, "bash") },
    layout: { code: LAYOUT, lines: await highlightCode(LAYOUT, "svelte") },
    toggle: { code: TOGGLE, lines: await highlightCode(TOGGLE, "svelte") },
  };
};
