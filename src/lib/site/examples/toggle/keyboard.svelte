<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "Two stops. Space flips the first's aria-pressed.",
  };
</script>

<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import { Toggle } from "#lib/registry/ui/toggle";
</script>

<div class="flex flex-wrap gap-3" data-testid="keyboard-fixture">
  <Toggle><TextB aria-hidden="true" />Bold</Toggle>
  <Toggle><TextItalic aria-hidden="true" />Italic</Toggle>
</div>
