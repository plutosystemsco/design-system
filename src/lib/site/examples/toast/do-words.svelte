<script lang="ts" module>
  export const meta = {
    kind: "do",
    pair: "words",
    title: "Do: a few words",
    caption:
      "A five-word title and one short sentence, read and heard in the time.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<div inert>
  <ol class="grid max-w-sm gap-2">
    <Toast
      kind="info"
      title="Your export is ready now"
      description="It is in Downloads."
    />
  </ol>
</div>
