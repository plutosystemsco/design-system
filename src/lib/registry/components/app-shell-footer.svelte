<script lang="ts">
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { cn } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    commit,
    builtAt,
    docId,
    sourceHref,
    statement,
    tagline = "Work runs on data.",
    class: className,
    ...restProps
  }: HTMLAttributes<HTMLElement> & {
    /** The build's commit, shown as given; without it, no row. */
    commit?: string;
    /** The commit's date, ISO 8601, shown as its date in a <time>; without it, no row. */
    builtAt?: string;
    /** The doc ID, `PS-<series>-<NNNN>`; without it, no row. */
    docId?: string;
    /** The site's own source; the link reads its host and path. */
    sourceHref?: string;
    /** One plain sentence under the rows, only when it is true; empty by default. */
    statement?: string;
    /** The brand line beside the lockup, which is the name; pass "" to show none. */
    tagline?: string;
  } = $props();

  // The link's text: the host and path, never the scheme.
  const sourceText = $derived.by(() => {
    if (!sourceHref) return "";
    try {
      const url = new URL(sourceHref);
      return `${url.host}${url.pathname.replace(/\/$/, "")}`;
    } catch {
      return sourceHref;
    }
  });
  const date = $derived(builtAt?.slice(0, 10));
  const rows = $derived(Boolean(commit || builtAt || docId || sourceHref));
</script>

<!--
  The contentinfo: the lockup (not a link; the header's is) with the brand
  line beside it, and the build's furniture at the end in mono, lowercase
  labels typed as such: commit, built, doc, source, each row only when its
  value is given. The row wraps to one column on a phone. The build date on
  every page shows when it was last updated: no public surface without a visible
  last-updated date.
-->
<footer
  data-slot="app-shell-footer"
  class={cn("groove bg-background", className)}
  {...restProps}
>
  <div class="mx-auto max-w-5xl px-6 pt-12 pb-16">
    <div class="flex flex-wrap items-center justify-between gap-6">
      <div class="flex flex-wrap items-baseline gap-x-4 gap-y-2">
        <Lockup class="text-2xl" />
        {#if tagline}
          <p class="text-sm">{tagline}</p>
        {/if}
      </div>
      {#if rows}
        <dl class="flex flex-col gap-1 font-mono text-xs text-muted-foreground">
          {#if commit}
            <div class="flex gap-2">
              <dt class="w-16">commit</dt>
              <dd><code>{commit}</code></dd>
            </div>
          {/if}
          {#if builtAt}
            <div class="flex gap-2">
              <dt class="w-16">built</dt>
              <dd><time datetime={builtAt}>{date}</time></dd>
            </div>
          {/if}
          {#if docId}
            <div class="flex gap-2">
              <dt class="w-16">doc</dt>
              <dd>{docId}</dd>
            </div>
          {/if}
          {#if sourceHref}
            <div class="flex gap-2">
              <dt class="w-16">source</dt>
              <dd class="min-w-0">
                <a
                  href={sourceHref}
                  class="inline-flex min-h-6 items-center underline underline-offset-4 wrap-anywhere hover:text-foreground"
                >
                  {sourceText}
                </a>
              </dd>
            </div>
          {/if}
        </dl>
      {/if}
    </div>
    {#if statement}
      <p class="mt-6 text-sm">{statement}</p>
    {/if}
  </div>
</footer>
