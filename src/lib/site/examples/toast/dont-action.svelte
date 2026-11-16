<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "action",
    caption: "Retry offered only in the toast.",
    breaks: "The only way to do it is behind F8. Offer it on the page too.",
  };
</script>

<script lang="ts">
  import { Toast } from "#lib/registry/ui/toast";
</script>

<div inert>
  <ol class="grid max-w-sm gap-2">
    <Toast
      kind="error"
      title="Couldn't sync"
      action={{ label: "Retry", onclick: () => {} }}
    />
  </ol>
</div>
