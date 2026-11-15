<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="product-home" files={data.files}>
  {#snippet when()}
    <p>
      Use product home for a product's public home page. It puts the
      compositions together: a floating bar, a hero on a colour field, a proof
      band, a live console, a call to action and a footer. It is expressive, so
      it belongs on a home page or a launch, not in an app's screens.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Replace the copy, the links and the run functions with your own.</li>
    <li>Keep every claim true where it is shown.</li>
    <li>
      Give each colour field one moment, a single thing it shows, and keep its
      controls on a card or on glass.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Install it under a layout that adds its own banner, main or footer.</li>
    <li>Put a control straight on a colour field.</li>
    <li>Let the footer's lockup play an entrance as well as the header's.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The page renders its own landmarks: the bar is the <code>banner</code>,
      with the skip link "Skip to content" first; one
      <code>{'<main id="main" tabindex="-1">'}</code>; the footer is the
      <code>contentinfo</code>. Install it under a layout that adds none of
      these.
    </li>
    <li>
      One <code>h1</code>, the hero's; the proof band, the console and the call
      to action are <code>h2</code>, and so are the footer's group titles. The
      code cards' titles are not headings.
    </li>
    <li>
      The bar is a glass panel that sticks and floats over the first stage. It
      sets the page's <code>scroll-padding-top</code>, so a focused element is
      never hidden under it.
    </li>
    <li>
      Each run says its outcome in a polite status. The proof band's numbers
      count up once when they first come into view, and are read once, as their
      final values. Under reduced motion nothing counts or fills.
    </li>
    <li>
      The header's lockup plays the page's one entrance; the footer's does not.
    </li>
    <li>
      Three colour fields, one owned moment each: the hero's object on blue, the
      proof on yellow, the console on green. Every control sits on a card or on
      glass, never on a field. The glass is frosted, the same in every browser.
    </li>
  {/snippet}
  {#snippet setup()}
    <li>
      The run functions, <code>search</code> and <code>query</code>, are
      stand-ins for your server: they wait 900 ms and resolve to fixed lines.
      Replace them with calls to your own.
    </li>
    <li>
      Replace the copy and the links with your own. Every claim must be true
      where it is shown; this page's are true of the open platform it names. A
      link goes to <code>"/"</code> or to an id on the page.
    </li>
    <li>
      The footer's commit and date come from your <code>vite.config.ts</code>,
      as the app shell's do.
    </li>
  {/snippet}
</BlockPage>
