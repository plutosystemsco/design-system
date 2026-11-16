<script lang="ts">
  import { onMount } from "svelte";
  import { CodeEditor, pythonSetup } from "#lib/components/ui/code-editor";

  const python = pythonSetup();
  let value = $state("x = 1");

  // 025 decision 5: work begun at mount; the mark says when it is done.
  onMount(() => {
    const check = () => {
      if (
        document.querySelector(
          ".cm-content .tok-variableName, .cm-content span[class]",
        )
      )
        performance.mark("cost:settled");
      else requestAnimationFrame(check);
    };
    check();
  });
</script>

<CodeEditor bind:value label="Code" extensions={python} />
