<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="marketing-bar">
  {#snippet usage()}
    <li>
      Put it at the page's top level, outside every stage, so it stays stuck for
      the whole page. Pass the <code>logo</code> snippet (it renders for
      <code>"header"</code>), <code>homeLabel</code>, <code>links</code>, and a
      <code>secondary</code> and a <code>primary</code> action.
    </li>
    <li>
      With <code>overlay</code> it floats over the stage below it, whose hero
      sets <code>underBar</code>.
    </li>
    <li>
      It is a glass panel floating inside the wide column; it follows the page's
      theme and never carries <code>.dark</code>.
    </li>
    <li>
      Your page needs a <code>{'<main id="main" tabindex="-1">'}</code> for the skip
      link.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The banner. Its first child is the skip link "Skip to content", shown when
      focused. The home link is named by <code>homeLabel</code>; the links sit
      in a navigation landmark named "Main".
    </li>
    <li>
      It marks itself <code>data-sticky-bar</code>, which sets the page's
      <code>scroll-padding-top</code> to the bar's height, so a focused element is
      never hidden under it.
    </li>
    <li>
      Its text is the foreground and the primary only: the bar floats over the
      whole page. On its glass over another glass over any field they measure at
      least 15.53:1 and 5.98:1. Dark glass over a light image of your own is
      yours to measure.
    </li>
    <li>
      Below md the links and the secondary action move into a sheet opened by a
      32 px button named "Menu"; Escape returns focus to it.
    </li>
  {/snippet}
</CompositionPage>
