<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A raised surface with a hairline edge, at the default size and small. Its title is a real heading, h2 unless you pass another level.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
</script>

<div class="grid gap-8 md:grid-cols-2">
  <Card.Root class="w-full">
    <Card.Header>
      <Card.Title level={4}>Run 4127</Card.Title>
      <Card.Description>main, 2 minutes ago</Card.Description>
      <Card.Action>
        <Button variant="ghost" size="sm">Rerun</Button>
      </Card.Action>
    </Card.Header>
    <Card.Content>
      <p>All 212 tests passed in 48 seconds.</p>
    </Card.Content>
    <Card.Footer class="gap-3">
      <Button size="sm">Open logs</Button>
      <Button size="sm" variant="secondary">Share</Button>
    </Card.Footer>
  </Card.Root>
  <Card.Root size="sm" class="w-full">
    <Card.Header>
      <Card.Title level={4}>Storage</Card.Title>
      <Card.Description>3.2 of 10 GB used.</Card.Description>
    </Card.Header>
    <Card.Content>
      <p>Logs older than 30 days are removed each night.</p>
    </Card.Content>
  </Card.Root>
</div>
