<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A key in the mono face on the muted inset, 20 px high, alone or in a group.",
  };
</script>

<script lang="ts">
  import * as Kbd from "#lib/registry/ui/kbd";
</script>

<div class="flex flex-wrap items-center gap-8">
  <Kbd.Root>Esc</Kbd.Root>
  <Kbd.Group><Kbd.Root>Ctrl</Kbd.Root><Kbd.Root>Enter</Kbd.Root></Kbd.Group>
</div>
