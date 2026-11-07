<script lang="ts">
  import { TODAY } from "../look.ts";
  import { POSITION, type App, type Hue } from "./icon-glyphs.ts";

  // One app icon in one of question G's styles, drawn on a 64-unit tile so
  // 64, 32 and 16 px are whole divisions. The glyph's stroke thickens as the
  // icon shrinks, so a 16 px icon keeps a visible line.
  let {
    app,
    variant,
    size = 64,
    ground = "paper",
    label,
  }: {
    app: App;
    variant: "G1" | "G2" | "G3" | "G4";
    size?: number;
    ground?: "paper" | "stage";
    /** The accessible name. Without it, the icon is decoration (its name is beside it). */
    label?: string;
  } = $props();

  const uid = $props.id();
  const p = TODAY;
  const dark = $derived(ground === "stage");

  const LIFTED: Record<Hue, string> = {
    blue: p.blueLifted,
    red: p.redLifted,
    yellow: p.yellowLifted,
    green: p.greenLifted,
  };
  const BASE: Record<Hue, string> = {
    blue: p.blue,
    red: p.red,
    yellow: p.yellow,
    green: p.green,
  };
  const hue = (h: Hue) => (dark ? LIFTED[h] : BASE[h]);

  const tile = $derived(dark ? p.stageRaised : p.raised);
  const edge = $derived(dark ? p.stageLineStrong : "#14161C1F");
  const ink = $derived(dark ? p.stageText : p.ink);
  const quiet = $derived(dark ? "#F7F7F429" : "#14161C1F");

  /** Stroke in grid units for a glyph box of `units` (in the 64 tile). */
  function weight(units: number) {
    const px = (units / 64) * size;
    return Math.min(3.2, Math.max(2, (1.15 * 24) / px));
  }

  // G1: the mark's 2×2 at its proportion (dot .30, gap .08 ≈ 18 : 4).
  const CENTRES = [
    [21, 21],
    [43, 21],
    [21, 43],
    [43, 43],
  ] as const;
  const at = $derived(CENTRES[POSITION[app.hue]]);
  const CELL = 22;

  // G2: the tile is the app's colour, on either ground. White on yellow
  // fails contrast, so the yellow tile carries an ink glyph.
  const g2Glyph = $derived(app.hue === "yellow" ? p.ink : "#FFFFFF");

  // G4: the monochrome tile is paper on paper and ink on the stage.
  const g4Tile = $derived(dark ? p.ink : p.raised);

  const FOUR: Hue[] = ["blue", "red", "yellow", "green"];
  const QUAD = [
    [0, 0],
    [32, 0],
    [0, 32],
    [32, 32],
  ] as const;
</script>

{#snippet glyph(
  x: number,
  y: number,
  units: number,
  colour: string,
  clip?: string,
)}
  <g
    transform="translate({x} {y}) scale({units / 24})"
    clip-path={clip ? `url(#${clip})` : undefined}
  >
    <path
      d={app.glyph.stroke}
      fill="none"
      stroke={colour}
      stroke-width={weight(units)}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    {#if app.glyph.fill}<path d={app.glyph.fill} fill={colour} />{/if}
  </g>
{/snippet}

<svg
  width={size}
  height={size}
  viewBox="0 0 64 64"
  role={label ? "img" : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : "true"}
  class="icon"
>
  {#if variant === "G2"}
    <rect width="64" height="64" rx="14" fill={BASE[app.hue]} />
    {@render glyph(14, 14, 36, g2Glyph)}
  {:else}
    <rect
      x="1"
      y="1"
      width="62"
      height="62"
      rx="13"
      fill={variant === "G4" ? g4Tile : tile}
      stroke={edge}
      stroke-width="1"
      vector-effect="non-scaling-stroke"
    />
    {#if variant === "G1"}
      {#each CENTRES as [cx, cy], i (i)}
        {#if i !== POSITION[app.hue]}<circle
            {cx}
            {cy}
            r="9"
            fill={quiet}
          />{/if}
      {/each}
      {@render glyph(at[0] - CELL / 2, at[1] - CELL / 2, CELL, hue(app.hue))}
    {:else if variant === "G3"}
      <defs>
        {#each QUAD as [qx, qy], i (i)}
          <clipPath id="{uid}-q{i}"
            ><rect
              x={(qx - 14) * (24 / 36)}
              y={(qy - 14) * (24 / 36)}
              width={32 * (24 / 36)}
              height={32 * (24 / 36)}
            /></clipPath
          >
        {/each}
      </defs>
      {#each FOUR as h, i (h)}
        {@render glyph(14, 14, 36, hue(h), `${uid}-q${i}`)}
      {/each}
    {:else}
      {@render glyph(15, 15, 34, ink)}
      <circle
        cx="51"
        cy="13"
        r="7"
        fill={hue(app.hue)}
        stroke={g4Tile}
        stroke-width="3"
      />
    {/if}
  {/if}
</svg>

<style>
  .icon {
    display: block;
    flex: none;
  }
</style>
