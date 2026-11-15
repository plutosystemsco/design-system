<script lang="ts">
  import * as keyboard from "#lib/site/examples/tooltip/keyboard.svelte";
  import * as states from "#lib/site/examples/tooltip/states.svelte";
  import * as variants from "#lib/site/examples/tooltip/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="tooltip" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use a tooltip to repeat an icon button's name, or to show its shortcut. It
      is a short hint on hover and focus. Anything a reader must see goes on the
      page.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Keep it to a few words: the action's name, or its keys.</li>
    <li>Wrap the app, or the area, in one <code>Tooltip.Provider</code>.</li>
  {/snippet}
  {#snippet donts()}
    <li>
      Make it an icon button's only name. Keep the <code>aria-label</code>.
    </li>
    <li>Put links, buttons or other controls inside it.</li>
    <li>Hide an error or a warning in it.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      It opens on hover and focus. While open, it describes its trigger through <code
        >aria-describedby</code
      >. Escape closes it, and it stays closed until focus leaves.
    </li>
    <li>
      Never an icon button's only name: the button keeps its
      <code>aria-label</code>, and the tooltip repeats it or adds a shortcut.
    </li>
  {/snippet}
</Component>
