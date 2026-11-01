<script lang="ts">
  import ArrowDown from "phosphor-svelte/lib/ArrowDown";
  import { Button } from "#lib/registry/ui/button";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";
  import { FollowBottom } from "./follow-bottom.svelte.js";

  let {
    ref = $bindable(null),
    class: className,
    label = "Messages",
    logLabel = "Conversation",
    busy = false,
    children,
    onscroll,
    onwheel,
    ontouchmove,
    onkeydown,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    /** The scroll box's name: what a keyboard user focuses and scrolls. */
    label?: string;
    /** The log's name, which a log requires. */
    logLabel?: string;
    /** Set while a reply streams, for readers that honour aria-busy. */
    busy?: boolean;
  } = $props();

  const follow = new FollowBottom();
  let log: HTMLElement | null = $state(null);

  $effect(() => {
    if (!ref || !log) return;
    return follow.attach(ref, log);
  });

  /** Scrolls to the end, as the button does. */
  export function scrollToEnd(): void {
    follow.scrollToEnd();
  }

  type Handler<E extends Event> =
    | ((event: E & { currentTarget: EventTarget & HTMLDivElement }) => void)
    | null
    | undefined;
  const call = <E extends Event>(handler: unknown, event: E) =>
    (handler as Handler<E>)?.(
      event as E & { currentTarget: EventTarget & HTMLDivElement },
    );
</script>

<!--
  A named region with a stop, holding a named log. The log announces what is
  added whole (a turn, a marker, an alert) and never a streamed reply's words
  (aria-relevant="additions"). The box follows new content until the reader
  scrolls away; the button, hidden while following or at the end, then pins
  over the box's bottom edge to bring them back. It sits outside the scroll
  box, in a wrapper over it: a sticky button inside would scroll the box to
  its own end the moment Tab reached it, and hide under the reader.
  scroll-padding-bottom keeps a focused element above a sticky composer. No
  gradient at the edge.
-->
<div data-slot="message-log" class="relative">
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    bind:this={ref}
    data-slot="message-log-region"
    role="region"
    aria-label={label}
    tabindex="0"
    class={cn(
      "flex flex-col overflow-y-auto overscroll-contain scroll-pb-24 scrollbar",
      className,
    )}
    onscroll={(event) => {
      follow.onScroll();
      call(onscroll, event);
    }}
    onwheel={(event) => {
      follow.onWheel(event);
      call(onwheel, event);
    }}
    ontouchmove={(event) => {
      follow.release();
      call(ontouchmove, event);
    }}
    onkeydown={(event) => {
      follow.onKeydown(event);
      call(onkeydown, event);
    }}
    {...restProps}
  >
    <div
      bind:this={log}
      data-slot="message-log-content"
      role="log"
      aria-label={logLabel}
      aria-relevant="additions"
      aria-busy={busy ? "true" : undefined}
      class="flex flex-col gap-4"
    >
      {@render children?.()}
    </div>
  </div>
  <Button
    variant="secondary"
    size="icon-sm"
    data-slot="message-log-button"
    aria-label="Scroll to end"
    class={cn(
      "absolute end-4 bottom-4",
      (follow.following || follow.atEnd) && "hidden",
    )}
    onclick={() => {
      // Focus goes back to the box before the button hides under it.
      ref?.focus({ preventScroll: true });
      follow.scrollToEnd();
    }}
  >
    <ArrowDown aria-hidden="true" class="size-4" />
  </Button>
</div>
