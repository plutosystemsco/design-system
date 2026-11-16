<script lang="ts" module>
  export const meta = {
    title: "New tab",
    intro:
      "Rarely, a link opens a new tab. It shows an icon, says so to a screen reader, and merges noopener and noreferrer into your own rel.",
  };
</script>

<script lang="ts">
  import { Link } from "#lib/registry/ui/link";
</script>

<div class="grid max-w-prose gap-3 text-base">
  <p>
    Every pair of colours meets the contrast of
    <Link href="https://www.w3.org/TR/WCAG22/" newTab>WCAG 2.2</Link>, in both
    themes.
  </p>
  <p>
    Read the code behind every part in
    <Link
      href="https://github.com/plutosystemsco/design-system"
      newTab
      rel="external">the repository</Link
    >.
  </p>
</div>
