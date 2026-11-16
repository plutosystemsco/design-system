<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "role",
    title: "Don't: a tag that goes somewhere",
    caption: "A tag that is a link to another page.",
    breaks: "It looks like a filter and goes somewhere. Use a link.",
  };
</script>

<script lang="ts">
  import { Tag } from "#lib/registry/ui/tag";
</script>

<p class="text-sm">
  Filed under
  <a href="/components/link/" class="no-underline"><Tag label="Guides" /></a>
</p>
