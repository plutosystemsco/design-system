<script lang="ts" module>
  /** One proof: a number, what wraps it, and what it counts. */
  export type ProofBandItem = {
    /** The number, counted up from zero when the band scrolls into view. */
    value: number;
    /** Text before the number, such as a currency sign. */
    prefix?: string;
    /** Text after the number, such as a percent sign or a unit. */
    suffix?: string;
    /** What the number counts. */
    label: string;
  };
</script>

<script lang="ts">
  import { onMount, untrack } from "svelte";
  import { readDuration, tween } from "#lib/registry/lib/read-token";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  type Props = WithElementRef<Omit<HTMLAttributes<HTMLElement>, "title">> & {
    /** Two to four. */
    items: ProofBandItem[];
    /** The heading's level, so the band fits the page's outline. */
    headingLevel?: 2 | 3;
  } & (
      | {
          /** The band's heading, which names it. */
          title: string;
          /**
           * The band's name. With a `title`, the title names it, and this is
           * not needed.
           */
          label?: string;
        }
      | {
          title?: undefined;
          /** The band's name when it has no title. */
          label: string;
        }
    );

  let {
    ref = $bindable(null),
    items,
    title,
    label,
    headingLevel = 2,
    class: className,
    ...restProps
  }: Props = $props();

  const uid = $props.id();
  // While `live`, the digits show the count's frames; otherwise they show
  // each item's value, so the prerendered page and any new items read their
  // final values.
  let live = $state(false);
  let shown = $state<number[]>([]);
  // The page's language, once in the browser; the server formats in its own.
  let locale = $state<string | undefined>(undefined);
  let observer: IntersectionObserver | undefined;
  let cancels: (() => void)[] = [];

  /** A frame rounds to a whole number; the final value keeps its own digits. */
  function format(value: number, final: number): string {
    return new Intl.NumberFormat(
      locale,
      value === final ? undefined : { maximumFractionDigits: 0 },
    ).format(value);
  }

  /** Ends any wait or count, and shows the final values. */
  function settle() {
    observer?.disconnect();
    observer = undefined;
    cancels.forEach((cancel) => cancel());
    cancels = [];
    live = false;
  }

  const COLUMNS: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  onMount(() => {
    locale = document.documentElement.lang || undefined;
    // A printed page shows the final values, counted or not.
    window.addEventListener("beforeprint", settle);
    const band = ref;
    const cleanup = () => {
      window.removeEventListener("beforeprint", settle);
      settle();
    };
    if (!band) return cleanup;
    // Already in view at hydration (a tall window, a link to it): nothing
    // moves while someone may be reading it.
    const box = band.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return cleanup;
    // A reader who asked for less motion never sees the zeros: under reduced
    // motion the fill reads 0 ms, and there is nothing to count.
    if (readDuration("motion-fill", band) === 0) return cleanup;
    // Out of sight: the digits wait at 0 and count once, on first sight,
    // over the fill duration.
    shown = items.map(() => 0);
    live = true;
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer?.disconnect();
      observer = undefined;
      cancels = items.map((item, index) =>
        tween({
          from: 0,
          to: item.value,
          duration: "motion-fill",
          ease: "ease-standard",
          element: band,
          onFrame: (value) => (shown[index] = value),
        }),
      );
    });
    observer.observe(band);
    return cleanup;
  });

  // New items after mount: the count belongs to the old ones, so it stops
  // and the digits follow the new values.
  let first = true;
  $effect(() => {
    for (const item of items) void item.value;
    if (first) {
      first = false;
      return;
    }
    untrack(settle);
  });
</script>

<!--
  A section named by its heading, or by `label`. Each number is the proof
  step, its label below it, muted. The moving digits are hidden from
  assistive technology; a visually hidden copy holds the final value from
  the first render, so a screen reader hears it once. Two columns on a
  phone, one per number from md. No ground of its own: a parent places it.
-->
<section
  bind:this={ref}
  data-slot="proof-band"
  aria-labelledby={title ? `${uid}-title` : undefined}
  aria-label={title ? undefined : label}
  class={cn("grid gap-12", className)}
  {...restProps}
>
  {#if title}
    <svelte:element
      this={headingLevel === 2 ? "h2" : "h3"}
      id="{uid}-title"
      class="type-section text-balance"
    >
      {title}
    </svelte:element>
  {/if}
  <ul class={cn("grid grid-cols-2 gap-x-8 gap-y-12", COLUMNS[items.length])}>
    {#each items as item, index (index)}
      <li class="flex min-w-0 flex-col gap-2">
        <span data-slot="proof-band-value" aria-hidden="true" class="type-proof"
          >{item.prefix ?? ""}{format(
            live ? (shown[index] ?? item.value) : item.value,
            item.value,
          )}{item.suffix ?? ""}</span
        >
        <span data-slot="proof-band-text" class="sr-only"
          >{item.prefix ?? ""}{format(item.value, item.value)}{item.suffix ??
            ""}</span
        >
        <span class="text-muted-foreground">{item.label}</span>
      </li>
    {/each}
  </ul>
</section>
