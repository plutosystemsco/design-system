<script lang="ts" module>
  export const meta = {
    title: "States",
    intro: "Beside a disabled checkbox, the label dims with it.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import { Label } from "#lib/registry/ui/label";
</script>

<div class="flex items-center gap-3">
  <Checkbox id="label-disabled" disabled class="peer" />
  <Label for="label-disabled">Send weekly digest</Label>
</div>
