<script lang="ts">
  import * as keyboard from "#lib/site/examples/theme/keyboard.svelte";
  import * as script from "#lib/site/examples/theme/script.svelte";
  import * as states from "#lib/site/examples/theme/states.svelte";
  import * as variants from "#lib/site/examples/theme/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="theme" examples={{ variants, states, script, keyboard }}>
  {#snippet when()}
    <p>
      Install the theme item once per app, so a visitor can choose light or dark
      and the choice holds on every page. Put the toggle in the app's header.
      Render <code>ThemeScript</code> once, in the root layout, so the first paint
      is already in the right theme.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Render <code>ThemeScript</code> once, in the root layout.</li>
    <li>Pass <code>nonce</code> when the app has a Content Security Policy.</li>
    <li>
      Offer light, dark and system in a menu when a visitor should be able to
      undo a choice.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Toggle the dark class yourself. Call <code>theme.set</code>, so the store
      and every toggle agree.
    </li>
    <li>Render the head script in a page as well as in the layout.</li>
    <li>
      Read <code>pluto-theme</code> from storage yourself. Read the store.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      One control, one state: a button named "Dark theme" with
      <code>aria-pressed</code>, pressed when dark is in force. Space and Enter
      flip it.
    </li>
    <li>
      Before hydration the button states no pressed value, since the server
      cannot know the theme the head script chose; it is set at mount, with
      <code>data-ready</code>.
    </li>
    <li>
      The icons are hidden from assistive technology; the name is the label.
    </li>
    <li>
      The class is set before first paint, so a page never flashes the wrong
      theme on load.
    </li>
  {/snippet}
</Component>
