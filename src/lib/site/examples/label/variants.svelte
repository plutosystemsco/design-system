<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One label, in sentence case: alone above an input, or beside a checkbox.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
</script>

<div class="flex flex-wrap items-start gap-12">
  <div class="grid w-64 gap-3">
    <Label for="label-email">Email address</Label>
    <Input id="label-email" type="email" placeholder="you@example.com" />
  </div>
  <div class="flex items-center gap-3">
    <Checkbox id="label-terms" />
    <Label for="label-terms">Accept the terms</Label>
  </div>
</div>
