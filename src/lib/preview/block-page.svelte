<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import Component from "#lib/site/page/component.svelte";
  import BlockViewer from "./block-viewer.svelte";
  import { BLOCK_VIEWS } from "./blocks";

  /**
   * A block's page: the component template, with the viewer for its
   * examples, and under "Files you own" each file as `add` writes it.
   */
  let {
    name,
    files,
    when,
    dos,
    donts,
    accessibility,
    setup,
  }: {
    name: string;
    files: { appPath: string; text: string }[];
    when: Snippet;
    dos: Snippet;
    donts: Snippet;
    accessibility: Snippet;
    /** What an app does after `add`, as a list: moving the shell's layout, the footer's values. */
    setup?: Snippet;
  } = $props();

  const title = $derived(
    (page.data.registry as Record<string, { title: string }> | undefined)?.[
      name
    ]?.title ?? name,
  );
</script>

{#snippet preview()}
  <p class="max-w-prose text-muted-foreground">
    The block at a phone, tablet or desktop width, in the site's theme. A link
    that leaves the block opens inside the frame; Open alone shows the view at
    any width.
  </p>
  <BlockViewer block={name} {title} views={BLOCK_VIEWS[name] ?? []} />
{/snippet}

{#snippet code()}
  {#if setup}
    <h3 class="mt-10 font-sans text-base font-semibold">Set up</h3>
    <ul class="mt-3 grid max-w-prose list-disc gap-2 ps-6">
      {@render setup()}
    </ul>
  {/if}
  <h3 class="mt-10 font-sans text-base font-semibold">
    Each file, as add writes it
  </h3>
  <p class="mt-2 max-w-prose text-sm text-muted-foreground">
    At its path in an app whose aliases are <code>#lib/components</code>,
    <code>#lib/components/ui</code> and <code>#lib/utils</code>.
  </p>
  <div class="mt-4 grid gap-3" data-testid="code-view">
    {#each files as file (file.appPath)}
      <details class="rounded border border-border">
        <!-- A path has no break of its own; at 320 px it breaks anywhere, so
             the chip's padding and edge never widen the page. -->
        <summary class="cursor-pointer px-4 py-3"
          ><code class="text-sm wrap-anywhere">{file.appPath}</code></summary
        >
        <pre
          data-language={file.appPath.endsWith(".svelte")
            ? "svelte"
            : file.appPath.endsWith(".ts")
              ? "ts"
              : undefined}
          class="bg-code-background px-4 py-3 font-mono text-xs wrap-anywhere whitespace-pre-wrap text-foreground"><code
            >{file.text}</code
          ></pre>
      </details>
    {/each}
  </div>
{/snippet}

<Component {name} {preview} {when} {dos} {donts} {accessibility} {code} />
