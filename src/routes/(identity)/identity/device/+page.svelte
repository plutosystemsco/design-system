<script lang="ts">
  import Board from "#lib/identity/board.svelte";
  import Option from "#lib/identity/option.svelte";
  import DeviceField from "#lib/identity/specimens/device-field.svelte";
  import DeviceOrbits from "#lib/identity/specimens/device-orbits.svelte";
  import DeviceQuadrants from "#lib/identity/specimens/device-quadrants.svelte";
  import DeviceStreams from "#lib/identity/specimens/device-streams.svelte";
  import DeviceColon from "#lib/identity/specimens/device-colon.svelte";
  import DeviceBlink from "#lib/identity/specimens/device-blink.svelte";
  import DeviceChord from "#lib/identity/specimens/device-chord.svelte";
  import DeviceBarycentre from "#lib/identity/specimens/device-barycentre.svelte";
  import DeviceFirstLight from "#lib/identity/specimens/device-first-light.svelte";
  import DeviceHaze from "#lib/identity/specimens/device-haze.svelte";
  import { ordered, question } from "#lib/identity/questions";

  // Question F: each device drawn live on the stage, moving where the idea
  // is motion. Every animation shows its end state under reduced motion.
  const q = question("device");
</script>

<Board question={q}>
  {#each ordered(q) as option (option.id)}
    <Option {option}>
      {#snippet specimen()}
        {#if option.id === "F1"}
          <DeviceField />
        {:else if option.id === "F2"}
          <DeviceOrbits />
        {:else if option.id === "F3"}
          <DeviceQuadrants />
        {:else if option.id === "F4"}
          <DeviceStreams />
        {:else if option.id === "F5"}
          <DeviceColon />
        {:else if option.id === "F6"}
          <DeviceBlink />
        {:else if option.id === "F7"}
          <DeviceChord />
        {:else if option.id === "F8"}
          <DeviceBarycentre />
        {:else if option.id === "F9"}
          <DeviceFirstLight />
        {:else if option.id === "F10"}
          <DeviceHaze />
        {/if}
      {/snippet}
    </Option>
  {/each}
</Board>
