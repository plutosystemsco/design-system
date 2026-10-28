<script lang="ts">
  import FontPage from "#lib/preview/font-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<FontPage
  item="font-jetbrains-mono"
  title="JetBrains Mono"
  role="The face for eyebrows, labels, code, paths and data."
  variable={data.variable}
  family={data.family}
  fontClass="font-mono"
  specimens={data.specimens}
/>
