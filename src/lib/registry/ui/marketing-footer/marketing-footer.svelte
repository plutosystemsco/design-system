<script lang="ts" module>
  /** A group of links: its title names its navigation landmark. */
  export type MarketingFooterGroup = {
    /** The group's heading. */
    title: string;
    /** The group's links, in order, each with its text and where it goes. */
    links: { label: string; href: string }[];
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { cn } from "#lib/utils";

  let {
    logo,
    appName,
    groups,
    tagline,
    commit,
    builtAt,
    docId,
    sourceHref,
    statement,
    class: className,
  }: {
    /** The product's logo, the bar's snippet; it renders here for "footer". */
    logo: Snippet<[place: "header" | "footer"]>;
    /** The product's name: the logo's accessible name. */
    appName: string;
    /** The footer's link groups, each a titled list. */
    groups: MarketingFooterGroup[];
    /** The product's own line under its logo. */
    tagline?: string;
    /** The build's commit, shown as given; without it, no row. */
    commit?: string;
    /** The commit's date, ISO 8601, shown as its date in a <time>; without it, no row. */
    builtAt?: string;
    /** A doc ID in the product's own scheme, shown as given; without it, no row. */
    docId?: string;
    /** The product's own source; the link reads its host and path; without it, no row. */
    sourceHref?: string;
    /** One plain sentence under the rows, only when it is true. */
    statement?: string;
    class?: string;
  } = $props();

  const uid = $props.id();
  // The link's words are the host and the path, never the scheme.
  const sourceText = $derived.by(() => {
    if (!sourceHref) return "";
    try {
      const url = new URL(sourceHref);
      return `${url.host}${url.pathname.replace(/\/$/, "")}`;
    } catch {
      return sourceHref;
    }
  });
  const facts = $derived(Boolean(commit || builtAt || docId || sourceHref));
</script>

<!--
  The contentinfo: the logo (not a link; the bar's is) with the product's
  line, then each group of links, a navigation landmark named by its title,
  which is a heading at the mono eyebrow step. Under them, the build's facts
  by the app shell footer's rules: the rows
  commit, built, doc and source, in mono, each only when its value is given,
  no word standing in for a missing one; then the statement when given. It
  is expressive, so in the dark theme its mark shows the lifted four, as the
  bar's does.
-->
<footer
  data-slot="marketing-footer"
  data-mode="expressive"
  class={cn("groove bg-background", className)}
>
  <div class="mx-auto grid max-w-7xl gap-12 px-(--gutter-stage) py-16">
    <div class="flex flex-wrap items-start justify-between gap-12">
      <div class="flex flex-col items-start gap-4">
        <span role="img" aria-label={appName} class="inline-flex items-center">
          {@render logo("footer")}
        </span>
        {#if tagline}
          <p class="text-sm text-muted-foreground">{tagline}</p>
        {/if}
      </div>
      <div class="flex flex-wrap gap-12">
        {#each groups as group, index (index)}
          <nav aria-labelledby="{uid}-group-{index}">
            <h2
              id="{uid}-group-{index}"
              class="font-mono text-xs font-medium tracking-eyebrow text-muted-foreground lowercase"
            >
              {group.title}
            </h2>
            <ul class="mt-2 grid">
              {#each group.links as link, place (place)}
                <li>
                  <a
                    href={link.href}
                    class="inline-flex min-h-8 items-center text-sm hover:text-primary"
                    >{link.label}</a
                  >
                </li>
              {/each}
            </ul>
          </nav>
        {/each}
      </div>
    </div>
    {#if facts || statement}
      <div class="flex flex-col gap-4">
        {#if facts}
          <dl
            class="flex flex-col gap-1 font-mono text-xs text-muted-foreground"
          >
            {#if commit}
              <div class="flex gap-2">
                <dt class="w-16">commit</dt>
                <dd><code>{commit}</code></dd>
              </div>
            {/if}
            {#if builtAt}
              <div class="flex gap-2">
                <dt class="w-16">built</dt>
                <dd><time datetime={builtAt}>{builtAt.slice(0, 10)}</time></dd>
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
                    >{sourceText}</a
                  >
                </dd>
              </div>
            {/if}
          </dl>
        {/if}
        {#if statement}
          <p class="text-sm">{statement}</p>
        {/if}
      </div>
    {/if}
  </div>
</footer>
