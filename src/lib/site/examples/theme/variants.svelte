<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A pressed button named Dark theme, at 48 or 32 px, that chooses the opposite of what is in force. Every toggle on a page reads one store, so they agree; the toggle in the site's bar is this item.",
  };
</script>

<script lang="ts">
  import { ThemeToggle } from "#lib/registry/ui/theme";
</script>

<div class="flex flex-wrap items-start gap-8">
  <div class="flex flex-col items-start gap-2">
    <ThemeToggle data-testid="theme-toggle-icon" />
    <span class="text-xs text-muted-foreground">Icon, 48 px</span>
  </div>
  <div class="flex flex-col items-start gap-2">
    <ThemeToggle size="icon-sm" data-testid="theme-toggle-icon-sm" />
    <span class="text-xs text-muted-foreground">Small icon, 32 px</span>
  </div>
</div>
