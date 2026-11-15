<script lang="ts">
  import * as cookie from "#lib/site/examples/sidebar/cookie.svelte";
  import * as keyboard from "#lib/site/examples/sidebar/keyboard.svelte";
  import * as states from "#lib/site/examples/sidebar/states.svelte";
  import * as variants from "#lib/site/examples/sidebar/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="sidebar" examples={{ variants, states, cookie, keyboard }}>
  {#snippet when()}
    <p>
      Use a sidebar for an app's main navigation, when there are more places
      than fit in a header. It stays beside the page on a wide screen and
      becomes a sheet on a phone. A site with a handful of pages needs only a
      header.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Mark the current row with <code>isActive</code>.</li>
    <li>Place the trigger before the sidebar, in the shell's header.</li>
    <li>
      Read the <code>sidebar_state</code> cookie in a server load and pass it as
      <code>open</code>, so the first paint is right.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Fix the sidebar to the viewport. It is a sticky column in the page's row.
    </li>
    <li>
      Rely on it on a phone with JavaScript off. It does not render there.
    </li>
    <li>Give two navs on one page the same label.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The sidebar is a <code>nav</code> landmark named "Main". Pass
      <code>label</code>
      when a shell has a second nav. The inset, the content beside the sidebar, is
      the page's <code>main</code>, with <code>id="main"</code> and
      <code>tabindex="-1"</code>
      for the skip link. On a page that already has a main, pass
      <code>element="div"</code>
      and a <code>label</code> to make it a named region.
    </li>
    <li>
      The trigger is a disclosure, a button that shows and hides: <code
        >aria-expanded</code
      >, and <code>aria-controls</code> naming the nav. On a phone it opens a
      dialog and says so with <code>aria-haspopup="dialog"</code>. Place it
      before the sidebar, in the shell's header.
    </li>
    <li>
      Collapsed off-canvas, the nav is <code>inert</code>. Its rows leave the
      tab order and the accessibility tree until it opens again.
    </li>
    <li>
      The current row carries <code>aria-current="page"</code> (set by
      <code>isActive</code>), the accent inset and a primary start edge, so it
      differs from a hovered row by shape.
    </li>
    <li>
      Ctrl B or Cmd B toggles it. The keys do nothing inside a text field, an
      editable region or the code editor, or when another handler has already
      taken them.
    </li>
    <li>
      Below 768 px the sidebar is a sheet named "Sidebar". Closing it returns
      focus to the trigger. The prerendered page holds the desktop sidebar,
      hidden below 768 px until the script swaps in the sheet. So with
      JavaScript off, a phone has no sidebar.
    </li>
  {/snippet}
</Component>
