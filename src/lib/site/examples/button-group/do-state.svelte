<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "state",
    title: "Do: a toggle group for a state",
    caption: "A choice of state is a toggle group: it says what is pressed.",
  };
</script>

<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextUnderline from "phosphor-svelte/lib/TextUnderline";
  import * as ToggleGroup from "#lib/registry/ui/toggle-group";
</script>

<ToggleGroup.Root type="multiple" value={["bold"]} aria-label="Text style">
  <ToggleGroup.Item value="bold" aria-label="Bold"
    ><TextB aria-hidden="true" /></ToggleGroup.Item
  >
  <ToggleGroup.Item value="italic" aria-label="Italic"
    ><TextItalic aria-hidden="true" /></ToggleGroup.Item
  >
  <ToggleGroup.Item value="underline" aria-label="Underline"
    ><TextUnderline aria-hidden="true" /></ToggleGroup.Item
  >
</ToggleGroup.Root>
