<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "action",
    title: "Do: a button for an action",
    caption: "An action is a button: it does something where you are.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
</script>

<Button variant="destructive" size="sm">Delete project</Button>
