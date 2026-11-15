<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A two-state button. Default is transparent until hovered; outline carries the input hairline. Pressed is inverted, the foreground as its ground, so the state reads at a glance.",
  };
</script>

<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import { Toggle } from "#lib/registry/ui/toggle";
</script>

<div class="flex flex-wrap items-center gap-4">
  <Toggle data-testid="height-toggle"><TextB aria-hidden="true" />Bold</Toggle>
  <Toggle variant="outline"><TextItalic aria-hidden="true" />Italic</Toggle>
  <Toggle size="sm" data-testid="height-toggle-sm"
    ><TextB aria-hidden="true" />Bold</Toggle
  >
  <Toggle size="sm" variant="outline"
    ><TextItalic aria-hidden="true" />Italic</Toggle
  >
  <!-- An icon-only toggle is named by its aria-label. -->
  <Toggle aria-label="Bold"><TextB aria-hidden="true" /></Toggle>
</div>
