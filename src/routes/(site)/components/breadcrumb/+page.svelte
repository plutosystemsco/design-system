<script lang="ts">
  import * as keyboard from "#lib/site/examples/breadcrumb/keyboard.svelte";
  import * as variants from "#lib/site/examples/breadcrumb/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="breadcrumb" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use a breadcrumb to show where a page sits in a hierarchy, with a link to
      each level above it. Put it at the top of the page, above the title. A
      flat site with one level has no need of one.
    </p>
    <p>
      A link lifts to the foreground on hover. The current page is a span with
      <code>aria-current</code> and no role: never a disabled link.
    </p>
    <p>
      The ellipsis is decoration. When pages are left out of the path, wrap it
      in a <code>DropdownMenu.Trigger</code> named "Show hidden pages", 32 px, with
      a menu of those pages, as above.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>End with the current page, as text.</li>
    <li>Use the same names as the pages' titles.</li>
    <li>Pass <code>label</code> when a page holds two breadcrumbs.</li>
  {/snippet}
  {#snippet donts()}
    <li>Make the current page a link.</li>
    <li>Use a breadcrumb in place of the page's main navigation.</li>
    <li>Show the history of pages visited. Show the hierarchy.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>nav</code> landmark named "Breadcrumb" (pass <code>label</code>
      when a page has two) holding an ordered list.
    </li>
    <li>
      The current page carries <code>aria-current="page"</code>. It is not a
      link, so it is not a stop.
    </li>
    <li>
      Separators are <code>aria-hidden</code> and out of the tree; a screen reader
      hears the links alone.
    </li>
    <li>
      <code>Breadcrumb.Link</code> takes a <code>child</code> snippet for a framework
      link.
    </li>
  {/snippet}
</Component>
