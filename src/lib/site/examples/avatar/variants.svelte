<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A person's image, or their initials on the muted inset, at the 8 px case radius, in three sizes. Only the mark and the radio are round.",
  };
</script>

<script lang="ts">
  import * as Avatar from "#lib/registry/ui/avatar";

  const sizes = ["sm", "default", "lg"] as const;
</script>

<div class="flex flex-wrap items-end gap-8">
  {#each sizes as size (size)}
    <Avatar.Root {size}>
      <Avatar.Fallback>AL</Avatar.Fallback>
    </Avatar.Root>
  {/each}
</div>
