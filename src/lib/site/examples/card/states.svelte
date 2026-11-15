<script lang="ts" module>
  export const meta = {
    title: "Title only",
    intro:
      "A card needs only its header and title; the other parts are optional.",
  };
</script>

<script lang="ts">
  import * as Card from "#lib/registry/ui/card";
</script>

<Card.Root class="w-full max-w-md">
  <Card.Header>
    <Card.Title level={4}>No runs yet</Card.Title>
  </Card.Header>
</Card.Root>
