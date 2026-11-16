<script lang="ts">
  import { onMount } from "svelte";
  import * as CodeBlock from "#lib/components/ui/code-block";

  const code = 'print("hello")';

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

<CodeBlock.Root>
  <CodeBlock.Header>
    <CodeBlock.Title>hello.py</CodeBlock.Title>
    <CodeBlock.Actions>
      <CodeBlock.CopyButton {code} />
    </CodeBlock.Actions>
  </CodeBlock.Header>
  <CodeBlock.Content {code} language="python" aria-label="hello.py" />
</CodeBlock.Root>
