<script lang="ts">
  import * as DropdownMenu from "#lib/components/ui/dropdown-menu";
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger data-cost="target">Menu</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item>Rename</DropdownMenu.Item>
    <DropdownMenu.Item>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
