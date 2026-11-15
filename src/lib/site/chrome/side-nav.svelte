<script lang="ts">
  import { onMount } from "svelte";
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import type { DoorId } from "../doors.ts";
  import { GROUPS, navOrder, type SitePage } from "../sitemap.ts";

  let {
    door,
    current,
    label,
    filter = false,
    onfollow,
    class: className,
  }: {
    /** The door whose pages it lists; none for the changelog. */
    door: DoorId | null;
    /** The page's path, marked current. */
    current: string;
    /** The nav's name. */
    label: string;
    /** Components' filter, on its pages but the landing. */
    filter?: boolean;
    /** After a link is followed: the sheet closes. */
    onfollow?: () => void;
    class?: string;
  } = $props();

  const pages = $derived(navOrder(door));
  const head = $derived(pages[0]);
  // Components' pages under their groups; every other door's in one list.
  const groups = $derived(
    door === "components"
      ? GROUPS.map((g) => ({
          ...g,
          pages: pages.slice(1).filter((p) => p.group === g.id),
        }))
      : [{ id: "", title: "", pages: door ? pages.slice(1) : pages }],
  );

  let query = $state("");
  const q = $derived(query.trim().toLowerCase());
  const match = (p: SitePage) => !q || p.title.toLowerCase().includes(q);
  const count = $derived(pages.slice(1).filter(match).length);
  let list: HTMLElement | undefined = $state();

  // The current link inside the nav's own box, by its own scroll: never
  // scrollIntoView, which would move the window too.
  onMount(() => {
    const a = list?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!list || !a) return;
    const box = list.getBoundingClientRect();
    const at = a.getBoundingClientRect();
    if (at.bottom > box.bottom || at.top < box.top)
      list.scrollTop += at.top - box.top - box.height / 3;
  });
</script>

{#snippet link(p: SitePage)}
  <a
    href={p.path}
    aria-current={p.path === current ? "page" : undefined}
    onclick={() => onfollow?.()}
    class="site-nav-link">{p.title}</a
  >
{/snippet}

<!--
  The left nav (018 decision 1): the door's pages in navOrder, the current
  one marked by weight and a start border, so forced colours keep the mark.
  Its links scroll inside it. Not in the Markdown twin.
-->
<nav
  aria-label={label}
  data-slot="side-nav"
  data-md="skip"
  bind:this={list}
  class={["text-sm", className]}
>
  {#if filter}
    <div class="mb-4 grid gap-1 px-1">
      <label for="nav-filter-{door}" class="text-sm font-medium"
        >Filter components</label
      >
      <div class="relative">
        <MagnifyingGlass
          aria-hidden="true"
          class="pointer-events-none absolute start-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <input
          id="nav-filter-{door}"
          type="text"
          autocomplete="off"
          placeholder="Button, dialog, chart"
          bind:value={query}
          class="h-8 w-full min-w-0 rounded border border-input bg-background ps-8 pe-2 text-sm placeholder:text-muted-foreground"
        />
      </div>
      <p role="status" aria-live="polite" class="text-xs text-muted-foreground">
        {q ? `${count} component${count === 1 ? "" : "s"}` : ""}
      </p>
    </div>
  {/if}
  {#if door}
    <ul class="mb-3"><li>{@render link(head)}</li></ul>
  {/if}
  {#each groups as g (g.id)}
    {@const shown = g.pages.filter(match)}
    {#if g.id}
      <div data-slot="nav-group" class="mb-3" hidden={!shown.length}>
        <span
          id="nav-{door}-{g.id}"
          class="block px-3 pb-1 text-xs font-medium text-muted-foreground"
          >{g.title}</span
        >
        <ul aria-labelledby="nav-{door}-{g.id}">
          {#each g.pages as p (p.path)}
            <li hidden={!match(p)}>{@render link(p)}</li>
          {/each}
        </ul>
      </div>
    {:else}
      <ul>
        {#each g.pages as p (p.path)}<li>{@render link(p)}</li>{/each}
      </ul>
    {/if}
  {/each}
</nav>
