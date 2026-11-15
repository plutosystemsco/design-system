<script lang="ts" module>
  export const meta = {
    title: "Disabled and vertical",
    intro:
      "A disabled tab cannot be chosen, and arrow keys skip it. Vertical tabs stack beside their panel.",
  };
</script>

<script lang="ts">
  import * as Tabs from "#lib/registry/ui/tabs";
</script>

<div class="grid gap-12">
  <Tabs.Root value="overview" class="w-full max-w-md">
    <Tabs.List>
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
      <Tabs.Trigger value="settings" disabled>Settings</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">All 212 tests passed.</Tabs.Content>
    <Tabs.Content value="logs">No warnings in this run.</Tabs.Content>
    <Tabs.Content value="settings">Runs on every push to main.</Tabs.Content>
  </Tabs.Root>
  <Tabs.Root value="general" orientation="vertical" class="w-full max-w-md">
    <Tabs.List>
      <Tabs.Trigger value="general">General</Tabs.Trigger>
      <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="general">Name, region and owner.</Tabs.Content>
    <Tabs.Content value="billing">Plan and invoices.</Tabs.Content>
  </Tabs.Root>
</div>
