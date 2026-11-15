<script lang="ts" module>
  export const meta = {
    title: "In a sentence",
    intro: "Keys sit inline in running text, as a help line writes them.",
  };
</script>

<script lang="ts">
  import * as Kbd from "#lib/registry/ui/kbd";
</script>

<p class="text-sm">
  Press <Kbd.Root>/</Kbd.Root> to search, or
  <Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>K</Kbd.Root></Kbd.Group> to open the
  command menu.
</p>
