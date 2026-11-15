<script lang="ts">
  import * as specimen from "#lib/site/examples/font-geist/specimen.svelte";
  import Component from "#lib/site/page/component.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<Component name="font-geist" examples={{ specimen }}>
  {#snippet when()}
    <p>The body face. Every paragraph, label and control is set in Geist.</p>
    <p>
      It sets <code>{data.variable}</code>, the family
      <code class="break-all">{data.family}</code>.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Set body text with <code>font-sans</code>, or leave it: the body inherits
      it.
    </li>
    <li>Use it at the body size, <code>text-base</code>.</li>
  {/snippet}
  {#snippet donts()}
    <li>Set headings in Geist. Headings take IBM Plex Sans.</li>
    <li>Set code or data in Geist. They take JetBrains Mono.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The face is self-hosted through Fontsource, with
      <code>font-display: swap</code>: text shows in the fallback until the face
      loads.
    </li>
    <li>
      The family falls back to <code>system-ui</code>, then
      <code>sans-serif</code>, so text reads even if the face never loads.
    </li>
    <li>A face carries no role or name; the text it sets is read as it is.</li>
  {/snippet}
</Component>
