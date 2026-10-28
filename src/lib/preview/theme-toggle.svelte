<script lang="ts">
  import { onMount } from "svelte";

  const KEY = "pluto-preview-theme";
  let dark = $state(false);
  let ready = $state(false);

  // Until hydration the server markup cannot know the theme the head script
  // chose, so the button states no pressed value rather than a wrong one.
  onMount(() => {
    dark = document.documentElement.classList.contains("dark");
    ready = true;
  });

  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      // Storage may be unavailable; the class still flips.
    }
  }
</script>

<button
  type="button"
  aria-pressed={ready ? dark : undefined}
  data-ready={ready ? "" : undefined}
  onclick={toggle}
  class="rounded border border-input bg-card px-3 py-2 font-mono text-xs font-medium text-foreground transition hover:bg-accent"
>
  Dark theme
</button>
