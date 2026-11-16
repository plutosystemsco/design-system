<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "weight",
    title: "Do: one primary, spaced",
    caption: "One primary, first, spaced from the rest.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
</script>

<ButtonGroup aria-label="Publish" variant="spaced">
  <Button size="sm">Publish</Button>
  <Button variant="secondary" size="sm">Save a draft</Button>
</ButtonGroup>
