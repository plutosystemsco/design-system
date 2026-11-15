<script lang="ts">
  import * as keyboard from "#lib/site/examples/tabs/keyboard.svelte";
  import * as states from "#lib/site/examples/tabs/states.svelte";
  import * as variants from "#lib/site/examples/tabs/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="tabs" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use tabs to switch between views of one subject, in the same place: a
      run's overview, logs and settings. Only one panel shows at a time.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Name each tab in one or two words.</li>
    <li>Open on the tab most people need first.</li>
    <li>Use the line variant where a pill strip would be too heavy.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use tabs to step through a sequence. Use a form with steps.</li>
    <li>Use tabs to go to another page. Use links.</li>
    <li>Split content a reader must compare. Show it side by side.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      A <code>tablist</code> of <code>tab</code>s with
      <code>aria-selected</code>, and a <code>tabpanel</code> for each.
    </li>
    <li>
      The list is one tab stop. Left and Right move between tabs, or Up and Down
      when the tabs are vertical. Home and End jump to the first and last.
      Selection follows focus. The panel is the next stop.
    </li>
    <li>
      The active pill has an input border and darker text, so its state is not
      told by its fill alone. In the line variant, the active tab has a 2 px
      underline.
    </li>
  {/snippet}
</Component>
