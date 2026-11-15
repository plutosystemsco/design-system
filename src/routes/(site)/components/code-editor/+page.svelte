<script lang="ts">
  import * as keyboard from "#lib/site/examples/code-editor/keyboard.svelte";
  import * as states from "#lib/site/examples/code-editor/states.svelte";
  import * as variants from "#lib/site/examples/code-editor/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="code-editor" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use the code editor where a reader writes or changes code, such as a cell
      they run. To show code that is only read or copied, use a code block. It
      ships a Python setup, <code>pythonSetup()</code>. The code languages item
      adds the other languages.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Name every editor with <code>label</code>.</li>
    <li>
      Say the keys in visible text, and point <code>describedby</code> at it.
    </li>
    <li>Create the extensions once. To reconfigure, pass a new value.</li>
    <li>
      Load a new file with <code>reset()</code>, so its history starts clear.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Bind Tab without telling the reader how to leave.</li>
    <li>
      Disable the editor while a run is in flight. Make it read-only, so it
      keeps its tab stop.
    </li>
    <li>Use the editor to show code no one edits.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The content is a <code>textbox</code> with <code>aria-multiline</code>,
      named by the required <code>label</code> prop and described by the visible
      text <code>describedby</code> names. Say the keys there, as this page does.
    </li>
    <li>
      <strong>Tab leaves the editor.</strong> Nothing binds Tab, so there is no
      keyboard trap. <code>Mod-]</code> and <code>Mod-[</code> indent, where Mod
      is Ctrl, or Cmd on a Mac. An app that binds Tab owes its users the words
      "press Escape, then Tab, to leave" beside the editor and in
      <code>aria-describedby</code>.
    </li>
    <li>
      One focus ring, around the whole editor including the gutter, drawn by
      <code>.cm-editor</code> from the focus tokens. The root has no
      <code>overflow-hidden</code>, so the ring is never clipped.
    </li>
    <li>
      Selection and caret are the browser's own, so they stay readable by the
      platform's design. The editor itself runs no animation.
    </li>
    <li>
      Before the script runs, the prerendered <code>pre</code> is a
      <code>group</code>
      named by the same <code>label</code>. A bare <code>pre</code> may not carry
      a name, so the group role lets the name be exposed.
    </li>
    <li>
      <code>Ctrl Enter</code> and <code>Cmd Enter</code> both call
      <code>onrun</code>, in place of the default "insert blank line".
    </li>
    <li>
      The theme reads <code>:root</code> names wherever one exists, and four
      names that live only in <code>@theme inline</code>:
      <code>--spacing</code>, <code>--text-sm</code>,
      <code>--text-sm--line-height</code>
      and <code>--font-mono</code>. Tailwind emits them because the theme file
      is among its sources. An app that narrows <code>@source</code> must keep the
      editor's folder in it.
    </li>
    <li>
      No height is set: the editor grows with its document. For an inner scroll,
      cap it with a class such as <code>max-h-96</code>.
    </li>
  {/snippet}
</Component>
