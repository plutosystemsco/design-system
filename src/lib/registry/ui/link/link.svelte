<script lang="ts" module>
  import type { Snippet } from "svelte";
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import { cn } from "#lib/utils";

  /** The link's colour: the primary colour, or the surrounding text's. */
  export type LinkVariant = "default" | "inherit";

  /** Every word the link says, for an app to translate. */
  export type LinkStrings = {
    /** What a screen reader hears after a new-tab link's text. It starts with a space. */
    newTab: string;
  };

  const STRINGS: LinkStrings = { newTab: " (opens in a new tab)" };

  const VARIANT: Record<LinkVariant, string> = {
    default: "text-primary",
    inherit: "text-current",
  };

  /**
   * The link's classes, for a plain `<a>` that cannot be a `Link`, such as
   * one rendered from Markdown: always underlined, thicker on hover. It
   * takes `class` last, as the other variant functions do.
   */
  export function linkVariants({
    variant = "default",
    standalone = false,
    visited = false,
    class: className,
  }: {
    variant?: "default" | "inherit";
    standalone?: boolean;
    visited?: boolean;
    class?: string;
  } = {}): string {
    return cn(
      "underline underline-offset-4 hover:decoration-2",
      VARIANT[variant],
      standalone && "inline-flex min-h-6 items-center",
      visited && "visited:text-foreground",
      className,
    );
  }

  export type LinkProps = Omit<
    HTMLAnchorAttributes,
    "href" | "rel" | "class" | "children"
  > & {
    /** Where it goes. A link always goes somewhere; for an action, use `Button`. */
    href: string;
    /** The primary colour, or the surrounding text's, for a link inside muted text or a footer. Both are underlined. */
    variant?: "default" | "inherit";
    /** A link alone on its line, such as in a list: it gets a 24 px tall target. A link inside a sentence does not need one. */
    standalone?: boolean;
    /** Opens in a new tab, with `rel="noopener noreferrer"`, an icon, and "(opens in a new tab)" for screen readers. Use it rarely: it takes the Back button away. A `target="_blank"` passed directly is treated the same. */
    newTab?: boolean;
    /** Shows visited links in the text colour, for long lists of documents a person works through. */
    visited?: boolean;
    /** Link types of your own, such as `"external"`. With a new tab, `noopener noreferrer` is merged in. */
    rel?: string;
    /** Every word it says: `newTab`, " (opens in a new tab)". */
    strings?: Partial<LinkStrings>;
    /** Classes for the link. */
    class?: string;
    /** The link, bound. */
    ref?: HTMLAnchorElement | null;
    /** The link's text: words that say where it goes, read alone. */
    children?: Snippet;
  };

  /** Two lists of link types, merged, each once, in order. */
  function mergeRel(
    own: string | undefined,
    add: string[],
  ): string | undefined {
    const tokens = [...(own ?? "").split(/\s+/), ...add].filter(Boolean);
    const merged = [...new Set(tokens)].join(" ");
    return merged || undefined;
  }
</script>

<script lang="ts">
  import ArrowSquareOut from "phosphor-svelte/lib/ArrowSquareOut";

  let {
    ref = $bindable(null),
    class: className,
    href,
    variant = "default",
    standalone = false,
    newTab = false,
    visited = false,
    rel,
    strings,
    children,
    ...restProps
  }: LinkProps = $props();

  const s = $derived({ ...STRINGS, ...strings });
  // A new tab asked for by `target` is said and made safe, as `newTab` is.
  const opensTab = $derived(newTab || restProps.target === "_blank");
</script>

<!--
  The one inline link: an <a href>, always underlined, in the primary colour
  or the text's. Focus is the theme's ring. A new tab is said in words a
  screen reader hears and shown by an icon, and its rel holds noopener and
  noreferrer beside the app's own link types.
-->
<a
  {...restProps}
  bind:this={ref}
  data-slot="link"
  {href}
  target={opensTab ? "_blank" : restProps.target}
  rel={mergeRel(rel, opensTab ? ["noopener", "noreferrer"] : [])}
  class={linkVariants({ variant, standalone, visited, class: className })}
  >{@render children?.()}{#if opensTab}<ArrowSquareOut
      data-slot="link-icon"
      aria-hidden="true"
      class="ms-1 inline size-4 align-text-bottom"
    /><span data-slot="link-new-tab" class="sr-only">{s.newTab}</span>{/if}</a
>
