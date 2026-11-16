<script lang="ts" module>
  export const meta = {
    title: "Narrow",
    intro:
      "In a 320 px card the page list would not fit, so Page 5 of 12 stands between Previous and Next. At the last page, focus moves to Previous.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
  import { Pagination } from "#lib/registry/ui/pagination";

  let page = $state(5);
</script>

<Card.Root size="sm" class="w-full max-w-xs">
  <Card.Header>
    <Card.Title>Recent runs</Card.Title>
    <Card.Description
      >Runs {52 - page * 4} to {49 - page * 4}, newest first</Card.Description
    >
  </Card.Header>
  <Card.Content>
    <Pagination bind:page pages={12} strings={{ label: "Run pages" }} />
  </Card.Content>
</Card.Root>
