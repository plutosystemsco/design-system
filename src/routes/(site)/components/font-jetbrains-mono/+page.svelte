<script lang="ts">
  import * as specimen from "#lib/site/examples/font-jetbrains-mono/specimen.svelte";
  import Component from "#lib/site/page/component.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<Component name="font-jetbrains-mono" examples={{ specimen }}>
  {#snippet when()}
    <p>The face for eyebrows, labels, code, paths and data.</p>
    <p>
      It sets <code>{data.variable}</code>, the family
      <code class="break-all">{data.family}</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Set code, paths and figures with <code>font-mono</code>.</li>
    <li>Add <code>tabular-nums</code> where numbers line up in a column.</li>
  {/snippet}
  {#snippet donts()}
    <li>Set paragraphs in JetBrains Mono. Body text takes Geist.</li>
    <li>Set headings in it. Headings take IBM Plex Sans.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The face is self-hosted through Fontsource, with
      <code>font-display: swap</code>: text shows in the fallback until the face
      loads.
    </li>
    <li>
      It sets <code>code</code>, <code>kbd</code>, <code>samp</code> and
      <code>pre</code> elements. The family falls back to
      <code>ui-monospace</code>, then <code>monospace</code>.
    </li>
    <li>A face carries no role or name; the text it sets is read as it is.</li>
  {/snippet}
</Component>
