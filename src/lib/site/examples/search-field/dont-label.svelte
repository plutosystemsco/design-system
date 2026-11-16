<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "label",
    title: "Don't: the placeholder alone",
    caption: "A placeholder for a name, gone as soon as typing starts.",
    breaks: "The placeholder is its only name, and it vanishes as you type.",
  };
</script>

<script lang="ts">
  import { SearchField } from "#lib/registry/ui/search-field";
</script>

<div class="max-w-sm">
  <SearchField placeholder="Search invoices" autocomplete="off" />
</div>
