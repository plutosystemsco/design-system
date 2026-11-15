<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const View = $derived(data.View);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<!-- One example, alone, in the mode its item is shown in. -->
<main data-mode={data.mode} class="bg-background p-6 text-foreground md:p-8">
  <!-- The page's headings, as on the component page: the example's own
       headings start at h4. -->
  <h1 class="sr-only">{data.itemTitle}</h1>
  <h2 class="sr-only">Example</h2>
  <h3 class="sr-only">{data.title}</h3>
  {#if View}<View {data} />{/if}
</main>
