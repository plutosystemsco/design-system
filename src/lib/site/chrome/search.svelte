<script lang="ts">
  import { onMount, type Component } from "svelte";
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import { cn } from "#lib/utils";

  let {
    class: className,
    shortcut = false,
  }: {
    class?: string;
    /** This button answers Control-K and Command-K: the bar's does. */
    shortcut?: boolean;
  } = $props();

  // Search needs scripts, so the button is rendered by the client, into a
  // slot of fixed width: nothing shifts when it arrives.
  let mounted = $state(false);
  let keys = $state("Ctrl K");
  let button: HTMLButtonElement | undefined = $state();
  let open = $state(false);
  // The palette's code loads the first time it opens.
  let Palette: Component<{
    open?: boolean;
    onclosed?: () => void;
    seed?: string;
    onseed?: () => void;
  }> | null = $state(null);

  // Keys typed after the shortcut, before the palette's input has focus,
  // are kept and handed to it, so none is lost while its code loads.
  let typed = $state("");
  let capturing = false;
  function capture(e: KeyboardEvent) {
    if (!capturing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (document.activeElement?.getAttribute("role") === "combobox") {
      capturing = false;
      return;
    }
    if (e.key.length === 1) {
      typed += e.key;
      e.preventDefault();
    } else if (e.key === "Backspace") {
      typed = typed.slice(0, -1);
      e.preventDefault();
    }
  }

  async function show() {
    capturing = true;
    if (!Palette) Palette = (await import("./search-palette.svelte")).default;
    open = true;
  }

  onMount(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) keys = "⌘K";
    mounted = true;
    window.addEventListener("keydown", capture, true);
    if (!shortcut)
      return () => window.removeEventListener("keydown", capture, true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        void show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keydown", capture, true);
    };
  });
</script>

<span class={cn("inline-flex h-10 w-10 md:w-32", className)}>
  {#if mounted}
    <button
      bind:this={button}
      type="button"
      data-slot="site-search"
      aria-keyshortcuts={shortcut ? "Control+K Meta+K" : undefined}
      aria-haspopup="dialog"
      onclick={show}
      class="inline-flex h-10 w-full items-center justify-center gap-3 rounded border border-border bg-transparent px-2 text-sm text-foreground hover:border-foreground md:justify-start md:px-3"
    >
      <MagnifyingGlass aria-hidden="true" class="size-4 shrink-0" />
      <span class="sr-only md:not-sr-only">Search</span>
      <kbd
        aria-hidden="true"
        data-keys={keys}
        class="site-keys ms-auto hidden rounded border border-border px-1.5 font-sans text-xs md:inline"
      ></kbd>
    </button>
  {/if}
</span>

{#if Palette}
  <Palette
    bind:open
    onclosed={() => {
      capturing = false;
      typed = "";
      button?.focus();
    }}
    seed={typed}
    onseed={() => {
      typed = "";
      capturing = false;
    }}
  />
{/if}
