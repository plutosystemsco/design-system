<script lang="ts" module>
  export const meta = {
    title: "With the input that adds them",
    intro:
      "Labels added by the input above them. When the last label goes, focus returns to the input, through the group's fallback.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import { Tag, TagGroup } from "#lib/registry/ui/tag";

  let labels = $state(["Bug", "Docs"]);
  let draft = $state("");
  let input: HTMLInputElement | null = $state(null);

  function add(event: SubmitEvent) {
    event.preventDefault();
    const label = draft.trim();
    if (label && !labels.includes(label)) labels = [...labels, label];
    draft = "";
  }
</script>

<div class="grid max-w-md gap-4">
  <form class="grid gap-2" onsubmit={add}>
    <Label for="add-label">Add a label</Label>
    <div class="flex gap-2">
      <Input
        id="add-label"
        bind:ref={input}
        bind:value={draft}
        autocomplete="off"
      />
      <Button type="submit" variant="secondary">Add</Button>
    </div>
  </form>
  <TagGroup aria-label="Labels" fallback={() => input}>
    {#each labels as label (label)}
      <Tag
        {label}
        onremove={() => (labels = labels.filter((l) => l !== label))}
      />
    {/each}
  </TagGroup>
</div>
