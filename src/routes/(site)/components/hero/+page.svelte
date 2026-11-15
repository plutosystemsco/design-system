<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="hero" files={data.files}>
  {#snippet when()}
    <p>
      Use the hero to open a product's home page. It holds one heading, one
      sentence and one action, then a grid of short claims. Nothing moves and no
      colour field is used. For a launch page on colour fields and glass, use
      the stage hero instead.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Name the action by where it goes: "Read the docs", not "Learn more".
    </li>
    <li>
      Keep each feature to a title and one sentence your product can prove.
    </li>
    <li>
      Put real evidence, such as a code block, in <code>media</code> beside the words.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Add a second <code>h1</code>: the headline is the page's one.</li>
    <li>
      Turn the actions into buttons that run code. They go somewhere, so they
      stay links.
    </li>
    <li>Fill the grid with claims you cannot show to be true.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      One <code>h1</code>, the headline; the grid's <code>h2</code>, then an
      <code>h3</code> per feature, with no rank skipped.
    </li>
    <li>
      The call to action is a link, because it goes to another page, and its
      label names where it goes.
    </li>
    <li>
      No landmark of its own: the consuming app's layout gives the <code
        >main</code
      >.
    </li>
    <li>
      The feature grid is a list with <code>role="list"</code>, kept by every
      browser though it shows no bullets.
    </li>
    <li>Both calls to action are 48 px tall. Nothing animates.</li>
  {/snippet}
</BlockPage>
