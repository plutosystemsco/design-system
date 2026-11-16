<script lang="ts" module>
  export const meta = {
    title: "Small",
    intro:
      'size="sm" under a dense table: pages 32 px tall, still above the 24 px target, and the page list shows from a narrower width.',
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";
  import * as Table from "#lib/registry/ui/table";

  const BRANCHES = ["main", "feat/otp", "fix/scroll", "docs/tokens"];
  let page = $state(5);
  const rows = $derived(
    Array.from({ length: 4 }, (_, i) => {
      const n = (page - 1) * 4 + i + 1;
      return { id: 5000 - n, branch: BRANCHES[n % BRANCHES.length] };
    }),
  );
</script>

<div class="grid max-w-xl gap-2 text-sm">
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head>Run</Table.Head>
        <Table.Head>Branch</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each rows as row (row.id)}
        <Table.Row>
          <Table.Cell class="py-1 font-mono tabular-nums">{row.id}</Table.Cell>
          <Table.Cell class="py-1 font-mono">{row.branch}</Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
  <Pagination bind:page pages={12} size="sm" aria-label="Branch run pages" />
</div>
