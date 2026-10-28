<script lang="ts">
  import FontPage from "#lib/preview/font-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<FontPage
  item="font-geist"
  title="Geist"
  role="The body face. Every paragraph, label and control is set in Geist."
  variable={data.variable}
  family={data.family}
  fontClass="font-sans"
  specimens={data.specimens}
/>
