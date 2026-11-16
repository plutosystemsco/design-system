<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "weight",
    title: "Don't: two primaries, attached",
    caption: "Two primaries, joined.",
    breaks: "Two equal next steps, joined: no divider, and no clear choice.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
</script>

<ButtonGroup aria-label="Publish">
  <Button size="sm">Publish</Button>
  <Button size="sm">Schedule</Button>
</ButtonGroup>
