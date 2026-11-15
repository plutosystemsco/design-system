<script lang="ts" module>
  export const meta = {
    title: "Pressed and disabled",
    intro:
      "Pressed is inverted in both variants. Disabled keeps its pressed state and leaves the tab order.",
  };
</script>

<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import { Toggle } from "#lib/registry/ui/toggle";
</script>

<div class="flex flex-wrap items-center gap-4">
  <Toggle pressed data-testid="toggle-pressed"
    ><TextB aria-hidden="true" />Bold</Toggle
  >
  <Toggle data-testid="toggle-unpressed"
    ><TextB aria-hidden="true" />Bold</Toggle
  >
  <Toggle pressed variant="outline"
    ><TextItalic aria-hidden="true" />Italic</Toggle
  >
  <Toggle disabled><TextB aria-hidden="true" />Bold</Toggle>
  <Toggle disabled pressed><TextB aria-hidden="true" />Bold</Toggle>
</div>
