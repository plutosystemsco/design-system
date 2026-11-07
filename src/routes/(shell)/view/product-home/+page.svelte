<script lang="ts">
  import Page from "#lib/registry/blocks/product-home/+page.svelte";
  import { ThemeScript } from "#lib/registry/ui/theme";

  // The shipped page, as an app's layout gives it: the block renders its own
  // bar, main and footer (010 decision 9), and this view adds the theme's head
  // script, as an app's layout would.
</script>

<ThemeScript />
<Page />
