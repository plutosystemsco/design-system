<script lang="ts">
  import * as states from "#lib/site/examples/code-languages/states.svelte";
  import * as variants from "#lib/site/examples/code-languages/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="code-languages" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Install code languages when your editor edits more than Python. Pass
      <code>loadLanguage(id)</code> beside a base setup; each language loads the
      first time it is asked for. An app that edits Python alone does not
      install this item: <code>pythonSetup()</code> is enough.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Installing this item installs <code>@codemirror/language-data</code>,
        which depends on every <code>@codemirror/lang-*</code> package and the
        legacy modes: about two megabytes unpacked on disk. In the bundle each
        language is its own chunk, loaded the first time
        <code>loadLanguage</code> asks for it.
      </li>
      <li>
        Each keystroke runs two parsers: CodeMirror's grammar for structure and
        tree-sitter for colour. Only the visible lines are queried, so a long
        document stays quick to type in.
      </li>
      <li>
        Svelte comes from <code>@replit/codemirror-lang-svelte</code> 6.0.0,
        released in 2022, for its structure; its colour, runes included, is the
        highlighter's. Python is the grammar <code>pythonSetup()</code> uses, so the
        editor's Python is one language everywhere.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Write one base setup and add the loaded language to it.</li>
    <li>
      Bring a new file in with <code>reset()</code>, so its history is clear.
    </li>
    <li>
      Fall back to plain text when <code>loadLanguage</code> returns
      <code>null</code>.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Install this item for an editor that only edits Python.</li>
    <li>Guess a grammar from part of a name.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The editor is <code>code-editor</code>'s: one textbox named by
      <code>label</code>, one ring around the whole editor, Tab unbound. A
      language changes nothing a reader hears.
    </li>
    <li>
      The example has two stops: the select, then the editor. The arrow keys
      change the language in the select; Tab enters the editor and Tab leaves
      it.
    </li>
    <li>
      <code>loadLanguage</code> matches a name strictly, never by substring, and
      returns <code>null</code> for one the table does not hold, so an app falls back
      to plain text instead of a guessed grammar.
    </li>
  {/snippet}
</Component>
