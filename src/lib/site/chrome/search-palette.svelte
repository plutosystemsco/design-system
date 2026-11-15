<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Dialog from "#lib/registry/ui/dialog";
  import { DOORS } from "../doors.ts";
  import { search } from "../search.ts";
  import type { SearchEntry } from "../search/types.ts";

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
  const results = $derived(index ? search(index, query).slice(0, 20) : []);
  $effect(() => {
    void query;
    active = 0;
  });

  const status = $derived(
    failed
      ? "Search could not load. Check your connection and try again."
      : !query.trim()
        ? ""
        : results.length
          ? `${results.length} result${results.length === 1 ? "" : "s"}`
          : `No results for "${query.trim()}". Try a component's name, or browse the four sections.`,
  );

  const door = (id: SearchEntry["door"]) => DOORS.find((d) => d.id === id);

  function choose(entry: SearchEntry | undefined) {
    if (!entry) return;
    open = false;
    goto(entry.path);
  }

  function onkeydown(e: KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active = Math.min(active + 1, results.length - 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active = Math.max(active - 1, 0);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[active]);
    }
  }
</script>

<!--
  The palette: a dialog holding an input and its results, in the combobox
  pattern. ArrowUp and ArrowDown move, Enter opens, Escape closes.
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
      aria-expanded={results.length > 0}
      aria-controls="site-search-results"
      aria-activedescendant={results.length
        ? `site-search-${active}`
        : undefined}
      aria-autocomplete="list"
      autocomplete="off"
      placeholder="Search components, pages and guides"
      class="h-12 w-full rounded border border-input bg-card px-3 text-base text-foreground placeholder:text-muted-foreground"
    />
    <p role="status" aria-live="polite" class="text-sm text-muted-foreground">
      {status}
    </p>
    <ul
      id="site-search-results"
      role="listbox"
      aria-label="Results"
      class="grid max-h-[60svh] gap-1 overflow-y-auto"
    >
      {#each results as r, i (r.path)}
        {@const d = door(r.door)}
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
          <span class="flex items-baseline justify-between gap-3">
            <span class="font-medium">{r.title}</span>
            {#if d}
              <span
                class="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground"
                ><span class="site-dot" data-door={d.n} aria-hidden="true"
                ></span>{d.name}</span
              >
            {/if}
          </span>
          <span class="mt-0.5 line-clamp-2 block text-sm text-muted-foreground"
            >{r.summary}</span
          >
        </li>
      {/each}
    </ul>
  </Dialog.Content>
</Dialog.Root>
