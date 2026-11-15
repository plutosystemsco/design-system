<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Horizontal is the groove, a hairline; vertical is a plain hairline in the border colour.",
  };
</script>

<script lang="ts">
  import { Separator } from "#lib/registry/ui/separator";
</script>

<div class="grid gap-12">
  <div class="w-full max-w-md">
    <p class="text-sm">Account</p>
    <Separator class="my-4" />
    <p class="text-sm">Billing</p>
  </div>
  <div class="flex h-8 items-center gap-4 text-sm">
    <span>Runs</span>
    <Separator orientation="vertical" />
    <span>Logs</span>
    <Separator orientation="vertical" />
    <span>Settings</span>
  </div>
</div>
