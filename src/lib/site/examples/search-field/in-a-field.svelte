<script lang="ts" module>
  export const meta = {
    title: "In a field",
    intro:
      "Inside a Field, the label names the input and the description describes it, as for any control the field holds.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import { SearchField } from "#lib/registry/ui/search-field";
  // site:hide
  // 027b tests 26 and 27a: an app's own handlers, beside the field's.
  let hookValue = $state("");
  let hookLog = $state<string[]>([]);
  // site:show
</script>

<div class="max-w-md">
  <Field.Field description="Searches page titles and their first paragraph.">
    <Field.Label>Search the docs</Field.Label>
    <SearchField autocomplete="off" />
  </Field.Field>
</div>
<!-- site:hide -->
<div hidden data-testid="search-hooks">
  <SearchField
    aria-label="Hooks"
    bind:value={hookValue}
    oninput={(e) => hookLog.push(`input ${e.currentTarget.value}|${hookValue}`)}
    onkeydown={() => hookLog.push("keydown")}
    onclear={() => hookLog.push("clear")}
  />
  <SearchField
    aria-label="Prevented"
    value="design"
    onkeydown={(e) => {
      if (e.key === "Escape") e.preventDefault();
    }}
  />
  <output data-testid="search-hooks-log">{hookLog.join(";")}</output>
</div>
<!-- site:show -->
