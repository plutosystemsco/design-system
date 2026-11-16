<script lang="ts">
  import { onMount } from "svelte";
  import { LiveConsole } from "#lib/components/ui/live-console";

  const examples = [
    { label: "One", command: 'print("cost one")' },
    { label: "Two", command: 'print("cost two")' },
  ];
  const run = async () => ({ meters: [], lines: ["ok"] });

  // 025 decision 5: work begun at mount; the mark says when it is done.
  onMount(() => {
    const check = () => {
      if (
        document.querySelector(
          "[data-slot=code-block-content][data-highlight=settled]",
        )
      )
        performance.mark("cost:settled");
      else requestAnimationFrame(check);
    };
    check();
  });
</script>

<LiveConsole title="Console" {examples} {run} language="python" />
