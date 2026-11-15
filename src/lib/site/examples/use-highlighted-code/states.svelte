<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "CodeBlock.Content calls the hook for you when it is given code and a language. Before the highlighter arrives, and for a language that is not listed, the lines are plain strings and nothing is loaded. With no language at all, the code is one text node.",
  };
</script>

<script lang="ts">
  import * as CodeBlock from "#lib/registry/ui/code-block";

  const result = `{
  "stdout": "5 3 4 6 7 8 9 1 2\\n",
  "stderr": "",
  "fuel": 4810000000,
  "ok": true
}`;

  const unknown = `== A language the highlighter does not list renders plain ==
nothing is loaded, and nothing is coloured`;
</script>

<div class="grid max-w-2xl gap-8">
  <p class="text-sm text-muted-foreground">A language that is not listed.</p>
  <CodeBlock.Root>
    <CodeBlock.Content
      code={unknown}
      language="cobol"
      lineNumbers
      role="region"
      aria-label="An unlisted language"
    />
  </CodeBlock.Root>
  <p class="text-sm text-muted-foreground">No language.</p>
  <CodeBlock.Root>
    <CodeBlock.Content code={result} role="region" aria-label="Plain code" />
  </CodeBlock.Root>
</div>
