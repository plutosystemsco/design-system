<script lang="ts" module>
  export const meta = {
    kind: "dont",
    pair: "action",
    title: "Don't: a link that acts",
    caption: "A link that deletes.",
    breaks: "It does something instead of going somewhere. Use a button.",
  };
</script>

<script lang="ts">
  import { Link } from "#lib/registry/ui/link";
</script>

<p class="text-sm">
  <Link href="/components/link/">Delete project</Link>
</p>
