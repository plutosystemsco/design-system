<script lang="ts" module>
  export const meta = {
    title: "The spring",
    intro:
      "The mark's dots dock on --ease-spring, overshooting slightly as they land; their opacity keeps the entrance curve. Only the dots spring. In the dark theme an expressive page shows the mark's four colours.",
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { FourDot } from "#lib/registry/ui/four-dot";

  // Bumped by the replay button: the keyed mark remounts and enters again.
  let replays = $state(0);
</script>

<div data-mode="expressive" class="flex flex-wrap items-center gap-6">
  {#key replays}
    <FourDot entrance data-testid="spring-mark" class="text-5xl" />
  {/key}
  <Button variant="secondary" size="sm" onclick={() => replays++}
    >Replay the entrance</Button
  >
</div>
