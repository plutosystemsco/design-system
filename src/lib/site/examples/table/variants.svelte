<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "One table: a caption, a header, rows that hover and select on the accent inset, and a footer on the muted inset. Run 4126 is selected.",
  };
</script>

<script lang="ts">
  import { Badge } from "#lib/registry/ui/badge";
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Table from "#lib/registry/ui/table";

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

<Table.Root label="Recent runs">
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
        <Table.Cell><Badge variant={run.variant}>{run.state}</Badge></Table.Cell
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
