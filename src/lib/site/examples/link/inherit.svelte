<script lang="ts" module>
  export const meta = {
    title: "In muted text and a footer",
    intro:
      "Inherit takes the surrounding text's colour, for a link in muted text or a footer. It keeps its underline, so it is still a link.",
  };
</script>

<script lang="ts">
  import { Link } from "#lib/registry/ui/link";
</script>

<div class="grid max-w-prose gap-6">
  <p class="text-sm text-muted-foreground">
    Last changed in 0.13.0. What changed is in the
    <Link href="/changelog/" variant="inherit">changelog</Link>.
  </p>
  <div
    class="flex flex-wrap gap-x-6 gap-y-2 rounded bg-muted px-4 py-3 text-sm text-muted-foreground"
  >
    <span>Kuiper Design System</span>
    <Link href="/brand/" variant="inherit">Brand</Link>
    <Link href="/start/" variant="inherit">Start</Link>
  </div>
</div>
