/**
 * Round two of the identity exhibit (decisions.md, "The identity: the owner's
 * first answers", 2026-11-06). Every round-two specimen draws with the
 * owner's settled palette, B3 Deep Field, on the warm canvas measured in
 * research/2026-11-06-from-beige-computing-to-liquid-glass.md (§5, §6). A
 * research exhibit, not a registry item: these values are candidates, and the
 * brand specification turns the chosen ones into tokens.
 */

/** B3 Deep Field's four (src/lib/identity/palettes.ts, id deep-field). */
export const FOUR = {
  blue: "#2D48D4",
  red: "#C92035",
  yellow: "#F19E20",
  green: "#008058",
} as const;

/** The lifted four, for dark grounds. */
export const LIFTED = {
  blue: "#93B0FF",
  red: "#FF9491",
  yellow: "#F3A023",
  green: "#60C498",
} as const;

/** The four as text on light grounds (yellow's is a deep amber). */
export const TEXT = {
  blue: "#2D48D4",
  red: "#C81F34",
  yellow: "#915B00",
  green: "#007651",
} as const;

/** In the mark's reading order: blue, red / yellow, green (N1). */
export const ORDER = ["blue", "red", "yellow", "green"] as const;

/** The light theme on the warm canvas, W2 (memo §5, §6.1). */
export const LIGHT = {
  canvas: "#F3F0E8",
  raised: "#FFFFFF",
  raisedWarm: "#FBFAF6",
  sunk: "#E9E5DB",
  hairline: "#D9D3C6",
  skirt: "#CFC8B8",
  inputEdge: "#857E70",
  ink: "#0B0F17",
  inkSoft: "#505661",
} as const;

/** The dark theme on warm graphite, D1 (memo §6.5). */
export const DARK = {
  canvas: "#16140F",
  raised: "#221F19",
  sunk: "#0F0E0B",
  hairline: "#36322A",
  key: "#2A2620",
  skirt: "#0A0907",
  inputEdge: "#7A7366",
  text: "#F3F0E8",
  muted: "#A39D90",
} as const;

/** Deep Field's stage: the screen inside the case (memo §5, I7). */
export const SCREEN = {
  ground: "#030407",
  raised: "#0B0D0F",
  line: "#1C1D20",
  text: "#F4F6F8",
  muted: "#969BA4",
} as const;

/** Keycap skirts, ink 30% over each fill (memo §6.2). */
export const SKIRT = {
  blue: "#23379B",
  red: "#901B2C",
  yellow: "#AC731D",
  green: "#035E45",
} as const;

/** Keycap legends: white on blue, red and green; ink on yellow (§6.2). */
export const LEGEND = {
  blue: "#FFFFFF",
  red: "#FFFFFF",
  yellow: "#0B0F17",
  green: "#FFFFFF",
} as const;

/** The faces, D1: kept (decisions.md, 2026-11-06). */
export const FACES = {
  display: '"IBM Plex Sans Variable", system-ui, sans-serif',
  body: '"Geist Variable", system-ui, sans-serif',
  mono: '"JetBrains Mono Variable", ui-monospace, monospace',
} as const;
