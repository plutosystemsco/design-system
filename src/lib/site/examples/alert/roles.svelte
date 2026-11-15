<script lang="ts" module>
  export const meta = {
    title: "Roles",
    intro:
      "Inserted after the page loads, as an app inserts them: default takes no role, destructive alert, success and caution status, and role={null} none.",
  };
</script>

<script lang="ts">
  import * as Alert from "#lib/registry/ui/alert";
  import { Button } from "#lib/registry/ui/button";

  let inserted = $state(false);
</script>

<Button
  variant="secondary"
  size="sm"
  data-testid="insert-alerts"
  onclick={() => (inserted = true)}>Insert the alerts</Button
>
<div data-testid="inserted-alerts" class="mt-6 grid max-w-xl gap-4">
  {#if inserted}
    <Alert.Root><Alert.Title>Default: no role</Alert.Title></Alert.Root>
    <Alert.Root variant="destructive"
      ><Alert.Title>Error: role alert</Alert.Title></Alert.Root
    >
    <Alert.Root variant="success"
      ><Alert.Title>Saved: role status</Alert.Title></Alert.Root
    >
    <Alert.Root variant="caution"
      ><Alert.Title>Caution: role status</Alert.Title></Alert.Root
    >
    <Alert.Root variant="destructive" role={null}
      ><Alert.Title>Error, with role null: no role</Alert.Title></Alert.Root
    >
  {/if}
</div>
