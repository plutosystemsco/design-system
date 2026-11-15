<script lang="ts">
  import * as variants from "#lib/site/examples/is-mobile/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="is-mobile" examples={{ variants }}>
  {#snippet when()}
    <p>
      Use it only where the component tree must differ by width. The sidebar
      reads it to choose which tree exists: a sheet below 768 px, a sticky
      column above. CSS alone cannot turn a panel into a dialog.
    </p>
    <p>
      It is Svelte's <code>MediaQuery</code> on
      <code>max-width</code>, one pixel under the breakpoint, which is 768 by
      default.
    </p>
    <p>
      A page prerenders the desktop tree, hidden below 768 px by a class until
      hydration replaces it with the sheet, so nothing flashes. With JavaScript
      off a phone has no sidebar and no way to open one; a desktop has the
      sidebar, expanded, with its trigger dead.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Hide and show by a class where a class will do.</li>
    <li>Read <code>current</code> inside markup or a derived value.</li>
    <li>Render the desktop tree first, since the server value is false.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use it to change colours, spacing or type. Use a breakpoint class.</li>
    <li>Expect a phone to see the mobile tree before hydration.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      It decides behaviour, not appearance: hide and show by a class where a
      class will do, and reach for the store only where the component tree must
      differ.
    </li>
    <li>
      Its server value is <code>false</code>, so a prerendered page is the
      desktop page and a phone sees it only after hydration.
    </li>
  {/snippet}
</Component>
