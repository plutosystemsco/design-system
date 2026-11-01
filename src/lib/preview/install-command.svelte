<script lang="ts">
  import { version } from "../../../package.json";

  let { name }: { name: string } = $props();

  // The registry is this repository's release tag on GitHub, the tag of the
  // version in package.json. REGISTRY_URL points the CLI at it, in place of
  // shadcn-svelte's own.
  const registry = `https://raw.githubusercontent.com/plutosystemsco/design-system/v${version}/static/r`;
</script>

<code
  class="block rounded bg-muted px-3 py-2 text-sm break-all whitespace-pre-wrap text-foreground"
  >REGISTRY_URL={registry} bunx --bun shadcn-svelte@1.7.1 add {name} -y</code
>
