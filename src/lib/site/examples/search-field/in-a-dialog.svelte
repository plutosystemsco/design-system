<script lang="ts" module>
  export const meta = {
    title: "In a dialog",
    intro:
      "Escape clears a filled field and stops there, so the dialog stays open. A second Escape, on the empty field, closes it.",
    frameMinHeight: 420,
  };
</script>

<script lang="ts">
  import { buttonVariants } from "#lib/registry/ui/button";
  import * as Dialog from "#lib/registry/ui/dialog";
  import { Label } from "#lib/registry/ui/label";
  import { SearchField } from "#lib/registry/ui/search-field";

  const MEMBERS = ["Ada Ortiz", "Desmond Lee", "Desta Haile", "Priya Rao"];
  let value = $state("");
  const shown = $derived(
    MEMBERS.filter((m) => m.toLowerCase().includes(value.trim().toLowerCase())),
  );
</script>

<Dialog.Root>
  <Dialog.Trigger class={buttonVariants({ variant: "secondary", size: "sm" })}
    >Add members</Dialog.Trigger
  >
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add members</Dialog.Title>
      <Dialog.Description>Find people by name.</Dialog.Description>
    </Dialog.Header>
    <div class="grid gap-2">
      <Label for="dialog-members">Search members</Label>
      <SearchField
        id="dialog-members"
        bind:value
        results={shown.length === 1 ? "1 result" : `${shown.length} results`}
        autocomplete="off"
      />
      <ul class="mt-2 grid gap-1 text-sm">
        {#each shown as member (member)}
          <li>{member}</li>
        {/each}
      </ul>
    </div>
  </Dialog.Content>
</Dialog.Root>
