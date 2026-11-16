<script lang="ts" module>
  export const meta = {
    title: "Kinds",
    intro:
      "Drawn, not raised: a specimen is never spoken, and cannot be pressed.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<!-- Specimens: inert, in a list, with no role and no timer. -->
<div inert class="w-full max-w-sm">
  <ol class="grid gap-2">
    <Toast kind="info" title="Invite sent" description="Ada gets an email." />
    <Toast kind="success" title="Project saved" />
    <Toast
      kind="caution"
      title="Storage almost full"
      description="You have used 90% of your space."
    />
    <Toast
      kind="error"
      title="Couldn't save"
      description="Check your connection."
    />
    <Toast kind="loading" title="Uploading 3 of 10" />
  </ol>
</div>
