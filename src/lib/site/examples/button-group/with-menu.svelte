<script lang="ts" module>
  export const meta = {
    title: "With a menu",
    intro:
      "Two actions and a More menu, its trigger drawn as a secondary button and joined as the group's last.",
    frameMinHeight: 320,
  };
</script>

<script lang="ts">
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import { Button, buttonVariants } from "#lib/registry/ui/button";
  import { ButtonGroup } from "#lib/registry/ui/button-group";
  import * as DropdownMenu from "#lib/registry/ui/dropdown-menu";
</script>

<ButtonGroup aria-label="Project actions">
  <Button variant="secondary" size="sm">Edit</Button>
  <Button variant="secondary" size="sm">Duplicate</Button>
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class={buttonVariants({ variant: "secondary", size: "sm" })}
      >More<CaretDown aria-hidden="true" /></DropdownMenu.Trigger
    >
    <DropdownMenu.Content align="end">
      <DropdownMenu.Item>Rename</DropdownMenu.Item>
      <DropdownMenu.Item>Move to a folder</DropdownMenu.Item>
      <DropdownMenu.Separator />
      <DropdownMenu.Item variant="destructive">Delete</DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</ButtonGroup>
