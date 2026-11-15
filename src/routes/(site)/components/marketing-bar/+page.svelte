<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="marketing-bar">
  {#snippet when()}
    <p>
      Use the marketing bar at the top of an expressive page. It holds the logo,
      a few links and up to two actions, on glass, and stays stuck for the whole
      page.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Put it at the page's top level, outside every stage, a full-bleed
        section of the page. Pass the <code>logo</code> snippet, which renders
        for <code>"header"</code>; <code>homeLabel</code>; <code>links</code>;
        and a <code>secondary</code> and a <code>primary</code> action.
      </li>
      <li>
        With <code>overlay</code> it floats over the stage below it, whose hero
        sets <code>underBar</code>.
      </li>
      <li>
        It is a glass panel floating inside the wide column. It follows the
        page's theme and never carries <code>.dark</code>.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>
      Name the home link with <code>homeLabel</code>. Include any words the logo
      shows.
    </li>
    <li>
      Pass <code>overlay</code> when a hero that sets <code>underBar</code> sits below
      it.
    </li>
    <li>
      Give the page a <code>{'<main id="main" tabindex="-1">'}</code>, so the
      skip link has somewhere to go.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Put it inside a stage. It would stop sticking at the stage's end.</li>
    <li>Give it <code>.dark</code>. It follows the page's theme.</li>
    <li>
      Float its dark glass over a light image of your own without measuring the
      text.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      It is the page's <code>banner</code> landmark. Its first child is the skip
      link "Skip to content", shown when focused. The home link is named by
      <code>homeLabel</code>; the links sit in a navigation landmark named
      "Main".
    </li>
    <li>
      It marks itself <code>data-sticky-bar</code>, which sets the page's
      <code>scroll-padding-top</code> to the bar's height, so a focused element is
      never hidden under it.
    </li>
    <li>
      Its text is the foreground and the primary only, since the bar floats over
      the whole page. On its glass over another glass over any field they
      measure at least 15.40:1 and 5.98:1. Dark glass over a light image of your
      own is yours to measure.
    </li>
    <li>
      Below md the links and the secondary action move into a sheet opened by a
      32 px button named "Menu"; Escape returns focus to it.
    </li>
  {/snippet}
</CompositionPage>
