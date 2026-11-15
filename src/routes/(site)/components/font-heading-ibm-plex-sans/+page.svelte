<script lang="ts">
  import * as specimen from "#lib/site/examples/font-heading-ibm-plex-sans/specimen.svelte";
  import Component from "#lib/site/page/component.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<Component name="font-heading-ibm-plex-sans" examples={{ specimen }}>
  {#snippet when()}
    <p>
      The heading face, and the wordmark. Every heading is set in IBM Plex Sans,
      bold.
    </p>
    <p>
      It sets <code>{data.variable}</code>, the family
      <code class="break-all">{data.family}</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Set headings with <code>font-heading</code>, bold.</li>
    <li>
      Use it at the heading sizes, <code>text-2xl</code> and
      <code>text-5xl</code>.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Set paragraphs in IBM Plex Sans. Body text takes Geist.</li>
    <li>
      Make a heading of text that only looks like one. Use a heading element.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The face is self-hosted through Fontsource, with
      <code>font-display: swap</code>: text shows in the fallback until the face
      loads.
    </li>
    <li>
      The family falls back to <code>system-ui</code>, then
      <code>sans-serif</code>, so headings read even if the face never loads.
    </li>
    <li>
      The face does not make a heading. A heading is an <code>h1</code> to
      <code>h6</code> element; the face only sets how it looks.
    </li>
  {/snippet}
</Component>
