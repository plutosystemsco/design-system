<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  /** Every word pagination says or shows, for an app to translate. */
  export type PaginationStrings = {
    /** The nav's name: "Pagination". */
    label: string;
    /** The Previous control's word: "Previous". */
    previous: string;
    /** The Next control's word: "Next". */
    next: string;
    /** What a screen reader hears before each page's number: "Page". */
    page: string;
    /** What a screen reader hears after Previous and Next: " page". It starts with a space. */
    endSuffix: string;
    /** The page of pages, shown when narrow and spoken in button mode: "Page 5 of 12". */
    summary: (page: number, pages: number) => string;
  };

  const STRINGS: PaginationStrings = {
    label: "Pagination",
    previous: "Previous",
    next: "Next",
    page: "Page",
    endSuffix: " page",
    summary: (page, pages) => `Page ${page} of ${pages}`,
  };

  export type PaginationProps = Omit<
    HTMLAttributes<HTMLElement>,
    "class" | "children"
  > & {
    /** The current page, counted from 1. Clamped to 1 to `pages`. In button mode the item sets it when a page is pressed; in link mode your route sets it. */
    page?: number;
    /** How many pages there are. With 1 or fewer, nothing renders. */
    pages: number;
    /** Link mode: the URL of each page. With it, every page and end control is a link. Without it, they are buttons. Choose links whenever a page has a URL. */
    href?: (page: number) => string;
    /** Called after a page or end button is pressed, with the new page. Button mode only. */
    onpagechange?: (page: number) => void;
    /** Pages shown either side of the current one. The first and last page always show. */
    siblings?: 0 | 1 | 2;
    /** Pages 48 px tall, or 32 px for a dense table. Both meet the 24 px target. */
    size?: "default" | "sm";
    /** Every word it says or shows: `label` "Pagination", `previous` "Previous", `next` "Next", `page` "Page", `endSuffix` " page", `summary` `(page, pages) => "Page 5 of 12"`. */
    strings?: Partial<PaginationStrings>;
    /** Classes for the `nav`. In a row beside other content, give it the remaining width, such as `flex-1`. */
    class?: string;
    /** The `nav`, bound. */
    ref?: HTMLElement | null;
  };

  // The row needs a width of its own to measure: below the width the full
  // row takes in English, the page list hides and "Page 5 of 12" shows.
  // One step per size and siblings, measured over pages 1 to 12 of 12.
  const SWITCH: Record<
    "default" | "sm",
    Record<0 | 1 | 2, { list: string; summary: string }>
  > = {
    default: {
      0: { list: "hidden @xl:flex", summary: "@xl:hidden" },
      1: { list: "hidden @2xl:flex", summary: "@2xl:hidden" },
      2: { list: "hidden @3xl:flex", summary: "@3xl:hidden" },
    },
    sm: {
      0: { list: "hidden @md:flex", summary: "@md:hidden" },
      1: { list: "hidden @lg:flex", summary: "@lg:hidden" },
      2: { list: "hidden @xl:flex", summary: "@xl:hidden" },
    },
  };

  // A page is square at one or two digits, and still fits four.
  const PAGE: Record<"default" | "sm", string> = {
    default: "min-w-12 px-2",
    sm: "min-w-8 px-1",
  };
  const ELLIPSIS: Record<"default" | "sm", string> = {
    default: "h-12 min-w-12 text-base",
    sm: "h-8 min-w-8 text-sm",
  };
</script>

<script lang="ts">
  import CaretLeft from "phosphor-svelte/lib/CaretLeft";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import { tick, untrack } from "svelte";
  import { buttonVariants } from "#lib/registry/ui/button";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";
  import { paginationPages } from "./pagination-pages.js";

  let {
    ref = $bindable(null),
    class: className,
    page = $bindable(1),
    pages,
    href,
    onpagechange,
    siblings = 1,
    size = "default",
    strings,
    ...restProps
  }: PaginationProps = $props();

  const s = $derived({ ...STRINGS, ...strings });
  const total = $derived(
    Number.isFinite(pages) ? Math.max(1, Math.floor(pages)) : 1,
  );
  const current = $derived(
    Math.min(Math.max(1, Number.isFinite(page) ? Math.round(page) : 1), total),
  );
  const items = $derived(paginationPages(current, total, siblings));
  // Fixed at the first render, so the status is in the page from the start.
  const buttonMode = untrack(() => !href);
  const switched = $derived(SWITCH[size][siblings]);

  // Button mode: one frame after the page changes, the status says it. The
  // first render says nothing.
  let said = $state("");
  let spoken = untrack(() => current);
  $effect(() => {
    const n = current;
    if (!buttonMode || n === spoken) return;
    spoken = n;
    const text = untrack(() => s.summary(n, total));
    said = "";
    requestAnimationFrame(() => {
      if (spoken === n) said = text;
    });
  });

  const control = (selector: string) =>
    ref?.querySelector<HTMLElement>(selector) ?? null;
  const pageControl = (n: number) =>
    control(`[data-slot="pagination-page"] [data-pagination-to="${n}"]`);

  /**
   * A press in button mode. Focus moves only when it was inside the nav as
   * the press began: WebKit focuses no button on click, so a click there
   * leaves focus where it was, as every other button does.
   */
  async function go(to: number, kind: "page" | "previous" | "next") {
    const inside = !!ref && ref.contains(document.activeElement);
    if (to !== current) {
      page = to;
      onpagechange?.(to);
    }
    await tick();
    if (!inside || !ref) return;
    // A pressed page keeps focus; a keyed each may have moved its node.
    if (kind === "page") {
      const pressed = pageControl(to);
      if (pressed && document.activeElement !== pressed) pressed.focus();
      return;
    }
    const same = control(`[data-slot="pagination-${kind}-control"]`);
    if (same) {
      if (document.activeElement !== same) same.focus();
      return;
    }
    // The end control vanished: focus goes to the current page, or, while
    // the list is hidden, to the other end control.
    const list = control('[data-slot="pagination-list"]');
    const shown = !!list && getComputedStyle(list).display !== "none";
    const other = kind === "next" ? "previous" : "next";
    const target = shown
      ? pageControl(current)
      : control(`[data-slot="pagination-${other}-control"]`);
    target?.focus();
  }

  // One handler for every control, so an app's own onclick on the nav runs
  // first, and a preventDefault there stops the item.
  function onclick(event: MouseEvent & { currentTarget: HTMLElement }) {
    (restProps.onclick as ((e: typeof event) => void) | null | undefined)?.(
      event,
    );
    if (event.defaultPrevented || !buttonMode) return;
    const pressed = (event.target as Element).closest<HTMLElement>(
      "[data-pagination-to]",
    );
    if (!pressed || !event.currentTarget.contains(pressed)) return;
    const slot = pressed.dataset.slot;
    void go(
      Number(pressed.dataset.paginationTo),
      slot === "pagination-previous-control"
        ? "previous"
        : slot === "pagination-next-control"
          ? "next"
          : "page",
    );
  }
</script>

{#snippet endWords(kind: "previous" | "next")}
  {#if kind === "previous"}<CaretLeft aria-hidden="true" />{s.previous}<span
      class="sr-only">{s.endSuffix}</span
    >{:else}{s.next}<span class="sr-only">{s.endSuffix}</span><CaretRight
      aria-hidden="true"
    />{/if}
{/snippet}

{#snippet end(kind: "previous" | "next", to: number)}
  {@const look = buttonVariants({ variant: "ghost", size })}
  {#if !buttonMode && href}
    <a
      href={href(to)}
      rel={kind === "previous" ? "prev" : "next"}
      data-slot="pagination-{kind}-control"
      data-pagination-to={to}
      class={look}>{@render endWords(kind)}</a
    >
  {:else}
    <button
      type="button"
      data-slot="pagination-{kind}-control"
      data-pagination-to={to}
      class={look}>{@render endWords(kind)}</button
    >
  {/if}
{/snippet}

<!-- Holds an omitted end's width: hidden from sight, the Tab order and the
     accessibility tree, as wide as the translated word. -->
{#snippet placeholder(kind: "previous" | "next")}
  <span
    aria-hidden="true"
    inert
    class={cn(buttonVariants({ variant: "ghost", size }), "invisible")}
    >{@render endWords(kind)}</span
  >
{/snippet}

{#snippet pageLink(n: number)}
  {@const isCurrent = n === current}
  {@const look = cn(
    buttonVariants({ variant: isCurrent ? "secondary" : "ghost", size }),
    PAGE[size],
    "tabular-nums",
    isCurrent && "font-bold",
  )}
  {#if !buttonMode && href}
    <a
      href={href(n)}
      data-pagination-to={n}
      aria-current={isCurrent ? "page" : undefined}
      class={look}><span class="sr-only">{`${s.page} `}</span>{n}</a
    >
  {:else}
    <button
      type="button"
      data-pagination-to={n}
      aria-current={isCurrent ? "page" : undefined}
      class={look}><span class="sr-only">{`${s.page} `}</span>{n}</button
    >
  {/if}
{/snippet}

<!--
  A named nav of page links, or page buttons for a list paged in place.
  Tab reaches Previous, each page and Next; no arrow keys. The current page
  has aria-current and a border. Previous is omitted on the first page and
  Next on the last, and each end's slot keeps its width. In button mode a
  hidden status says the new page, and focus stays on the pressed control,
  or moves to the current page (or, narrow, the other end) when it goes.
-->
{#if total > 1}
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <nav
    {...restProps}
    bind:this={ref}
    data-slot="pagination"
    aria-label={s.label}
    class={cn("@container flex w-full min-w-0 items-center gap-2", className)}
    {onclick}
  >
    <div data-slot="pagination-previous" class="flex shrink-0">
      {#if current > 1}
        {@render end("previous", current - 1)}
      {:else}
        {@render placeholder("previous")}
      {/if}
    </div>
    <ul data-slot="pagination-list" class={cn("gap-1", switched.list)}>
      {#each items as item (item.type === "page" ? item.page : item.key)}
        {#if item.type === "page"}
          <li data-slot="pagination-page" class="flex">
            {@render pageLink(item.page)}
          </li>
        {:else}
          <li
            data-slot="pagination-ellipsis"
            aria-hidden="true"
            class={cn(
              "flex items-center justify-center text-muted-foreground",
              ELLIPSIS[size],
            )}
          >
            …
          </li>
        {/if}
      {/each}
    </ul>
    <p
      data-slot="pagination-summary"
      class={cn(
        "text-sm whitespace-nowrap text-foreground tabular-nums",
        switched.summary,
      )}
    >
      {s.summary(current, total)}
    </p>
    <div data-slot="pagination-next" class="flex shrink-0">
      {#if current < total}
        {@render end("next", current + 1)}
      {:else}
        {@render placeholder("next")}
      {/if}
    </div>
    {#if buttonMode}
      <Status data-slot="pagination-status" text={said} />
    {/if}
  </nav>
{/if}
