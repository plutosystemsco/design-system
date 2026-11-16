<script lang="ts" module>
  /**
   * The head script, as a constant. It reads the key
   * `theme.svelte.ts` writes, else the system's preference, and sets the
   * `dark` class before first paint. Storage may be unavailable. A `light`
   * or `dark` stored under the key before 0.13.0, `pluto-theme`, is carried
   * over when the new key holds no choice, and the old key is removed; the
   * carry-over goes in 0.14.0. The steps are `readStoredTheme`'s in
   * `stored.ts`; the two must agree.
   */
  export const THEME_SCRIPT = [
    "(function () {",
    '  var query = "(prefers-color-scheme: dark)";',
    "  var dark;",
    "  try {",
    '    var stored = localStorage.getItem("kuiper-theme");',
    '    if (stored !== "light" && stored !== "dark") {',
    '      var old = localStorage.getItem("pluto-theme");',
    '      if (old === "light" || old === "dark") {',
    '        localStorage.setItem("kuiper-theme", old);',
    "        stored = old;",
    "      }",
    "    }",
    '    localStorage.removeItem("pluto-theme");',
    '    dark = stored === "light" || stored === "dark"',
    '      ? stored === "dark"',
    "      : matchMedia(query).matches;",
    "  } catch (e) {",
    "    dark = matchMedia(query).matches;",
    "  }",
    '  document.documentElement.classList.toggle("dark", dark);',
    "})();",
  ].join("\n");
</script>

<script lang="ts">
  let {
    nonce,
  }: {
    /** For an app with a Content Security Policy: SvelteKit's own nonces never reach a script written through `{@html}`. */
    nonce?: string;
  } = $props();

  // A nonce is base64; anything else is dropped rather than written into markup.
  const attribute = $derived(
    nonce ? ` nonce="${nonce.replace(/[^A-Za-z0-9+/=_-]/g, "")}"` : "",
  );
  const tag = $derived(`<script${attribute}>${THEME_SCRIPT}</${"script"}>`);
</script>

<!--
  Rendered once, in the app's root layout, so the script is in the
  server-rendered head, which prerendering keeps. An item cannot edit an app's
  app.html; this is the same route mode-watcher takes. The string is a
  constant, not input.
-->
<svelte:head>
  {@html tag}
</svelte:head>
