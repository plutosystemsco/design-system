<script lang="ts">
  import * as Tooltip from "#lib/components/ui/tooltip";
</script>

<!-- The provider's open delay is 0, its default. -->
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger data-cost="target">Copy</Tooltip.Trigger>
    <Tooltip.Content>Copy the code</Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
