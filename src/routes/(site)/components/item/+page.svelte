<script lang="ts">
  import * as keyboard from "#lib/site/examples/item/keyboard.svelte";
  import * as states from "#lib/site/examples/item/states.svelte";
  import * as variants from "#lib/site/examples/item/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="item" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use an item for one row in a list of things: a project, a run, a file. It
      lines up an icon, a title, a short description and actions. Make the whole
      row a link when the row goes somewhere.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Keep the title short, and put detail in the description.</li>
    <li>Put a list of items in a group, so it is announced as a list.</li>
    <li>Use the small size in dense lists.</li>
  {/snippet}
  {#snippet donts()}
    <li>Put buttons inside an item that is itself a link.</li>
    <li>Use items for data read across columns. Use a table.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A link item, made with the <code>child</code> snippet, is one stop with the
      focus ring; its hover is the accent inset.
    </li>
    <li>A state badge in an item names the state in words.</li>
    <li>
      <code>ItemGroup</code> is a <code>list</code>, and each item in it renders
      <code>role="listitem"</code> itself.
    </li>
  {/snippet}
</Component>
