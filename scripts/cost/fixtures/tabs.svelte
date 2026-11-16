<script lang="ts">
  import * as Tabs from "#lib/components/ui/tabs";
</script>

<Tabs.Root value="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="logs" data-cost="target">Logs</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">All tests passed.</Tabs.Content>
  <Tabs.Content value="logs">No warnings.</Tabs.Content>
</Tabs.Root>
