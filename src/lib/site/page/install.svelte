<script lang="ts">
  import type { HighlightedLine } from "#lib/registry/lib/highlighter";
  import * as Tabs from "#lib/registry/ui/tabs";
  import { addCommand, GITHUB_REGISTRY, SITE_REGISTRY } from "../site.ts";
  import Command from "./command.svelte";

  let {
    name,
    lines,
  }: {
    name: string;
    lines: {
      site: HighlightedLine[] | null;
      github: HighlightedLine[] | null;
    } | null;
  } = $props();
</script>

<!--
  Install from this site's versioned registry, or from GitHub's. Both point
  at this release. Both panels stay in the page; the other is hidden.
-->
<Tabs.Root value="site" class="grid grid-cols-[minmax(0,1fr)] gap-3">
  <Tabs.List aria-label="Install from" data-md="skip">
    <Tabs.Trigger value="site">From this site</Tabs.Trigger>
    <Tabs.Trigger value="github">From GitHub</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="site" tabindex={-1}>
    <Command
      code={addCommand(name, SITE_REGISTRY)}
      lines={lines?.site}
      label="Install from this site"
      mdLabel="From this site:"
    />
  </Tabs.Content>
  <Tabs.Content value="github" tabindex={-1}>
    <Command
      code={addCommand(name, GITHUB_REGISTRY)}
      lines={lines?.github}
      label="Install from GitHub"
      mdLabel="From GitHub:"
    />
  </Tabs.Content>
</Tabs.Root>
