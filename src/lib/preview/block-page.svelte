<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import BlockViewer from "./block-viewer.svelte";
  import { BLOCK_VIEWS } from "./blocks";
  import InstallCommand from "./install-command.svelte";
  import InstallNote from "./install-note.svelte";
  import ItemHeader from "./item-header.svelte";
  import PreviewSection from "./preview-section.svelte";

  /**
   * A block's item page (003 decision 17): the header with the note on -o,
   * Preview (the viewer), Accessibility, and Code, the files `add` writes.
   */
  let {
    name,
    files,
    accessibility,
    setup,
  }: {
    name: string;
    files: { appPath: string; text: string }[];
    accessibility: Snippet;
    /** What an app does after `add`, as a list (006: moving the shell's layout, the footer's values). */
    setup?: Snippet;
  } = $props();

  const title = $derived(
    (page.data.registry as Record<string, { title: string }> | undefined)?.[
      name
    ]?.title ?? name,
  );
</script>

<ItemHeader {name} />
<InstallNote />

<PreviewSection
  id="preview"
  title="Preview"
  intro="The block at a phone, tablet or desktop width, in the site's theme. A link that leaves the block opens inside the frame; Open alone shows the view at any width."
>
  <BlockViewer block={name} {title} views={BLOCK_VIEWS[name] ?? []} />
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    {@render accessibility()}
  </ul>
</PreviewSection>

{#if setup}
  <PreviewSection id="setup" title="Set up">
    <ul class="grid max-w-prose list-disc gap-2 pl-6">
      {@render setup()}
    </ul>
  </PreviewSection>
{/if}

<PreviewSection
  id="code"
  title="Code"
  intro="Each file exactly as add writes it, at its path in an app whose aliases are #lib/components, #lib/components/ui and #lib/utils."
>
  <InstallCommand {name} />
  <InstallNote />
  <div class="mt-6 grid gap-3" data-testid="code-view">
    {#each files as file (file.appPath)}
      <details class="rounded border border-border">
        <summary class="cursor-pointer px-4 py-3"
          ><code class="text-sm">{file.appPath}</code></summary
        >
        <pre
          class="bg-muted px-4 py-3 font-mono text-xs wrap-anywhere whitespace-pre-wrap text-foreground"><code
            >{file.text}</code
          ></pre>
      </details>
    {/each}
  </div>
</PreviewSection>
