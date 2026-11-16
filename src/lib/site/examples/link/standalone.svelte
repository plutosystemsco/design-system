<script lang="ts" module>
  export const meta = {
    title: "Standalone",
    intro:
      "A link alone on its line, as in a list, is a 24 px tall target. A link inside a sentence needs none.",
  };
</script>

<script lang="ts">
  import { Link } from "#lib/registry/ui/link";
</script>

<ul class="grid gap-1">
  <li><Link href="/start/install/" standalone>Install the registry</Link></li>
  <li><Link href="/start/theme/" standalone>Set up the theme</Link></li>
  <li>
    <Link href="/start/light-and-dark/" standalone>Serve light and dark</Link>
  </li>
</ul>
