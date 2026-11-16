<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "steps",
    title: "Don't: pagination for a form's steps",
    caption: "A three-step form whose steps are pages to jump between.",
    breaks: "A form's steps are not pages to jump between. Use Continue.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";

  let page = $state(1);
</script>

<div class="grid gap-3 text-sm">
  <p class="font-medium">Your details</p>
  <Pagination bind:page pages={3} aria-label="Form steps" />
</div>
