<script lang="ts">
  import * as Table from "#lib/components/ui/table";

  const rows = Array.from({ length: 5 }, (_, i) => ({
    run: 4100 + i,
    branch: "main",
    tests: 200 + i,
  }));
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Run</Table.Head>
      <Table.Head>Branch</Table.Head>
      <Table.Head>Tests</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each rows as row (row.run)}
      <Table.Row>
        <Table.Cell>{row.run}</Table.Cell>
        <Table.Cell>{row.branch}</Table.Cell>
        <Table.Cell>{row.tests}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
