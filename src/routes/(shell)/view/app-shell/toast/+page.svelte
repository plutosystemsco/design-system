<script lang="ts">
  // 026 decision 20: a test surface for A1, not a block's view (no variant,
  // no thumbnail, no sitemap entry). The shipped layout, as an app gets it,
  // with its toaster rendered on the server, around one button that raises
  // a toast. The shipped example page follows it, so the layout's anchors
  // (#overview and its siblings) have their targets when it is prerendered.
  import Layout from "#lib/registry/blocks/app-shell/+layout.svelte";
  import Page from "#lib/registry/blocks/app-shell/+page.svelte";
  import { Button } from "#lib/registry/ui/button";
  import { toast } from "#lib/registry/ui/toast";
</script>

<Layout data={{ sidebarOpen: true }}>
  <div class="mb-12">
    <Button onclick={() => toast.success("Project saved")}>Save</Button>
  </div>
  <Page />
</Layout>
