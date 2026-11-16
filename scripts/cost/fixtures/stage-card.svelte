<script lang="ts">
  import { onMount } from "svelte";
  import { StageCard } from "#lib/components/ui/stage-card";

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

<StageCard title="hello.py" code={'print("hello")'} language="python" />
