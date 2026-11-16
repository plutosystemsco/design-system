<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "name",
    title: "Don't: a badge with a bare ×",
    caption: "A badge with an unnamed × button beside it.",
    breaks: "A button with no name: a screen reader says only “button”.",
    axe: "button-name",
  };
</script>

<script lang="ts">
  import X from "phosphor-svelte/lib/X";
  import { Badge } from "#lib/registry/ui/badge";
  import { Button } from "#lib/registry/ui/button";
</script>

<span class="inline-flex items-center gap-1">
  <Badge>Design</Badge>
  <Button variant="ghost" size="icon-sm"><X aria-hidden="true" /></Button>
</span>
