<script lang="ts" module>
  import FileText from "phosphor-svelte/lib/FileText";
  import Table from "phosphor-svelte/lib/Table";
  import PresentationChart from "phosphor-svelte/lib/PresentationChart";
  import EnvelopeSimple from "phosphor-svelte/lib/EnvelopeSimple";
  import ChatCircleText from "phosphor-svelte/lib/ChatCircleText";
  import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import FolderSimple from "phosphor-svelte/lib/FolderSimple";

  export type Hue = "blue" | "red" | "yellow" | "green";
  export type KeyVariant = "G5" | "G6" | "G7" | "G8" | "G9";
  export type KeySize = 16 | 32 | 48 | 64;

  export type KeyApp = {
    id: string;
    name: string;
    hue: Hue;
    glyph: typeof FileText;
  };

  /**
   * The eight apps in the default order, with the memo's glyphs (§1.5) and
   * colour map (§4): each row of four shows every hue once.
   */
  export const KEY_APPS: KeyApp[] = [
    { id: "docs", name: "Docs", hue: "blue", glyph: FileText },
    { id: "sheets", name: "Sheets", hue: "green", glyph: Table },
    { id: "slides", name: "Slides", hue: "yellow", glyph: PresentationChart },
    { id: "mail", name: "Mail", hue: "red", glyph: EnvelopeSimple },
    { id: "chat", name: "Chat", hue: "green", glyph: ChatCircleText },
    { id: "calendar", name: "Calendar", hue: "red", glyph: CalendarBlank },
    { id: "search", name: "Search", hue: "blue", glyph: MagnifyingGlass },
    { id: "files", name: "Files", hue: "yellow", glyph: FolderSimple },
  ];
</script>

<script lang="ts">
  import { DARK, FOUR, LIFTED, LIGHT } from "../round-two.ts";

  // One product icon in one of question G's round-two tiles (memo
  // research/2026-11-06-phosphor-icons-and-the-product-icon-tile.md, §8):
  // G5 = T1 flat colour tile, G6 = T2 paper tile with a duotone glyph,
  // G7 = T3 paper key with a colour skirt, G8 = T4 colour key (and its mono
  // form), G9 = T5 paper key with a duotone glyph. A research exhibit, not a
  // registry item, so colours are literals here.
  //
  // Where the memo names its older cool paper values (raised #FFFFFF edge
  // #9EA5B2, inkRaised #16181B, inkWash #23272E, stageRaised #0B0D0F, paper
  // #F4F6F8), the neutral tiles use round two's warm canvas instead
  // (round-two.ts, LIGHT and DARK): edge LIGHT.hairline, grey skirt
  // LIGHT.skirt, dark tile DARK.raised, dark key face DARK.key, dark skirt
  // DARK.skirt, dark line DARK.text. The hues and the colour key's skirts are
  // the memo's own and do not depend on the canvas (§10).
  let {
    app,
    variant,
    size = 64,
    theme = "light",
    mono = false,
  }: {
    app: KeyApp;
    variant: KeyVariant;
    size?: KeySize;
    theme?: "light" | "dark";
    /** G8's mono form: a neutral key with no hue. Ignored by the others. */
    mono?: boolean;
  } = $props();

  const dark = $derived(theme === "dark");

  /** T4's skirts: two ramp steps darker than the face's nearest step (§8). */
  const KEY_SKIRT: Record<Hue, string> = {
    blue: "#121593",
    red: "#860C1E",
    yellow: "#B66E16",
    green: "#084C33",
  };

  /** White on the hue unless white fails 3:1, then ink (§7): only yellow. */
  const onHue = (h: Hue) => (h === "yellow" ? LIGHT.ink : "#FFFFFF");

  const ink = $derived(dark ? DARK.text : LIGHT.ink);
  const accent = $derived(dark ? LIFTED[app.hue] : FOUR[app.hue]);

  // Geometry in pixels, from the 64-unit master (§5, §6.4). The radius
  // scales with the tile: 8 at 64, 6 at 48, 4 at 32, 2 at 16. The skirt is 6
  // units, snapped to whole pixels so the face's lower edge stays crisp (5 at
  // 48, where the master gives 4.5), and dropped at 16.
  const radius = $derived(size / 8);
  const isKey = $derived(
    variant === "G7" || variant === "G8" || variant === "G9",
  );
  const skirt = $derived(isKey && size > 16 ? Math.round((6 * size) / 64) : 0);
  const faceH = $derived(size - skirt);
  const box = $derived({ 64: 36, 48: 27, 32: 18, 16: 12 }[size]);
  const weight = $derived(size >= 48 ? "regular" : "bold");
  const gx = $derived(Math.round((size - box) / 2));
  const gy = $derived(Math.round((faceH - box) / 2));

  type Layers = {
    /** The skirt, behind the face; null when there is none. */
    base: string | null;
    face: string;
    /** A 1 px edge just inside the face; null for none. */
    edge: string | null;
    line: string;
    /** The duotone tone layer's colour; null for a plain glyph. */
    tone: string | null;
  };

  const layers: Layers = $derived.by(() => {
    switch (variant) {
      case "G5":
        // T1: the hue, identical in both themes.
        return {
          base: null,
          face: FOUR[app.hue],
          edge: null,
          line: onHue(app.hue),
          tone: null,
        };
      case "G6":
        // T2: a paper tile with a hairline edge; ink line, tone in the hue.
        return {
          base: null,
          face: dark ? DARK.raised : LIGHT.raised,
          edge: dark ? DARK.hairline : LIGHT.hairline,
          line: ink,
          tone: accent,
        };
      case "G7":
        // T3: the skirt takes the hue (lifted on graphite). At 16 the skirt
        // goes and a 1 px edge in the hue stands in for it.
        return {
          base: accent,
          face: dark ? DARK.key : LIGHT.raised,
          edge: size === 16 ? accent : null,
          line: ink,
          tone: null,
        };
      case "G8":
        // T4: the face is the hue, the skirt two ramp steps darker; the same
        // in both themes. Mono: a neutral key, T5 without its tone layer, so
        // it keeps T5's hairline edge (without it, a 16 px mono key has no
        // edge at all on a light bar).
        if (mono) {
          return {
            base: dark ? DARK.skirt : LIGHT.skirt,
            face: dark ? DARK.key : LIGHT.raised,
            edge: dark ? DARK.hairline : LIGHT.hairline,
            line: ink,
            tone: null,
          };
        }
        return {
          base: KEY_SKIRT[app.hue],
          face: FOUR[app.hue],
          edge: null,
          line: onHue(app.hue),
          tone: null,
        };
      case "G9":
        // T5: a neutral key with an edged face; the tone takes the hue.
        return {
          base: dark ? DARK.skirt : LIGHT.skirt,
          face: dark ? DARK.key : LIGHT.raised,
          edge: dark ? DARK.hairline : LIGHT.hairline,
          line: ink,
          tone: accent,
        };
    }
  });

  const Glyph = $derived(app.glyph);

  // At 16 px a full-opacity tone layer runs into the bold line and fills
  // Table, ChatCircleText and MagnifyingGlass into blots (seen at device
  // ratio 1). There the line gets a half-pixel halo in the face's colour,
  // which cuts the tone back from the line. Stroke width is in the glyph's
  // 256-unit grid: 1 px across, so half a pixel each side.
  const halo = $derived(layers.tone && size === 16 ? (256 / box) * 1 : 0);
</script>

<span
  class="key"
  role="img"
  aria-label="Pluto {app.name}"
  style="width:{size}px;height:{size}px"
>
  <svg
    width={size}
    height={size}
    viewBox="0 0 {size} {size}"
    aria-hidden="true"
    focusable="false"
  >
    {#if layers.base}
      <rect width={size} height={size} rx={radius} fill={layers.base} />
    {/if}
    <rect width={size} height={faceH} rx={radius} fill={layers.face} />
    {#if layers.edge}
      <rect
        x="0.5"
        y="0.5"
        width={size - 1}
        height={faceH - 1}
        rx={radius - 0.5}
        fill="none"
        stroke={layers.edge}
        stroke-width="1"
      />
    {/if}
  </svg>
  <span
    class="glyph"
    aria-hidden="true"
    style="left:{gx}px;top:{gy}px;width:{box}px;height:{box}px"
  >
    {#if layers.tone}
      <!--
        The duotone tone layer. phosphor-svelte fills a glyph in one colour and
        marks the tone path opacity="0.2" (memo §2.2), so it cannot take a
        second colour. Here a duotone copy is drawn in the hue, and the CSS
        below reaches into its markup: the line paths are hidden and the tone
        path is set to full opacity (memo §2.5). Acceptable in the exhibit; a
        registry item would need a decision on this or vendored paths.
      -->
      <span class="tone">
        <Glyph
          weight="duotone"
          size={box}
          color={layers.tone}
          aria-hidden="true"
        />
      </span>
    {/if}
    <span
      class="line"
      class:halo={halo > 0}
      style={halo ? `--halo:${layers.face};--halo-w:${halo}` : undefined}
    >
      <Glyph {weight} size={box} color={layers.line} aria-hidden="true" />
    </span>
  </span>
</span>

<style>
  .key {
    position: relative;
    display: block;
    flex: none;
  }
  .key svg {
    display: block;
  }
  .glyph {
    position: absolute;
    display: block;
  }
  .glyph :global(svg) {
    position: absolute;
    inset: 0;
    display: block;
  }
  .tone :global(path:not([opacity])) {
    display: none;
  }
  .tone :global(path[opacity]) {
    opacity: 1;
  }
  .halo :global(path) {
    stroke: var(--halo);
    stroke-width: var(--halo-w);
    stroke-linejoin: round;
    paint-order: stroke;
  }
</style>
