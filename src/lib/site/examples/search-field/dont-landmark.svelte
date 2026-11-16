<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "landmark",
    title: "Don't: a landmark per filter",
    caption: "Every filter box in a search landmark of its own.",
    breaks: "Three search landmarks: none says which one searches the site.",
  };
</script>

<script lang="ts">
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";
</script>

<div class="grid max-w-sm gap-4">
  {#each ["members", "projects", "files"] as what (what)}
    <search class="grid gap-2" aria-label="Filter {what}">
      <Label for="dont-landmark-{what}">Filter {what}</Label>
      <SearchField id="dont-landmark-{what}" autocomplete="off" />
    </search>
  {/each}
</div>
