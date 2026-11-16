<script lang="ts" module>
  export const meta = {
    title: "Inline",
    intro:
      "A link inside a sentence: underlined in the primary colour, and thicker on hover. Its words say where it goes.",
  };
</script>

<script lang="ts">
  import { Link } from "#lib/registry/ui/link";
</script>

<p class="max-w-prose text-base">
  Every colour in an item comes from a token, in both themes. Before you add
  one, read <Link href="/foundations/colour/">how colour works</Link>, then
  check its contrast on the page and on a card.
</p>
