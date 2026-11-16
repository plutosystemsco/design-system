<script lang="ts">
  import { onMount } from "svelte";
  import { ProofBand } from "#lib/components/ui/proof-band";

  // 025 decision 5: in view at hydration, the band settles at mount; the
  // mark is set a frame after it.
  onMount(() => {
    requestAnimationFrame(() => performance.mark("cost:settled"));
  });
</script>

<ProofBand
  label="Results"
  items={[
    { value: 212, label: "tests" },
    { value: 48, suffix: " s", label: "per run" },
  ]}
/>
