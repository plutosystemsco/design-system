<script lang="ts">
  import * as languages from "#lib/site/examples/highlighter/languages.svelte";
  import * as states from "#lib/site/examples/highlighter/states.svelte";
  import * as variants from "#lib/site/examples/highlighter/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="highlighter" examples={{ variants, languages, states }}>
  {#snippet when()}
    <p>
      The highlighter colours code for the code block and the code editor. You
      rarely call it yourself. Call <code>highlightCode</code> in a
      <code>load</code>
      function for static code. A block given <code>code</code> and a
      <code>language</code> highlights in the browser on its own.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Highlight static code at build time, and pass the lines to the block.
    </li>
    <li>Name a language the highlighter lists, so its grammar is used.</li>
    <li>
      Allow <code>'wasm-unsafe-eval'</code> in the Content Security Policy of a page
      that highlights in the browser.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Style a token yourself. Its role's class colours it.</li>
    <li>Make a token bold or italic.</li>
    <li>Tell anything by colour alone.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Every text role reads 4.5:1 or more on every code ground and the active
      line, in both themes, comments included. The eight hues sit between 6.5:1
      and 9.5:1 on the dark code ground, and every role passes 4.5:1; off the
      ground the dark number reads higher, 10.41:1 on the active line and
      11.66:1 inside an ink surface.
    </li>
    <li>
      No token is bold or italic. Comments recede by colour alone, grey among
      eight hues. A link is underlined, the one style in the palette.
    </li>
    <li>
      For a reader with protanopia, light-mode numbers and constants are one
      colour. Numbers are digits and constants are words (<code>3</code>,
      <code>0x2A</code> against <code>True</code>, <code>None</code>), so their
      shape tells them apart.
    </li>
    <li>
      Colour is never the only sign in a diff. An added or removed line also
      carries its <code>+</code> or <code>−</code> marker and the active-line ground.
    </li>
    <li>
      Call <code>highlightCode</code> in a <code>load</code> function for static code.
      The page then holds the tokens and fetches no engine. A block highlighted in
      the browser fetches the tree-sitter runtime (about 115 kB gzipped) and each
      grammar it shows, once; an HTML block also loads JavaScript and CSS, a Svelte
      block TypeScript and CSS. Every client build carries all twenty grammar files
      and the runtime, about 23.5 MB raw (2.15 MB gzipped).
    </li>
    <li>
      A strict Content Security Policy needs <code>'wasm-unsafe-eval'</code>:
      the runtime compiles WebAssembly.
    </li>
  {/snippet}
</Component>
