<script lang="ts" module>
  export const meta = {
    title: "Attached",
    intro:
      "Three related actions of equal weight, joined edge to edge and named by the group. Each is its own Tab stop, and its focus ring is never covered.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
</script>

<ButtonGroup aria-label="Clipboard">
  <Button variant="secondary" size="sm">Cut</Button>
  <Button variant="secondary" size="sm">Copy</Button>
  <Button variant="secondary" size="sm">Paste</Button>
</ButtonGroup>
