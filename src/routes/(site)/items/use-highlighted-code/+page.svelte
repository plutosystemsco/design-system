<script lang="ts">
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import GrowingCode from "#lib/preview/growing-code.svelte";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const result = `{
  "stdout": "5 3 4 6 7 8 9 1 2\\n",
  "stderr": "",
  "fuel": 4810000000,
  "ok": true
}`;

  const unknown = `== A language the highlighter does not list renders plain ==
nothing is loaded, and nothing is coloured`;
</script>

<ItemHeader name="use-highlighted-code" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="useHighlightedCode(() => code, () => language) returns lines: a plain string per line until the highlighter loads, then the line's tokens, each with its content and its class. Only the lines after the last complete newline are tokenised as the string grows, from the saved grammar state. Press Start to stream a run's result."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen
      caption="JSON, streamed three characters at a time"
      class="w-full"
    >
      <GrowingCode code={result} language="json" />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="CodeBlock.Content calls the hook for you when it is given code and a language. Before the highlighter arrives, and for a language that is not listed, the lines are plain strings and nothing is loaded."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="a language that is not listed · plain" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content code={unknown} language="brainfuck" lineNumbers />
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="no language · one text node" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content code={result} />
      </CodeBlock.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The hook changes nothing a screen reader hears: tokens are
      <code>span</code>s with a class, and a line's text is the code. Line
      numbers, when shown, are a counter that is not read.
    </li>
    <li>
      Colour arrives after the first paint, so code is readable before the
      highlighter loads and if it never does. The highlight is never the only
      sign of anything.
    </li>
    <li>
      Streaming code should sit in a block whose height is capped by the app, so
      the page does not grow under the reader; a chat pane is the case this hook
      serves.
    </li>
  </ul>
</PreviewSection>
