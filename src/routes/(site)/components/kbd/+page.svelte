<script lang="ts">
  import * as states from "#lib/site/examples/kbd/states.svelte";
  import * as variants from "#lib/site/examples/kbd/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="kbd" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a key to name a key the reader presses: in help text, a tooltip or a
      menu item. Group keys pressed together.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Write each key in its own <code>Kbd</code>, inside a group.</li>
    <li>Name keys as the keyboard prints them: Ctrl, Enter, Esc.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a key as a button. It names a key; it does not press one.</li>
    <li>Use a key to show code or a value. Use <code>code</code>.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>A <code>&lt;kbd&gt;</code> element, read as its text.</li>
    <li>Not interactive: it names a key, it does not press one.</li>
  {/snippet}
</Component>
