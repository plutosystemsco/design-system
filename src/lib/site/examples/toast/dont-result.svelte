<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "result",
    title: "Don't: a form's error as a toast",
    caption: "A form's error as a toast, far from the field it belongs to.",
    breaks: "A form's error far from its field. Use an error summary.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<div inert>
  <ol class="grid max-w-sm gap-2">
    <Toast kind="error" title="Email address is invalid" />
  </ol>
</div>
