<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "One stop: the toggle. Space flips aria-pressed and the dark class; Space again restores both.",
  };
</script>

<script lang="ts">
  import { ThemeToggle } from "#lib/registry/ui/theme";
</script>

<div data-testid="keyboard-fixture"><ThemeToggle size="icon-sm" /></div>
