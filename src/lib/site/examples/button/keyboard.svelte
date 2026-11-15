<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Seven stops: default, secondary, ghost, destructive, link, an icon button and a busy submit. The disabled button between them is skipped.",
  };
</script>

<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import { Button } from "#lib/registry/ui/button";

  let submits = $state(0);
  let busy = $state(true);
</script>

<form
  data-testid="keyboard-fixture"
  class="flex flex-wrap items-center gap-4"
  onsubmit={(event) => {
    event.preventDefault();
    submits += 1;
  }}
>
  <Button>Default</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button disabled>Disabled</Button>
  <Button variant="destructive">Delete</Button>
  <Button variant="link">Link</Button>
  <Button size="icon" variant="secondary" aria-label="Copy"
    ><Copy aria-hidden="true" /></Button
  >
  <Button type="submit" variant="secondary" {busy} data-testid="busy-button"
    >Signing in…</Button
  >
  <p class="text-sm text-muted-foreground">
    Submits: <output data-testid="submit-count">{submits}</output>
  </p>
</form>
<p class="mt-6 text-sm text-muted-foreground">
  The busy submit is secondary, so this surface spends one blue action, on
  Default. Outside the form:
  <Button
    variant="ghost"
    size="sm"
    data-testid="busy-toggle"
    onclick={() => (busy = !busy)}>{busy ? "Stop busy" : "Make busy"}</Button
  >
</p>
