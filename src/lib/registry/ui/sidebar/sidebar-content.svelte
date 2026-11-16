<script lang="ts" module>
  // What takes a Tab stop: a link, an enabled control, an editable region,
  // or tabindex 0 or more, unless a negative tabindex removes it.
  const TABBABLE = [
    "a[href]",
    "button:not([disabled])",
    'input:not([disabled]):not([type="hidden"])',
    "select:not([disabled])",
    "textarea:not([disabled])",
    "summary",
    '[contenteditable]:not([contenteditable="false"])',
    "[tabindex]",
  ]
    .map((s) => `${s}:not([tabindex^="-"])`)
    .join(", ");
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();

  // Whether the box holds a stop of its own; null until mounted.
  let holdsStop = $state<boolean | null>(null);

  $effect(() => {
    const box = ref;
    if (!box) return;
    const read = () => {
      holdsStop = box.querySelector(TABBABLE) !== null;
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(box, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "href",
        "disabled",
        "type",
        "tabindex",
        "contenteditable",
      ],
    });
    return () => observer.disconnect();
  });
</script>

<!--
  The scroll box between header and footer, with the token scrollbar. While
  it holds a row or any other stop, it is no stop of its own (tabindex -1):
  its rows scroll it into view, and the nav names it. Firefox would
  otherwise make an overflowing box a stop before its first row. While it
  holds only text, it is a stop (tabindex 0), so the keyboard can scroll it.
  An app's own tabindex wins. It scrolls as icons too, so no row is out of
  the pointer's reach.
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  bind:this={ref}
  data-slot="sidebar-content"
  data-sidebar="content"
  tabindex={holdsStop === null ? undefined : holdsStop ? -1 : 0}
  class={cn(
    "flex min-h-0 flex-1 flex-col gap-2 overflow-auto scrollbar",
    className,
  )}
  {...restProps}
>
  {@render children?.()}
</div>
