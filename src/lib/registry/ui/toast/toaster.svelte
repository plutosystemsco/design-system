<script lang="ts" module>
  import type { ToasterStrings } from "./toast-words.js";

  export type ToasterProps = {
    /**
     * The `KeyboardEvent.key` that moves focus to the list and back. Pressed
     * without Ctrl, Alt or Meta.
     */
    hotkey?: string;
    /** How many show at once from 640 px wide; below that, one. An integer, 1 or more. */
    max?: number;
    /**
     * `"off"`: nothing times out. Bind it to a setting the person can reach
     * before the first toast, such as "Keep notifications until I dismiss
     * them". Without that setting, every timed toast must repeat something
     * the page shows (WCAG 2.2.1).
     */
    timers?: "on" | "off";
    /** Every word the toaster says or shows, for translation. */
    strings?: Partial<ToasterStrings>;
    /** Classes for the region. */
    class?: string;
  };
</script>

<script lang="ts">
  import { onMount, tick, untrack } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";
  import Toast from "./toast.svelte";
  import {
    findTrap,
    type Snapshot,
    type ToastQueue,
    type ToastView,
  } from "./toast-queue.js";
  import { DEFAULT_STRINGS } from "./toast-words.js";
  import { toastQueue } from "./toast.js";

  let {
    hotkey = "F8",
    max = 3,
    timers = "on",
    strings = {},
    class: className,
  }: ToasterProps = $props();

  const all = $derived<ToasterStrings>({ ...DEFAULT_STRINGS, ...strings });
  // From 640 px wide, `max` show; below it, one.
  const wide = new MediaQuery("min-width: 40rem", true);

  type Drawn = ToastView & { closing?: boolean };

  let queue: ToastQueue | undefined;
  /** The queue is ours, and the props may reach it. */
  let mounted = $state(false);
  let snapshot = $state<Snapshot>({ showing: [], waiting: 0, aside: 0 });
  /** What the list draws: the showing toasts, and those still fading out. */
  let drawn = $state<Drawn[]>([]);
  let polite = $state("");
  let assertive = $state("");
  /** False when another toaster already holds the document's queue. */
  let owned = $state(true);
  /** The count line is hidden, as a toast steps aside, while it covers the focus. */
  let moreAside = $state(false);

  let region = $state<HTMLElement | null>(null);
  let list = $state<HTMLElement | null>(null);
  let status = $state<HTMLElement | null>(null);
  let moreLine = $state<HTMLElement | null>(null);

  /** Where focus was before it entered the region, to return to. */
  let remembered: HTMLElement | null = null;
  /** How focus entered the region: by the hotkey, or by Tab. */
  let entered: "hotkey" | "tab" | null = null;
  /** The toast that holds focus, for the queue's hold. */
  let focusedId: string | null = null;

  const more = $derived(
    [
      snapshot.waiting ? all.more(snapshot.waiting) : "",
      snapshot.aside ? all.hidden(snapshot.aside) : "",
    ]
      .filter(Boolean)
      .join(", "),
  );

  const inRegion = (el: Element | null) =>
    !!el && !!region && region.contains(el);

  function modalOpen() {
    try {
      return !!document.querySelector('[aria-modal="true"], dialog:modal');
    } catch {
      return !!document.querySelector('[aria-modal="true"]');
    }
  }

  function checkModal() {
    if (!queue) return;
    if (modalOpen()) queue.pause("modal");
    else queue.resume("modal");
  }

  /** The focus cause holds while focus is in the region; the toast it is in holds its place. */
  function syncFocus() {
    if (!queue) return;
    const active = document.activeElement;
    if (inRegion(active)) queue.pause("focus");
    else queue.resume("focus");
    const li = inRegion(active)
      ? active!.closest<HTMLElement>("[data-toast-id]")
      : null;
    const id = li?.dataset.toastId ?? null;
    if (id === focusedId) return;
    if (focusedId) queue.hold(focusedId, false);
    focusedId = id;
    if (id) queue.hold(id, true);
  }

  /** Back where focus was: the remembered element, else `#main`, else nowhere. */
  function back() {
    const to = remembered;
    remembered = null;
    entered = null;
    focusTo(to?.isConnected ? to : null);
  }

  function focusTo(el: HTMLElement | null) {
    const target = el ?? document.getElementById("main");
    if (target) target.focus({ preventScroll: !el });
    if (!target || document.activeElement !== target)
      (document.activeElement as HTMLElement | null)?.blur?.();
    syncFocus();
  }

  /** A toast that holds focus leaves: where its focus goes. */
  function focusAfter(
    leaving: string,
    slot: string,
    before: ToastView[],
    after: ToastView[],
  ): () => HTMLElement | null {
    const index = before.findIndex((t) => t.id === leaving);
    const to = remembered;
    return () => {
      const control = (t: ToastView | undefined) => {
        if (!t || !region) return null;
        const li = region.querySelector(
          `[data-toast-id="${CSS.escape(t.id)}"]`,
        );
        return (li?.querySelector<HTMLElement>(`[data-slot="${slot}"]`) ??
          li?.querySelector<HTMLElement>(
            '[data-slot="toast-close"]',
          )) as HTMLElement | null;
      };
      return (
        control(after[index]) ??
        control(after[index - 1]) ??
        (after.length === 0 && to?.isConnected ? to : null)
      );
    };
  }

  // A toast may be raised inside an app's own effect: drawing it must not
  // make that effect depend on the list.
  function onview(next: Snapshot) {
    untrack(() => draw(next));
  }

  function draw(next: Snapshot) {
    // Focus moves on when the toast that holds it leaves the list.
    let target: (() => HTMLElement | null) | null = null;
    const active = document.activeElement as HTMLElement | null;
    const li = inRegion(active)
      ? active!.closest<HTMLElement>("[data-toast-id]")
      : null;
    const id = li?.dataset.toastId;
    if (id && !next.showing.some((t) => t.id === id)) {
      const slot =
        active!.closest("[data-slot]")?.getAttribute("data-slot") ??
        "toast-close";
      target = focusAfter(id, slot, snapshot.showing, next.showing);
    }

    // The list keeps a leaving toast, in place, until its exit ends.
    const ids = new Set(next.showing.map((t) => t.id));
    const merged: Drawn[] = [...next.showing];
    drawn.forEach((t, i) => {
      if (ids.has(t.id)) return;
      merged.splice(Math.min(i, merged.length), 0, { ...t, closing: true });
    });
    const fresh = merged.filter(
      (t) => t.closing && !drawn.find((d) => d.id === t.id && d.closing),
    );
    snapshot = next;
    drawn = merged;

    void tick().then(() => {
      for (const t of fresh) exitFallback(t.id);
      if (target) focusTo(target());
      if (!drawn.length) {
        queue?.resume("hover");
        moreAside = false;
      }
      syncFocus();
      wake();
    });
  }

  /** Removes a leaving toast; also when `animationend` never fires, as in a background tab. */
  function exitFallback(id: string) {
    const el = region?.querySelector<HTMLElement>(
      `[data-toast-id="${CSS.escape(id)}"]`,
    );
    const ms = el
      ? Math.max(
          ...getComputedStyle(el)
            .animationDuration.split(",")
            .map((d) => parseFloat(d) * (d.trim().endsWith("ms") ? 1 : 1000))
            .filter((n) => Number.isFinite(n)),
          0,
        )
      : 0;
    setTimeout(() => remove(id), ms + 16);
  }

  function remove(id: string) {
    if (drawn.some((t) => t.id === id && t.closing))
      drawn = drawn.filter((t) => !(t.id === id && t.closing));
  }

  function ended(event: AnimationEvent, t: Drawn) {
    if (event.target === event.currentTarget && t.closing) remove(t.id);
  }

  // A toast never covers the keyboard focus: it steps aside.

  let raf = 0;
  function wake() {
    if (!raf && typeof requestAnimationFrame === "function")
      raf = requestAnimationFrame(loop);
  }
  function loop() {
    raf = 0;
    if (checkAside()) raf = requestAnimationFrame(loop);
  }
  const overlaps = (a: DOMRect, b: DOMRect) =>
    a.left < b.right &&
    b.left < a.right &&
    a.top < b.bottom &&
    b.top < a.bottom;

  /** Steps aside each toast whose box covers the keyboard focus. True while it must keep checking. */
  function checkAside(): boolean {
    if (!queue || !region) return false;
    const active = document.activeElement as HTMLElement | null;
    let visible = false;
    try {
      visible = !!active && active.matches(":focus-visible");
    } catch {
      visible = false;
    }
    const outside =
      !!active && active !== document.body && !inRegion(active) && visible;
    const items = region.querySelectorAll<HTMLElement>(
      "li[data-toast-id]:not([data-state=closed])",
    );
    if (!outside) {
      for (const li of items) queue.aside(li.dataset.toastId!, false);
      moreAside = false;
      return false;
    }
    const box = active!.getBoundingClientRect();
    for (const li of items)
      queue.aside(
        li.dataset.toastId!,
        overlaps(li.getBoundingClientRect(), box),
      );
    moreAside = !!moreLine && overlaps(moreLine.getBoundingClientRect(), box);
    return snapshot.showing.length > 0;
  }

  // Keys.

  function onwindowkey(event: KeyboardEvent) {
    if (
      event.key !== hotkey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      !queue ||
      !list ||
      !snapshot.showing.length ||
      modalOpen()
    )
      return;
    event.preventDefault();
    const active = document.activeElement as HTMLElement | null;
    if (inRegion(active)) {
      back();
      return;
    }
    remembered = active && active !== document.body ? active : null;
    entered = "hotkey";
    list.focus();
    syncFocus();
    wake();
  }

  function onregionkey(event: KeyboardEvent) {
    if (event.defaultPrevented || !region) return;
    const target = event.target as HTMLElement;
    if (event.key === "Escape") {
      if (target === list) {
        event.preventDefault();
        back();
        return;
      }
      const li = target.closest<HTMLElement>("[data-toast-id]");
      if (li && target.closest("button")) {
        event.preventDefault();
        queue?.dismiss(li.dataset.toastId!, "dismiss");
      }
      return;
    }
    if (event.key === "Tab" && entered === "hotkey") {
      const stops = [
        ...region.querySelectorAll<HTMLElement>(
          "li[data-toast-id]:not([data-aside]):not([inert]) button",
        ),
      ];
      if (!stops.length) return;
      const leave = event.shiftKey
        ? target === stops[0] || target === list
        : target === stops[stops.length - 1];
      if (leave) {
        event.preventDefault();
        back();
      }
    }
  }

  function onfocusin(event: FocusEvent) {
    const from = event.relatedTarget as HTMLElement | null;
    if (!inRegion(from)) {
      if (entered !== "hotkey") {
        entered = "tab";
        remembered = from && from !== document.body ? from : null;
      }
    }
    syncFocus();
  }

  function onfocusout(event: FocusEvent) {
    const to = event.relatedTarget as HTMLElement | null;
    if (!inRegion(to)) {
      remembered = null;
      entered = null;
    }
    // Focus has not moved yet: read where it lands once it has.
    queueMicrotask(syncFocus);
  }

  function describe(el: Element) {
    return (
      el.tagName.toLowerCase() +
      (el.id ? `#${el.id}` : "") +
      [...el.classList]
        .slice(0, 3)
        .map((c) => `.${c}`)
        .join("")
    );
  }

  onMount(() => {
    const q = toastQueue();
    if (!q) return;
    q.configure({ strings: all, hotkey, check: checkModal });
    const unsubscribe = q.subscribe(onview, (s) => {
      if (s.channel === "polite") polite = s.text;
      else assertive = s.text;
    });
    if (!unsubscribe) {
      owned = false;
      if (import.meta.env?.DEV)
        console.warn(
          "toast: a second <Toaster> is mounted; it renders nothing. Mount one, in the root layout.",
        );
      return;
    }
    queue = q;
    mounted = true;

    // The page's language counts the words that time a toast.
    const html = document.documentElement;
    q.setLang(html.lang);
    const langs = new MutationObserver(() => q.setLang(html.lang));
    langs.observe(html, { attributes: true, attributeFilter: ["lang"] });

    // A modal holds new toasts: bits-ui portals land in body's children.
    // Two observers: a second `observe` of one node by one observer would
    // replace the first's options.
    let modalFrame = 0;
    const onModal = () => {
      checkModal();
      cancelAnimationFrame(modalFrame);
      modalFrame = requestAnimationFrame(checkModal);
    };
    const portals = new MutationObserver(onModal);
    portals.observe(document.body, { childList: true });
    const modals = new MutationObserver(onModal);
    modals.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-modal", "open"],
    });
    checkModal();

    if (document.visibilityState === "hidden") q.pause("hidden");

    // In development, name an ancestor that would trap the fixed layer.
    if (import.meta.env?.DEV) {
      const chain: { el: Element; computed: CSSStyleDeclaration }[] = [];
      for (let el = status?.parentElement; el; el = el.parentElement)
        chain.push({ el, computed: getComputedStyle(el) });
      const trap = findTrap(chain.map((c) => c.computed));
      if (trap)
        console.warn(
          `toast: <Toaster> sits inside ${describe(chain.find((c) => c.computed === trap)!.el)}, which makes position: fixed relative to itself. Mount it outside any element with a transform, a filter, perspective or contain.`,
        );
    }

    return () => {
      langs.disconnect();
      portals.disconnect();
      modals.disconnect();
      cancelAnimationFrame(modalFrame);
      cancelAnimationFrame(raf);
      raf = 0;
      const hadFocus = inRegion(document.activeElement);
      const to = remembered;
      q.dismiss(undefined, "unmount");
      if (hadFocus) focusTo(to?.isConnected ? to : null);
      unsubscribe();
      queue = undefined;
      mounted = false;
    };
  });

  // The props reach the queue. Its calls are untracked: a snapshot they emit
  // writes the list's state, which these effects must not depend on.
  $effect(() => {
    if (!mounted) return;
    const c = { strings: all, hotkey };
    untrack(() => queue?.configure(c));
  });
  $effect(() => {
    if (!mounted) return;
    const on = timers !== "off";
    untrack(() => queue?.setTimers(on));
  });
  $effect(() => {
    if (!mounted) return;
    const n = wide.current ? max : 1;
    untrack(() => queue?.setMax(n));
  });
</script>

<svelte:window
  onkeydown={onwindowkey}
  onblur={() => queue?.pause("blur")}
  onfocus={() => queue?.resume("blur")}
/>
<svelte:document
  onvisibilitychange={() =>
    document.visibilityState === "hidden"
      ? queue?.pause("hidden")
      : queue?.resume("hidden")}
  onfocusin={wake}
  onkeydown={wake}
/>

<!--
  The toaster: two announcers, present from the first render, and, while it
  holds a toast, the region. The visible stack is never live; the
  announcers speak for it, on one schedule. No toast is a tab stop; F8
  reaches its buttons. Mount one, in the root layout.
-->
{#if owned}
  <Status bind:ref={status} data-slot="toaster-status" text={polite} />
  <div
    data-slot="toaster-alert"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    class="sr-only"
  >
    {assertive}
  </div>
  {#if drawn.length}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions: its keys and pointer pauses are delegated from the toasts inside it. -->
    <section
      bind:this={region}
      data-slot="toaster"
      aria-label={all.region}
      aria-keyshortcuts={hotkey}
      class={cn(
        "pointer-events-none fixed inset-x-4 top-[calc(env(safe-area-inset-top)+var(--spacing)*4)] z-50 grid gap-2 sm:start-auto sm:end-4 sm:w-sm [html:has([data-sticky-bar])_&]:top-[calc(var(--size-bar)+var(--spacing)*4)]",
        className,
      )}
      onpointerenter={() => queue?.pause("hover")}
      onpointerleave={() => queue?.resume("hover")}
      onkeydown={onregionkey}
      {onfocusin}
      {onfocusout}
    >
      <ol
        bind:this={list}
        data-slot="toaster-list"
        tabindex="-1"
        aria-label={all.list}
        class="grid gap-2"
      >
        {#each drawn as t (t.id)}
          <Toast
            kind={t.kind}
            title={t.title}
            description={t.description}
            action={t.action
              ? {
                  label: t.action.label,
                  onclick: () => {
                    t.action?.onclick();
                    queue?.dismiss(t.id, "action");
                  },
                }
              : undefined}
            strings={all}
            ondismiss={() => queue?.dismiss(t.id, "dismiss")}
            data-toast-id={t.id}
            data-aside={t.aside && !t.closing ? "" : undefined}
            data-state={t.closing ? "closed" : "open"}
            inert={t.closing}
            class={cn(
              "pointer-events-auto animate-enter data-[state=closed]:animate-exit",
              t.aside && !t.closing && "invisible",
            )}
            onpointerenter={() => queue?.hold(t.id, true)}
            onpointerleave={() => queue?.hold(t.id, false)}
            onanimationend={(e: AnimationEvent) => ended(e, t)}
          />
        {/each}
      </ol>
      {#if more}
        <p
          bind:this={moreLine}
          data-slot="toaster-more"
          class={cn(
            "pointer-events-auto justify-self-end rounded bg-popover px-2 py-1 text-sm text-muted-foreground shadow-elevation",
            moreAside && "invisible",
          )}
        >
          {more}
        </p>
      {/if}
    </section>
  {/if}
{/if}
