<script lang="ts">
  import FontPage from "#lib/preview/font-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<FontPage
  item="font-heading-ibm-plex-sans"
  title="IBM Plex Sans"
  role="The heading face, and the wordmark. Every heading is set in IBM Plex Sans, bold."
  variable={data.variable}
  family={data.family}
  fontClass="font-heading"
  specimens={data.specimens}
/>
