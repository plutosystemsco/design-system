<script lang="ts">
  import * as keyboard from "#lib/site/examples/code-block/keyboard.svelte";
  import * as states from "#lib/site/examples/code-block/states.svelte";
  import * as variants from "#lib/site/examples/code-block/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="code-block" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a code block to show code a reader reads or copies: a command, a file,
      a diff, a program's output. For code a reader edits, use the code editor.
      For a word of code inside a sentence, use inline code.
    </p>
    <p>
      Highlight static code in a <code>load</code> function with
      <code>highlightCode</code>, and pass the result as <code>lines</code>. The
      page then holds the tokens and fetches no highlighter.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Highlight static code when the page is built, and pass the lines.</li>
    <li>Give a block a title when it is one of several.</li>
    <li>Label a destructive block in its header, such as "Error output".</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a code block for code the reader should edit.</li>
    <li>Tell an error by colour alone.</li>
    <li>
      Highlight code in the browser when it could be highlighted at build.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The <code>pre</code> is the one scroll container and a keyboard stop (<code
        >tabindex="0"</code
      >), so long lines scroll by keyboard. Pass
      <code>tabindex={-1}</code> to remove the stop. Its focus ring is drawn by the
      block's root, so the ring is never clipped.
    </li>
    <li>
      Line numbers are a CSS counter printed with an empty alternative text, so
      they are neither copied nor read aloud. The <code>+</code> and
      <code>−</code> markers are not copied either.
    </li>
    <li>
      An emphasised line takes the active-line ground, one opaque step from the
      code ground, and a 2 px marker on its left in the state colour. Shape and
      position tell it, not a tint.
    </li>
    <li>
      The <code>destructive</code> variant tells its state by colour alone. Give it
      a visible label in the header or beside it, such as “Error output”.
    </li>
    <li>
      The copy button is 32 px and named “Copy code”. After a copy it shows a
      check for two seconds, and a status region beside it says “Copied”. The
      name stays “Copy code”, so “Copied” comes from the status alone. When the
      browser refuses the write, the region says “Could not copy”, and the
      button can be tried again. An icon passed to the title is decoration: give
      it <code>aria-hidden="true"</code>.
    </li>
    <li>
      Highlight colours are the fourteen text roles of <code>--code-*</code>.
      Each passes 4.5:1 on every code ground and the active line, in both
      themes. A highlighted token is a class,
      <code>text-code-keyword</code>, never a <code>style</code>; a body token
      carries no class and takes the block's <code>text-code-text</code>. The
      sudoku example shows numbers, functions such as <code>print</code> and
      <code>range</code>, the types
      <code>int</code> and <code>str</code>, constants and comments. No token is
      bold or italic. A live block marks <code>data-highlight="pending"</code>
      while a grammar loads and <code>"settled"</code> once nothing is loading.
    </li>
  {/snippet}
</Component>
