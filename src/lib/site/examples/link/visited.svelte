<script lang="ts" module>
  export const meta = {
    title: "Visited",
    intro:
      "In a long list of documents a person works through, a visited link turns the text colour. It is opt-in, and still underlined.",
  };
</script>

<script lang="ts">
  import { Link } from "#lib/registry/ui/link";

  const pages = [
    ["/foundations/colour/", "Colour"],
    ["/foundations/type/", "Type"],
    ["/foundations/space-and-shape/", "Space and shape"],
    ["/foundations/motion/", "Motion"],
    ["/foundations/accessibility/", "Accessibility"],
  ] as const;
</script>

<ul class="grid gap-1">
  {#each pages as [href, title] (href)}
    <li><Link {href} standalone visited>{title}</Link></li>
  {/each}
</ul>
