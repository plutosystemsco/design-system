<script lang="ts" module>
  export const meta = {
    title: "The mark, painted from the tokens",
    intro:
      "A canvas cannot use a class, so each dot's colour is readToken(\"mark-N\", canvas), read where the canvas sits. On the page it reads the theme's marks; inside a .dark subtree, the dark theme's paper marks, whatever the page's theme. Both repaint when the theme changes.",
  };
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { readToken } from "#lib/registry/lib/read-token";

  // The four dots, painted on a canvas from readToken("mark-N"), read where
  // the canvas is: once on the page, once inside a .dark subtree.
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
</script>

<div class="flex flex-wrap items-start gap-12">
  <div class="flex flex-col items-start gap-2">
    <!-- A drawing, not a control: role="img" and the label give it its text
    alternative. Svelte counts every canvas interactive. -->
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
    <span class="text-xs text-muted-foreground">On the page</span>
  </div>
  <div class="flex flex-col items-start gap-2">
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
    <span class="text-xs text-muted-foreground">Inside a .dark subtree</span>
  </div>
</div>
