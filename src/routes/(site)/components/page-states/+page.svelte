<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="page-states" files={data.files}>
  {#snippet when()}
    <p>
      Use page states when a page has no content to show: nothing made yet,
      still loading, or an error. The block ships an empty projects page, a
      loading wrapper and an error page. Each says what happened and what to do
      next, in one shape.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Give an empty state one action that makes the first item.</li>
    <li>Name what is loading in the label, such as "Loading projects".</li>
    <li>
      Pass a request id or build hash as <code>reference</code> on a server error,
      so a report can carry it.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Colour a state red, or apologise in its words.</li>
    <li>Show a stack trace or say whose fault it was.</li>
    <li>
      Mount the loading wrapper at the moment loading starts. Mount it first,
      then drive <code>loading</code>.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      One <code>h1</code> per page; the empty state in a tile is an
      <code>h2</code>. No colour carries the state: none is red.
    </li>
    <li>
      Only a 404 says "Page not found". Another status below 500 says the page
      cannot be shown and names the status in mono; 500 and above say the page
      did not load. No code, fault or apology in the words.
    </li>
    <li>
      Loading: <code>aria-busy</code> on the region, skeletons hidden and still,
      and a polite hidden status, "Loading projects". Its text arrives after
      mount, so
      <strong
        >mount the loading state before loading starts and drive <code
          >loading</code
        ></strong
      >; a region mounted and filled at once may be silent.
    </li>
    <li>
      A reference sits in a closed <code>details</code>; its summary is a
      keyboard stop 24 px tall. Never a stack trace.
    </li>
    <li>
      The error page moves no focus: on a full load the page reads from the top,
      and SvelteKit announces a client-side navigation's title. In an app it
      handles only errors thrown by <code>/page-states</code>; move it to
      <code>src/routes/+error.svelte</code> for every error.
    </li>
  {/snippet}
</BlockPage>
