<script lang="ts" module>
  export const meta = {
    title: "A tween on the motion tokens",
    intro:
      "tween animates a number over a duration token and an easing token, one call per frame, and returns a cancel function. With the duration at 0, as under reduced motion, it calls onFrame once with the final value.",
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { tween } from "#lib/registry/lib/read-token";
  import { Button } from "#lib/registry/ui/button";

  // A count-up over the fill duration and the standard curve. Under reduced
  // motion the duration reads 0 and the number lands at once.
  let count = $state(0);
  let cancel: (() => void) | undefined;
  function countUp() {
    cancel?.();
    cancel = tween({
      from: 0,
      to: 4.81,
      duration: "motion-fill",
      ease: "ease-standard",
      onFrame: (value) => (count = value),
    });
  }
  // A count-up still running when the page goes stops with it.
  onMount(() => () => cancel?.());
</script>

<div class="flex flex-wrap items-center gap-6">
  <Button variant="secondary" onclick={countUp}>Count up</Button>
  <p class="font-mono text-2xl tabular-nums">
    {count.toFixed(2)} billion
  </p>
</div>
