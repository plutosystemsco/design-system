<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="card" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A raised surface with a hairline edge. Its title is a real heading, h2 unless you pass another level."
>
  <div class="grid gap-8 md:grid-cols-2">
    <Specimen
      caption="default · header, action, content, footer"
      class="w-full"
    >
      <Card.Root class="w-full">
        <Card.Header>
          <Card.Title>Run 4127</Card.Title>
          <Card.Description>main · 2 minutes ago</Card.Description>
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
    </Specimen>
    <Specimen caption="sm" class="w-full">
      <Card.Root size="sm" class="w-full">
        <Card.Header>
          <Card.Title level={3}>Storage</Card.Title>
          <Card.Description>3.2 of 10 GB used.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Logs older than 30 days are removed each night.</p>
        </Card.Content>
      </Card.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <Specimen caption="title only" class="w-full max-w-md">
    <Card.Root class="w-full">
      <Card.Header>
        <Card.Title level={3}>No runs yet</Card.Title>
      </Card.Header>
    </Card.Root>
  </Specimen>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>CardTitle</code> renders a heading, <code>h2</code> by default, with
      a <code>level</code> prop from 1 to 6.
    </li>
    <li>The card is a plain container; its actions are ordinary buttons.</li>
  </ul>
</PreviewSection>
