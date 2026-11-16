<!--
  025 decision 10: the large-data case. 1,000 rows of 5 columns, built
  deterministically before render. Hydration only.
-->
<script lang="ts">
  import * as Table from "#lib/components/ui/table";

  const rows = Array.from({ length: 1000 }, (_, i) => ({
    run: 10000 + i,
    branch: i % 3 === 0 ? "main" : `feature-${i % 17}`,
    tests: 200 + (i % 50),
    seconds: 30 + ((i * 7) % 90),
    passed: i % 11 !== 0,
  }));
</script>

<Table.Root>
  <Table.Header>
    <Table.Row>
      <Table.Head>Run</Table.Head>
      <Table.Head>Branch</Table.Head>
      <Table.Head>Tests</Table.Head>
      <Table.Head>Seconds</Table.Head>
      <Table.Head>Result</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each rows as row (row.run)}
      <Table.Row>
        <Table.Cell>{row.run}</Table.Cell>
        <Table.Cell>{row.branch}</Table.Cell>
        <Table.Cell>{row.tests}</Table.Cell>
        <Table.Cell>{row.seconds}</Table.Cell>
        <Table.Cell>{row.passed ? "Passed" : "Failed"}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
