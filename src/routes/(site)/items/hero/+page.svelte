<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="hero" files={data.files}>
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
      No landmark of its own: the app's layout gives the <code>main</code>.
    </li>
    <li>
      The feature grid is a list with <code>role="list"</code>, kept by every
      browser though it shows no bullets.
    </li>
    <li>Both calls to action are 48 px tall. Nothing animates.</li>
  {/snippet}
</BlockPage>
