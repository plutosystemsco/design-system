<script lang="ts">
  import { Badge } from "#lib/registry/ui/badge";
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Table from "#lib/registry/ui/table";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";

  const runs = [
    {
      id: "4127",
      branch: "main",
      state: "Passed",
      variant: "success",
      time: "48 s",
    },
    {
      id: "4126",
      branch: "feat/otp",
      state: "Failed",
      variant: "destructive",
      time: "1 min 12 s",
    },
    {
      id: "4125",
      branch: "main",
      state: "Queued",
      variant: "default",
      time: "—",
    },
  ] as const;

  // The checkbox is the selection; the row's edge and inset follow it.
  // Every row's checkbox binds to a defined value: `bind:checked={undefined}`
  // is a Svelte error in development when the checkbox has a fallback.
  let selected = $state<Record<string, boolean>>(
    Object.fromEntries(runs.map((run) => [run.id, run.id === "4126"])),
  );
</script>

<ItemHeader name="table" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One table: a caption, a header, rows that hover and select on the accent inset, and a footer on the muted inset."
>
  <Table.Root>
    <Table.Caption>Recent runs of pluto-sandbox.</Table.Caption>
    <Table.Header>
      <Table.Row>
        <Table.Head><span class="sr-only">Select</span></Table.Head>
        <Table.Head>Run</Table.Head>
        <Table.Head>Branch</Table.Head>
        <Table.Head>State</Table.Head>
        <Table.Head class="text-right">Time</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each runs as run (run.id)}
        <Table.Row data-state={selected[run.id] ? "selected" : undefined}>
          <Table.Cell>
            <Checkbox
              aria-label="Select run {run.id}"
              bind:checked={selected[run.id]}
            />
          </Table.Cell>
          <Table.Cell class="font-mono">{run.id}</Table.Cell>
          <Table.Cell>{run.branch}</Table.Cell>
          <Table.Cell
            ><Badge variant={run.variant}>{run.state}</Badge></Table.Cell
          >
          <Table.Cell class="text-right">{run.time}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
    <Table.Footer>
      <Table.Row>
        <Table.Cell colspan={4}>3 runs</Table.Cell>
        <Table.Cell class="text-right">2 min</Table.Cell>
      </Table.Row>
    </Table.Footer>
  </Table.Root>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Run 4126 above is selected. Its checkbox tells assistive technology; the row adds a blue left edge to the accent inset, so selected differs from hovered by shape as well as colour."
>
  <p class="max-w-prose text-sm text-muted-foreground">
    Badges in rows carry no tint, so they read on the accent inset.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>Native table semantics, with a caption.</li>
    <li>
      A row that can be selected carries a checkbox cell, whose checked state is
      the selection; <code>aria-selected</code> on a plain table row is not announced.
      The selected row shows a blue left edge on the accent inset.
    </li>
    <li>
      The container scrolls sideways when the table is wider than its column.
      With <code>label</code>, it becomes a named <code>region</code> that keyboard
      users can focus and scroll; without one it adds no stop.
    </li>
  </ul>
</PreviewSection>
