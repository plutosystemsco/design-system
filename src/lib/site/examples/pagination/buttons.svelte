<script lang="ts" module>
  export const meta = {
    title: "Buttons",
    intro:
      "A list paged in place: page buttons under a table, the page bound. Focus stays on the page you press, and a hidden status says the new page.",
  };
</script>

<script lang="ts">
  import { Pagination } from "#lib/registry/ui/pagination";
  import * as Table from "#lib/registry/ui/table";

  const PER_PAGE = 5;
  const TOTAL = 60;
  let page = $state(5);
  const first = $derived((page - 1) * PER_PAGE + 1);
  const last = $derived(Math.min(page * PER_PAGE, TOTAL));
  const rows = $derived(
    Array.from({ length: last - first + 1 }, (_, i) => first + i),
  );
</script>

<div class="grid max-w-3xl gap-4">
  <Table.Root>
    <Table.Caption data-testid="pagination-shown"
      >Invoices {first} to {last} of {TOTAL}</Table.Caption
    >
    <Table.Header>
      <Table.Row>
        <Table.Head>Invoice</Table.Head>
        <Table.Head>Customer</Table.Head>
        <Table.Head class="text-end">Amount</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each rows as n (n)}
        <Table.Row>
          <Table.Cell class="font-mono tabular-nums">INV-{1000 + n}</Table.Cell>
          <Table.Cell>Customer {n}</Table.Cell>
          <Table.Cell class="text-end tabular-nums"
            >€{(n * 37) % 900}.00</Table.Cell
          >
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
  <Pagination
    bind:page
    pages={TOTAL / PER_PAGE}
    strings={{ label: "Invoice pages" }}
  />
</div>
