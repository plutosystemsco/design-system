<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLAttributes } from "svelte/elements";
  import type { FourDotTone } from "./four-dot.svelte";

  export type LockupProps = HTMLAttributes<HTMLElement> &
    Pick<HTMLAnchorAttributes, "href" | "target" | "rel"> & {
      /** The link's accessible name, when `href` makes the lockup a link. It contains the visible word. */
      label?: string;
      tone?: FourDotTone;
      /** Passed to the mark: the page's one entrance. */
      entrance?: boolean;
    };
</script>

<script lang="ts">
  import { cn } from "#lib/utils";
  import FourDot from "./four-dot.svelte";

  let {
    href,
    target,
    rel,
    label = "Pluto Systems",
    tone = "brand",
    entrance = false,
    class: className,
    ...rest
  }: LockupProps = $props();

  const classes = $derived(
    cn(
      "inline-flex items-baseline gap-(--mark-lockup-gap) font-heading font-bold tracking-mark leading-none",
      className,
    ),
  );
</script>

{#snippet content()}
  pluto<FourDot {tone} {entrance} class="-translate-y-(--mark-lift)" />
{/snippet}

{#if href}
  <a
    data-slot="lockup"
    {href}
    {target}
    {rel}
    aria-label={label}
    class={classes}
    {...rest}
  >
    {@render content()}
  </a>
{:else}
  <span data-slot="lockup" class={classes} {...rest}>
    {@render content()}
  </span>
{/if}
