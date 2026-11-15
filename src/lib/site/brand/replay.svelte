<script lang="ts">
  import { readDuration, readToken } from "#lib/registry/lib/read-token";
  import { Button } from "#lib/registry/ui/button";
  import { FourDot } from "#lib/registry/ui/four-dot";

  let {
    kind,
    label,
  }: {
    /** The entrance (the page's one hello) or the reveal (a response, at most 200 ms). */
    kind: "entrance" | "reveal";
    /** The Replay button's name. */
    label: string;
  } = $props();

  let plays = $state(0);
  let mark: HTMLElement | undefined = $state();

  // The reveal's path: each dot from its orbit, as the footer's endorsement
  // shows the dots on hover, timed to --motion-micro.
  const ORBIT = [
    [-1, 0.6],
    [0.8, -0.8],
    [-0.6, -1],
    [1, 0.8],
  ];

  function reveal() {
    const root = mark?.querySelector<HTMLElement>('[data-slot="four-dot"]');
    if (!root) return;
    const micro = readDuration("motion-micro", root);
    // Under reduced motion the duration reads 0: nothing plays, the dots stay.
    if (micro === 0) return;
    const dot = Number(readToken("motion-entrance-dot", root));
    const start = Number(readToken("motion-entrance-start", root));
    const stagger = Number(readToken("motion-entrance-stagger", root));
    const spring = readToken("ease-spring", root);
    // The orbit is in the mark's em.
    const orbit =
      parseFloat(readToken("mark-orbit", root)) *
      parseFloat(getComputedStyle(root).fontSize);
    root
      .querySelectorAll<HTMLElement>('[data-slot="four-dot-dot"]')
      .forEach((el, i) => {
        const [ox, oy] = ORBIT[i];
        el.animate(
          [
            {
              opacity: 0,
              transform: `translate(${orbit * ox}px, ${orbit * oy}px) scale(0.4)`,
            },
            { opacity: 1, transform: "none" },
          ],
          {
            duration: micro * dot,
            delay: micro * (start + i * stagger),
            easing: spring || "ease-out",
            fill: "backwards",
          },
        );
      });
  }

  function replay() {
    plays++;
    if (kind === "reveal") reveal();
  }
</script>

<!--
  A specimen at rest, the mark composed, with a Replay button: it moves only
  when asked (J2). The entrance re-mounts the mark with its entrance on; the
  reveal plays the dots in from their orbit over --motion-micro.
-->
<div data-specimen={kind} class="grid justify-items-start gap-4">
  <div bind:this={mark} class="text-8xl" aria-hidden="true">
    {#key plays}
      <FourDot entrance={kind === "entrance" && plays > 0} />
    {/key}
  </div>
  <Button variant="secondary" onclick={replay}>{label}</Button>
</div>
