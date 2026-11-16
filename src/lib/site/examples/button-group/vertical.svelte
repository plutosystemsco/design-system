<script lang="ts" module>
  export const meta = {
    title: "Vertical",
    intro:
      "The same group running down: each button after the first drops its top border, and the group is as wide as its widest button.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
</script>

<ButtonGroup aria-label="Zoom" orientation="vertical">
  <Button variant="secondary" size="sm">Zoom in</Button>
  <Button variant="secondary" size="sm">Zoom out</Button>
  <Button variant="secondary" size="sm">Fit to screen</Button>
</ButtonGroup>
