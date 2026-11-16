<script lang="ts">
  import * as Accordion from "#lib/components/ui/accordion";
</script>

<Accordion.Root type="single">
  <Accordion.Item value="one">
    <Accordion.Trigger data-cost="target">Sandbox</Accordion.Trigger>
    <Accordion.Content>Runs in WebAssembly.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="two">
    <Accordion.Trigger>Fuel</Accordion.Trigger>
    <Accordion.Content>A budget stops runaway code.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
