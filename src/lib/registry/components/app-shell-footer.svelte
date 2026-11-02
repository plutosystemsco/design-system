<script lang="ts">
  import type { Snippet } from "svelte";
  import { FourDot } from "#lib/registry/ui/four-dot";
  import { cn } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    appName,
    logo,
    commit,
    builtAt,
    docId,
    sourceHref,
    statement,
    tagline = "",
    endorsed = false,
    class: className,
    ...restProps
  }: HTMLAttributes<HTMLElement> & {
    /** The product's name: the wordmark without a logo, the logo's accessible name with one. */
    appName: string;
    /** The product's logo, the header's snippet; it renders here for "footer". */
    logo?: Snippet<[place: "header" | "footer"]>;
    /** The build's commit, shown as given; without it, no row. */
    commit?: string;
    /** The commit's date, ISO 8601, shown as its date in a <time>; without it, no row. */
    builtAt?: string;
    /** A doc ID in the product's own scheme (Pluto Systems' is `PS-<series>-<NNNN>`), shown as given; without it, no row. */
    docId?: string;
    /** The product's own source; the link reads its host and path. */
    sourceHref?: string;
    /** One plain sentence under the rows, only when it is true; empty by default. */
    statement?: string;
    /** The product's own line beside its name; empty by default. */
    tagline?: string;
    /** Shows "A Pluto Systems product" under the rows; off by default. */
    endorsed?: boolean;
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
  The contentinfo: the product's logo or its name as a wordmark (not a link;
  the header's is), its own line beside it when given, and the build's
  furniture at the end in mono, lowercase labels typed as such: commit,
  built, doc, source, each row only when its value is given. The row wraps
  to one column on a phone. The build date on every page shows when it was
  last updated: no public surface without a visible last-updated date. Under
  the rows, the endorsement when turned on, whose four dots dock in when it
  is hovered, then the statement when given.
-->
<footer
  data-slot="app-shell-footer"
  class={cn("groove bg-background", className)}
  {...restProps}
>
  <div class="mx-auto max-w-5xl px-6 pt-12 pb-16">
    <div class="flex flex-wrap items-center justify-between gap-6">
      <div class="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2">
        {#if logo}
          <span
            role="img"
            aria-label={appName}
            data-shell="logo"
            class="inline-flex items-center"
          >
            {@render logo("footer")}
          </span>
        {:else}
          <span
            data-shell="wordmark"
            class="min-w-0 font-heading text-2xl leading-none font-bold tracking-mark wrap-anywhere"
          >
            {appName}
          </span>
        {/if}
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
    {#if endorsed || statement}
      <div class="mt-6 flex flex-col gap-2">
        {#if endorsed}
          <p
            data-shell="endorsement"
            class="flex w-fit items-baseline gap-(--mark-lockup-gap) text-sm text-muted-foreground"
          >
            A Pluto Systems product<FourDot
              class="mark-reveal -translate-y-(--mark-lift)"
            />
          </p>
        {/if}
        {#if statement}
          <p class="text-sm">{statement}</p>
        {/if}
      </div>
    {/if}
  </div>
</footer>
