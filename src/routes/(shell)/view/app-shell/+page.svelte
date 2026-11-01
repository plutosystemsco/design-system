<script lang="ts">
  // The shipped files, as an app gets them: the layout wrapping the page.
  import Layout from "#lib/registry/blocks/app-shell/+layout.svelte";
  import Page from "#lib/registry/blocks/app-shell/+page.svelte";
</script>

<Layout data={{ sidebarOpen: true }}>
  <Page />
</Layout>
