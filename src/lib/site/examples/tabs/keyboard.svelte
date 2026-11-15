<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Four stops: the pill list's active tab, its panel, the line list's active tab, its panel.",
  };
</script>

<script lang="ts">
  import * as Tabs from "#lib/registry/ui/tabs";
</script>

{#snippet three(variant: "default" | "line")}
  <Tabs.Root value="overview" class="w-full max-w-md">
    <Tabs.List {variant}>
      <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
      <Tabs.Trigger value="logs">Logs</Tabs.Trigger>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="overview">All 212 tests passed.</Tabs.Content>
    <Tabs.Content value="logs">No warnings in this run.</Tabs.Content>
    <Tabs.Content value="settings">Runs on every push to main.</Tabs.Content>
  </Tabs.Root>
{/snippet}

<div data-testid="keyboard-fixture" class="grid gap-8">
  {@render three("default")}
  {@render three("line")}
</div>
