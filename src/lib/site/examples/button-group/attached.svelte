<script lang="ts" module>
  export const meta = {
    title: "Attached",
    intro:
      "Three secondary buttons joined edge to edge, named by the group. Each is its own Tab stop, and its focus ring is never covered.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";

  const sides = [
    ["Left", "text-start"],
    ["Center", "text-center"],
    ["Right", "text-end"],
  ] as const;
  let align: string = $state("text-start");
</script>

<div class="grid max-w-md gap-4">
  <ButtonGroup aria-label="Text alignment">
    {#each sides as [label, cls] (label)}
      <Button variant="secondary" size="sm" onclick={() => (align = cls)}
        >{label}</Button
      >
    {/each}
  </ButtonGroup>
  <p class="text-sm text-muted-foreground {align}">
    Each button aligns this paragraph once. None stays pressed.
  </p>
</div>
