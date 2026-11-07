<script lang="ts" module>
  export type WordmarkVariant = "E1" | "E2" | "E3" | "E4" | "E5" | "E6" | "E7";

  /**
   * Round two of E1, at the owner's word: the mark comes in closer, as in E3,
   * and the name stays lowercase. The mark keeps N1's proportion (gap ÷ dot
   * ≈ .27); only its size beside the word, its gap to the word and its top
   * move. `top` is the mark's top above the baseline. IBM Plex Sans Variable
   * 700 measures ascender .74 em, x-height .525 em (EXECUTED, 2026-11-06).
   */
  export const RISEN: Record<
    "E1" | "E5" | "E6" | "E7",
    { dot: number; gap: number; space: number; top: number }
  > = {
    E1: { dot: 0.3, gap: 0.08, space: 0.16, top: 1.06 },
    E5: { dot: 0.3, gap: 0.08, space: 0.1, top: 1.06 },
    E6: { dot: 0.26, gap: 0.07, space: 0.1, top: 0.9 },
    E7: { dot: 0.22, gap: 0.06, space: 0.1, top: 0.74 },
  };
</script>

<script lang="ts">
  import Mark from "./mark.svelte";

  // The wordmark options of question E, set in a candidate face.
  let {
    variant = "E1",
    font,
    colours,
    ink,
    class: className = "",
  }: {
    variant?: WordmarkVariant;
    font: string;
    colours: [string, string, string, string];
    ink: string;
    class?: string;
  } = $props();
</script>

<span
  class="wm wm-{variant} {className}"
  style="font-family:{font};color:{ink}"
  role="img"
  aria-label="Pluto"
>
  {#if variant in RISEN}
    {@const r = RISEN[variant as keyof typeof RISEN]}
    <span class="word">pluto</span><Mark
      {colours}
      dot={r.dot}
      gap={r.gap}
      class="rise"
      style="--space:{r.space}em;--lift:{r.top - r.dot}em"
    />
  {:else if variant === "E2"}
    <Mark {colours} dot={0.36} gap={0.09} class="lead" /><span class="word"
      >pluto</span
    >
  {:else if variant === "E3"}
    <span class="word">Pluto</span><Mark
      {colours}
      dot={0.22}
      gap={0.06}
      class="cap"
    />
  {:else}
    <Mark {colours} dot={0.5} gap={0.13} /><span class="stack"
      ><span>pluto</span><span>systems</span></span
    >
  {/if}
</span>

<style>
  .wm {
    display: inline-flex;
    line-height: 1;
    white-space: nowrap;
  }
  .word {
    letter-spacing: -0.04em;
  }
  .wm-E1,
  .wm-E5,
  .wm-E6,
  .wm-E7 {
    align-items: baseline;
    font-weight: 700;
  }
  .wm :global(.rise) {
    /*
     * A grid of empty dots takes its baseline from the bottom of its first
     * row, so lifting by (top − dot) puts the mark's top at `top`. E1's
     * values give the design book's .76 em lift.
     */
    margin-left: var(--space);
    transform: translateY(calc(-1 * var(--lift)));
  }
  /*
   * E2 and E3 sit on the baseline and lift by geometry, not by the line box,
   * so the mark lands the same in any face. A grid of empty dots takes its
   * baseline from the bottom of its first row. The face's x-height (.516 em)
   * and cap height (.698 em) are IBM Plex Sans's.
   */
  .wm-E2 {
    align-items: baseline;
    gap: 0.26em;
    font-weight: 500;
  }
  .wm-E2 :global(.lead) {
    /* centre (first-row bottom + gap / 2) on half the x-height */
    transform: translateY(calc(-0.258em - 0.045em));
  }
  .wm-E3 {
    align-items: baseline;
    gap: 0.1em;
    font-weight: 600;
  }
  .wm-E3 :global(.cap) {
    /* top of the mark on the cap height: .698 − dot .22 */
    transform: translateY(-0.478em);
  }
  .wm-E4 {
    align-items: center;
    gap: 0.3em;
    font-weight: 700;
  }
  .stack {
    display: flex;
    flex-direction: column;
    gap: 0.06em;
    font-size: 0.62em;
    letter-spacing: -0.03em;
  }
  .stack span:last-child {
    font-weight: 400;
  }
</style>
