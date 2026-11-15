<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Dialog from "#lib/registry/ui/dialog";
  import { Kbd } from "#lib/registry/ui/kbd";
  import { DOORS } from "../doors.ts";
  import {
    componentName,
    groupHits,
    keyLegend,
    marks,
    search,
    type SearchHit,
  } from "../search.ts";
  import type { SearchEntry } from "../search/types.ts";
  import { addCommand } from "../site.ts";

  let {
    open = $bindable(false),
    onclosed,
    seed = "",
    onseed,
  }: {
    open?: boolean;
    /** After the palette closes, so the opener takes focus back. */
    onclosed?: () => void;
    /** Keys typed after the shortcut, before the input had focus. */
    seed?: string;
    /** The seed is in the input now. */
    onseed?: () => void;
  } = $props();

  let input: HTMLInputElement | undefined = $state();

  // The index is fetched the first time the palette opens, never before.
  let index = $state<SearchEntry[] | null>(null);
  let failed = $state(false);
  $effect(() => {
    if (!open || index || failed) return;
    fetch("/search.json")
      .then((r) => r.json())
      .then((entries: SearchEntry[]) => (index = entries))
      .catch(() => (failed = true));
  });

  let query = $state("");
  let active = $state(0);
  // The best 20 by rank, then grouped by door; the arrows walk the groups'
  // order, so `active` indexes `flat`.
  const groups = $derived(
    groupHits(index ? search(index, query).slice(0, 20) : []),
  );
  const flat = $derived(groups.flatMap((g) => g.hits));
  /** A hit's place in `flat`, for its option's id. */
  const at = $derived(new Map(flat.map((h, i) => [h.path, i])));
  /** What the copy key said, until the query or the active result moves. */
  let copied = $state("");
  $effect(() => {
    void query;
    active = 0;
  });
  $effect(() => {
    void active;
    void query;
    copied = "";
  });

  // The copy key is Command-C on macOS and Control-C elsewhere.
  const mac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform);
  const current = $derived(flat[active]);
  const legend = $derived(
    keyLegend(!!current && componentName(current) !== null, mac),
  );

  const status = $derived(
    failed
      ? "Search could not load. Check your connection and try again."
      : copied
        ? copied
        : !query.trim()
          ? ""
          : flat.length
            ? `${flat.length} result${flat.length === 1 ? "" : "s"}`
            : `No results for "${query.trim()}". Try a component's name, or browse the four sections.`,
  );

  const door = (id: SearchEntry["door"]) => DOORS.find((d) => d.id === id);

  function choose(entry: SearchEntry | undefined) {
    if (!entry) return;
    open = false;
    goto(entry.path);
  }

  /**
   * Command-C (Control-C) on a component result, with nothing selected in
   * the field, copies its add command. With text selected it copies the
   * text, as usual. The write happens in the key's own handler.
   */
  function copyCommand(e: KeyboardEvent, hit: SearchHit | undefined) {
    const name = hit && componentName(hit);
    if (!hit || !name || !input) return;
    if (input.selectionStart !== input.selectionEnd) return;
    e.preventDefault();
    navigator.clipboard.writeText(addCommand(name)).then(
      () => (copied = `Copied the command for ${hit.title}`),
      () =>
        (copied = `The command for ${hit.title} could not be copied. Open its page to copy it there.`),
    );
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(active + 1, flat.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(active - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(flat[active]);
    } else if (
      e.key.toLowerCase() === "c" &&
      (mac ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey) &&
      !e.altKey &&
      !e.shiftKey
    ) {
      copyCommand(e, flat[active]);
    }
  }

  const MARK =
    "bg-transparent font-semibold text-foreground forced-colors:bg-[Mark] forced-colors:text-[MarkText]";
</script>

<!-- Text with each word-start match of the query in a <mark>. -->
{#snippet marked(
  text: string,
)}{#each marks(text, query) as run, i (i)}{#if run.mark}<mark class={MARK}
        >{run.text}</mark
      >{:else}{run.text}{/if}{/each}{/snippet}

<!--
  The palette: a dialog holding an input and its results, in the combobox
  pattern, grouped by door. ArrowUp and ArrowDown move across the groups,
  Enter opens, Escape closes; the legend at the foot names the keys.
-->
<Dialog.Root
  bind:open
  onOpenChange={(o) => {
    if (!o) onclosed?.();
  }}
>
  <Dialog.Content
    label="Search"
    class="top-0 max-w-xl self-start"
    showCloseButton={false}
    onOpenAutoFocus={(e) => {
      e.preventDefault();
      input?.focus();
    }}
    onCloseAutoFocus={(e) => {
      e.preventDefault();
      onclosed?.();
    }}
  >
    <input
      bind:this={input}
      bind:value={query}
      onfocus={() => {
        if (seed) {
          query += seed;
          onseed?.();
        }
      }}
      {onkeydown}
      role="combobox"
      aria-label="Search the site"
      aria-expanded={flat.length > 0}
      aria-controls="site-search-results"
      aria-activedescendant={flat.length ? `site-search-${active}` : undefined}
      aria-describedby="site-search-keys"
      aria-autocomplete="list"
      autocomplete="off"
      placeholder="Search components, pages and guides"
      class="h-12 w-full rounded border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground"
    />
    <p role="status" aria-live="polite" class="text-sm text-muted-foreground">
      {status}
    </p>
    <div
      id="site-search-results"
      role="listbox"
      aria-label="Results"
      class="grid max-h-[60svh] gap-3 overflow-y-auto"
    >
      {#each groups as g (g.door ?? "site")}
        {@const d = door(g.door)}
        {@const gid = `site-search-group-${g.door ?? "site"}`}
        <ul role="group" aria-labelledby={gid} class="grid gap-1">
          <li
            role="presentation"
            id={gid}
            class="inline-flex items-center gap-1.5 px-3 text-xs text-muted-foreground"
          >
            {#if d}<span class="site-dot" data-door={d.n} aria-hidden="true"
              ></span>{/if}{g.name}
          </li>
          {#each g.hits as r (r.path)}
            {@const i = at.get(r.path) ?? 0}
            <!-- The input holds focus; a result is chosen by keys or a click. -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <li
              id="site-search-{i}"
              role="option"
              aria-selected={i === active}
              onclick={() => choose(r)}
              onpointermove={() => (active = i)}
              class="cursor-pointer rounded px-3 py-2 aria-selected:bg-accent aria-selected:text-accent-foreground"
            >
              <span data-slot="search-title" class="block font-medium"
                >{@render marked(r.title)}</span
              >
              {#if r.alias}
                <span
                  data-slot="search-alias"
                  class="block text-xs text-muted-foreground"
                  >Also called {@render marked(r.alias)}</span
                >
              {/if}
              <span
                data-slot="search-summary"
                class="mt-0.5 line-clamp-2 block text-sm text-muted-foreground"
                >{@render marked(r.summary)}</span
              >
            </li>
          {/each}
        </ul>
      {/each}
    </div>
    <ul
      id="site-search-keys"
      class="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground"
    >
      {#each legend as k (k.spoken)}
        <li data-slot="search-key" class="inline-flex items-center gap-1.5">
          <span aria-hidden="true" class="inline-flex gap-1"
            >{#each k.keys as key (key)}<Kbd>{key}</Kbd>{/each}</span
          ><span class="sr-only">{k.spoken}: </span>{k.does}
        </li>
      {/each}
    </ul>
  </Dialog.Content>
</Dialog.Root>
