<script lang="ts" module>
  import type { HTMLAttributes } from "svelte/elements";

  export type FourDotTone = "brand" | "mono";

  export type FourDotProps = HTMLAttributes<HTMLSpanElement> & {
    /** `brand` paints the four mark colours; `mono` paints every dot `currentColor`. */
    tone?: FourDotTone;
    /** Names a mark that stands alone. Without it, the mark is decoration. */
    label?: string;
    /**
     * The page's one hello: the four dots dock over the entrance budget,
     * once per full document load. Set it on one mark per page, the shell's
     * header; under reduced motion the composed mark shows before any frame.
     */
    entrance?: boolean;
  };
</script>

<script lang="ts">
  import { cn } from "#lib/utils";

  let {
    tone = "brand",
    label,
    entrance = false,
    class: className,
    ...rest
  }: FourDotProps = $props();

  // v2's order, never changed: top-left, top-right, bottom-left, bottom-right.
  const brand = ["bg-mark-1", "bg-mark-2", "bg-mark-3", "bg-mark-4"];
</script>

<span
  data-slot="four-dot"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
  class={cn(
    "inline-grid grid-cols-2 gap-(--mark-gap)",
    entrance && "mark-entrance",
    className,
  )}
  {...rest}
>
  {#each brand as colour, i (i)}
    <span
      data-slot="four-dot-dot"
      class={cn(
        "block size-(--mark-dot) rounded-full",
        tone === "mono" ? "bg-current" : colour,
      )}
    ></span>
  {/each}
</span>
