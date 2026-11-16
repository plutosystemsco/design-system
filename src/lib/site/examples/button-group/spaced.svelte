<script lang="ts" module>
  export const meta = {
    title: "Spaced",
    intro:
      "A form's actions: the one primary first, then the rest, spaced in a row that wraps, and stacked full width below 640 px.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
</script>

<ButtonGroup aria-label="Form actions" variant="spaced">
  <Button>Save changes</Button>
  <Button variant="secondary">Cancel</Button>
</ButtonGroup>
