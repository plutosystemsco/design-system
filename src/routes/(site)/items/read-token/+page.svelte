<script lang="ts">
  import { onMount } from "svelte";
  import { readToken, tween } from "#lib/registry/lib/read-token";
  import { Button } from "#lib/registry/ui/button";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  // The four dots, painted on a canvas from readToken("mark-N"), read where
  // the canvas is: once on the page, once inside a .dark subtree (012
  // decision 8).
  const DOT = 24;
  const GAP = 12;
  const WIDTH = 4 * DOT + 3 * GAP;

  let pageCanvas: HTMLCanvasElement | undefined = $state();
  let darkCanvas: HTMLCanvasElement | undefined = $state();
  let pageMarks: string[] = $state([]);
  let darkMarks: string[] = $state([]);
  // Bumped when <html>'s class changes, so the canvases repaint in the new theme.
  let themeChanges = $state(0);

  function paint(canvas: HTMLCanvasElement): string[] {
    const marks = [1, 2, 3, 4].map((n) => readToken(`mark-${n}`, canvas));
    const ratio = window.devicePixelRatio || 1;
    canvas.width = WIDTH * ratio;
    canvas.height = DOT * ratio;
    const context = canvas.getContext("2d");
    if (!context) return marks;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, WIDTH, DOT);
    marks.forEach((colour, i) => {
      context.fillStyle = colour;
      context.beginPath();
      context.arc(DOT / 2 + i * (DOT + GAP), DOT / 2, DOT / 2, 0, Math.PI * 2);
      context.fill();
    });
    const centre = Math.round((DOT / 2) * ratio);
    canvas.dataset.firstDot = `${centre},${centre}`;
    return marks;
  }

  onMount(() => {
    const observer = new MutationObserver(() => themeChanges++);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  });

  $effect(() => {
    void themeChanges;
    if (pageCanvas) pageMarks = paint(pageCanvas);
    if (darkCanvas) darkMarks = paint(darkCanvas);
  });

  const label = (marks: string[]) =>
    `Four dots painted from mark-1 to mark-4: ${marks.join(", ")}`;

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

<ItemHeader name="read-token" />

<PreviewSection
  id="variants"
  title="The mark, painted from the tokens"
  intro="A canvas cannot use a class. Each dot's colour is readToken(&quot;mark-N&quot;, canvas), read where the canvas sits: on the page, the theme's marks; inside a .dark subtree, the dark theme's paper marks, whatever the page's theme. Both repaint when the theme changes."
>
  <div class="flex flex-wrap items-start gap-12">
    <Specimen caption="on the page">
      <!-- A drawing, not a control: role="img" and the label give it its text
      alternative (009 decision 10). Svelte counts every canvas interactive. -->
      <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
      <canvas
        bind:this={pageCanvas}
        data-testid="dots-page"
        role="img"
        aria-label={label(pageMarks)}
        style="width: {WIDTH}px; height: {DOT}px"
      ></canvas>
      <code data-testid="read-page-mark-1" class="text-sm"
        >{pageMarks[0] ?? ""}</code
      >
    </Specimen>
    <Specimen caption="inside a .dark subtree">
      <div
        class="dark flex flex-col gap-2 rounded bg-background p-4 text-foreground"
      >
        <!-- svelte-ignore a11y_no_interactive_element_to_noninteractive_role -->
        <canvas
          bind:this={darkCanvas}
          data-testid="dots-dark"
          role="img"
          aria-label={label(darkMarks)}
          style="width: {WIDTH}px; height: {DOT}px"
        ></canvas>
        <code data-testid="read-dark-mark-1" class="text-sm"
          >{darkMarks[0] ?? ""}</code
        >
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="tween"
  title="A tween on the motion tokens"
  intro="tween animates a number over a duration token and an easing token, one call per frame, and returns a cancel function. With the duration at 0, as under reduced motion, it calls onFrame once with the final value."
>
  <div class="flex flex-wrap items-center gap-6">
    <Button variant="secondary" onclick={countUp}>Count up</Button>
    <p class="font-mono text-2xl tabular-nums">
      {count.toFixed(2)} billion
    </p>
  </div>
</PreviewSection>

<PreviewSection
  id="names"
  title="The names it reads"
  intro="A name is a variable's name without its two dashes. Only runtime variables read back: Tailwind's theme values, such as text-xs, are inlined into utilities and read empty, and a misspelled name reads empty with a warning in development. Call it in the browser: on the server it returns an empty string."
>
  <div class="grid gap-8 md:grid-cols-2">
    <div>
      <h3 class="text-base font-bold">
        Colours, in each theme · {data.colours.length}
      </h3>
      <ul class="mt-2 grid gap-1 text-sm">
        {#each data.colours as name (name)}
          <li><code>{name}</code></li>
        {/each}
      </ul>
    </div>
    <div>
      <h3 class="text-base font-bold">On :root · {data.root.length}</h3>
      <ul class="mt-2 grid gap-1 text-sm">
        {#each data.root as name (name)}
          <li><code>{name}</code></li>
        {/each}
      </ul>
    </div>
  </div>
</PreviewSection>
