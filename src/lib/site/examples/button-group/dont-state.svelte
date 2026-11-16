<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "state",
    title: "Don't: a button group for a state",
    caption: "Bold, italic and underline as plain buttons.",
    breaks: "It says nothing is pressed. Use a toggle group.",
  };
</script>

<script lang="ts">
  import TextB from "phosphor-svelte/lib/TextB";
  import TextItalic from "phosphor-svelte/lib/TextItalic";
  import TextUnderline from "phosphor-svelte/lib/TextUnderline";
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
</script>

<ButtonGroup aria-label="Text style">
  <Button variant="secondary" size="icon-sm" aria-label="Bold"
    ><TextB aria-hidden="true" /></Button
  >
  <Button variant="secondary" size="icon-sm" aria-label="Italic"
    ><TextItalic aria-hidden="true" /></Button
  >
  <Button variant="secondary" size="icon-sm" aria-label="Underline"
    ><TextUnderline aria-hidden="true" /></Button
  >
</ButtonGroup>
