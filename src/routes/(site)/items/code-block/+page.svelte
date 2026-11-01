<script lang="ts">
  import FileCode from "phosphor-svelte/lib/FileCode";
  import Terminal from "phosphor-svelte/lib/Terminal";
  import * as CodeBlock from "#lib/registry/ui/code-block";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const traceback = `Traceback (most recent call last):
  File "<stdin>", line 3, in <module>
ZeroDivisionError: division by zero`;

  const output = `5 3 4 6 7 8 9 1 2
6 7 2 1 9 5 3 4 8
1 9 8 3 4 2 5 6 7`;
</script>

<ItemHeader name="code-block" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Code on the muted inset, with no border. The header is divided from the code by the groove. Every colour is a code token, rendered as a class: the install snippet below was highlighted when this page was built, and shipped no highlighter."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="default · prerendered with highlightCode" class="w-full">
      <CodeBlock.Root data-testid="install-snippet">
        <CodeBlock.Header>
          <CodeBlock.Title
            ><Terminal aria-hidden="true" />Terminal</CodeBlock.Title
          >
          <CodeBlock.Actions>
            <CodeBlock.CopyButton code={data.code.install} />
          </CodeBlock.Actions>
        </CodeBlock.Header>
        <CodeBlock.Content lines={data.install ?? undefined} />
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="a diff · added and removed lines" class="w-full">
      <CodeBlock.Root data-testid="diff-block">
        <CodeBlock.Header>
          <CodeBlock.Title>sudoku.py · 2 changes</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content lineNumbers>
          {#each data.diff ?? [] as line, index (index)}
            <CodeBlock.Line
              code={line}
              variant={index === 2
                ? "removed"
                : index === 3
                  ? "added"
                  : "default"}
            />
          {/each}
        </CodeBlock.Content>
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="destructive · labelled “Error output”" class="w-full">
      <CodeBlock.Root variant="destructive">
        <CodeBlock.Header>
          <CodeBlock.Title>Error output</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content code={traceback} />
      </CodeBlock.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Plain code with no language renders as one text node, which streams cheaply. The small size is for a chat message. A wrapped block breaks its long lines instead of scrolling."
>
  <div class="grid max-w-2xl gap-8">
    <Specimen caption="plain · no language, no highlighter" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content code={output} />
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="sm" class="w-full">
      <CodeBlock.Root size="sm">
        <CodeBlock.Header>
          <CodeBlock.Title>Terminal</CodeBlock.Title>
          <CodeBlock.Actions>
            <CodeBlock.CopyButton code={data.code.install} />
          </CodeBlock.Actions>
        </CodeBlock.Header>
        <CodeBlock.Content lines={data.install ?? undefined} />
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="wrap" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content lines={data.long ?? undefined} wrap />
      </CodeBlock.Root>
    </Specimen>
    <Specimen caption="with a footer" class="w-full">
      <CodeBlock.Root>
        <CodeBlock.Content lines={data.install ?? undefined} />
        <CodeBlock.Footer>2 lines · bash</CodeBlock.Footer>
      </CodeBlock.Root>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The <code>pre</code> is the one scroll container and a keyboard stop (<code
        >tabindex="0"</code
      >), so long lines scroll by keyboard. Pass
      <code>tabindex={-1}</code> to remove the stop. Its focus ring is drawn by the
      block's root, so the ring is never clipped.
    </li>
    <li>
      Line numbers are a CSS counter printed with an empty alternative text:
      they are neither copied nor read aloud. The <code>+</code> and
      <code>−</code> markers are the same.
    </li>
    <li>
      An emphasised line is the opaque card step with a 2 px marker on its left
      in the state colour: shape and position, not a tint, which the muted
      ground would swallow.
    </li>
    <li>
      The <code>destructive</code> variant is state told by colour, so give it a visible
      label in the header or beside it, such as “Error output”.
    </li>
    <li>
      The copy button is 32 px, named “Copy code”, then “Copied” for two
      seconds, which a status region beside it announces. When the browser
      refuses the write, the region says “Could not copy” and the name stays
      “Copy code”, so the button can be tried again. An icon passed to the title
      is decoration: give it <code>aria-hidden="true"</code>.
    </li>
    <li>
      Highlight colours are the twelve <code>--code-*</code> tokens, each a
      semantic colour that passes 4.5:1 on the muted ground in both themes. A
      highlighted token is a class, <code>text-code-keyword</code>, never a
      <code>style</code>; a token in the body's colour carries no class.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: the copy button in the header, then the code, whose ring the block draws around itself. Enter on the copy button copies the example and sets the status to “Copied”."
>
  <div data-testid="keyboard-fixture" class="max-w-2xl">
    <CodeBlock.Root>
      <CodeBlock.Header>
        <CodeBlock.Title
          ><FileCode aria-hidden="true" />sudoku.py</CodeBlock.Title
        >
        <CodeBlock.Actions>
          <CodeBlock.CopyButton code={data.code.python} />
        </CodeBlock.Actions>
      </CodeBlock.Header>
      <CodeBlock.Content lineNumbers>
        {#each data.python ?? [] as line, index (index)}
          <CodeBlock.Line
            code={line}
            variant={index === 22 ? "highlighted" : "default"}
          />
        {/each}
      </CodeBlock.Content>
      <CodeBlock.Footer
        >25 lines · Python · line 23 highlighted</CodeBlock.Footer
      >
    </CodeBlock.Root>
  </div>
</PreviewSection>
