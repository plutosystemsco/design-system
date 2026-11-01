<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { viewPath, type BlockView } from "./blocks";

  /**
   * The viewer (003 decision 17): a block's views in a same-origin iframe, at
   * 360, 768 or 1280 px, following the site's theme, with "Open alone".
   */
  let {
    block,
    title,
    views,
  }: { block: string; title: string; views: BlockView[] } = $props();

  // Tailwind multipliers for 360, 768 and 1280 px; no arbitrary values.
  const WIDTHS = [
    { px: 360, cls: "w-90" },
    { px: 768, cls: "w-192" },
    { px: 1280, cls: "w-320" },
  ] as const;

  // svelte-ignore state_referenced_locally
  let current = $state(views[0]?.path ?? "");
  let width = $state<360 | 768 | 1280>(360);
  let frame = $state<HTMLIFrameElement>();

  const src = $derived(viewPath(block, current));
  const widthClass = $derived(
    WIDTHS.find((w) => w.px === width)?.cls ?? "w-90",
  );

  /** Copies the parent's `dark` class onto the frame's <html>. */
  function copyTheme() {
    const doc = frame?.contentDocument;
    if (!doc?.documentElement) return;
    doc.documentElement.classList.toggle(
      "dark",
      document.documentElement.classList.contains("dark"),
    );
  }

  onMount(() => {
    // The prerendered frame may have loaded before this handler existed.
    if (frame?.contentDocument?.readyState === "complete") copyTheme();
    const observer = new MutationObserver(copyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  });

  // Pressed is inverted, as the tooltip chip is; hover stays the darker
  // border of every secondary button, so the two cannot be confused.
  const uid = $props.id();
  // A visible label before each group, as the design book's mono furniture: lowercase.
  const eyebrow =
    "font-mono text-xs font-medium tracking-eyebrow text-muted-foreground lowercase";
  const pressed =
    "aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background";
</script>

<div data-testid="viewer">
  <div
    class="flex flex-wrap items-center gap-x-6 gap-y-3"
    data-testid="viewer-toolbar"
  >
    {#if views.length > 1}
      <div class="flex flex-wrap items-center gap-2">
        <span id="{uid}-state" class={eyebrow}>state</span>
        <div
          role="group"
          aria-labelledby="{uid}-state"
          class="flex flex-wrap gap-2"
        >
          {#each views as view (view.path)}
            <Button
              variant="secondary"
              size="sm"
              class={pressed}
              aria-pressed={current === view.path}
              onclick={() => (current = view.path)}>{view.label}</Button
            >
          {/each}
        </div>
      </div>
    {/if}
    <div class="flex flex-wrap items-center gap-2">
      <span id="{uid}-width" class={eyebrow}>width</span>
      <div
        role="group"
        aria-labelledby="{uid}-width"
        class="flex flex-wrap gap-2"
      >
        {#each WIDTHS as w (w.px)}
          <Button
            variant="secondary"
            size="sm"
            class={pressed}
            aria-pressed={width === w.px}
            onclick={() => (width = w.px)}>{w.px} px</Button
          >
        {/each}
      </div>
    </div>
    <Button variant="link" size="sm" href={src} data-testid="open-alone"
      >Open alone</Button
    >
  </div>

  <!-- A scroll region is a stop, so a keyboard can scroll the 1280 px frame (001 decision 24's reason). -->
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    role="region"
    aria-label="Preview frame"
    tabindex="0"
    class="mt-4 w-fit max-w-full overflow-x-auto rounded border border-border"
  >
    <iframe
      bind:this={frame}
      class="block h-180 border-0 {widthClass}"
      title="{title} preview"
      {src}
      onload={copyTheme}
    ></iframe>
  </div>
</div>
