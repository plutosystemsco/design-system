<script lang="ts" module>
  export const meta = {
    title: "A disabled item",
    intro: "A disabled section cannot be opened, and its trigger is skipped.",
  };
</script>

<script lang="ts">
  import * as Accordion from "#lib/registry/ui/accordion";
</script>

<Accordion.Root type="single" class="max-w-md">
  <Accordion.Item value="open">
    <Accordion.Trigger>Open to everyone</Accordion.Trigger>
    <Accordion.Content>This section can be opened.</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="closed" disabled>
    <Accordion.Trigger>Not available yet</Accordion.Trigger>
    <Accordion.Content>This section is disabled.</Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
