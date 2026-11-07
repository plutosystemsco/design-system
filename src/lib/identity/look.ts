/**
 * A "look": one combination of candidate answers, as plain values a specimen
 * paints with. The exhibit composes looks from the options; the specimens
 * never hold a value of their own. A research exhibit, so candidate values
 * live here rather than in the token file.
 */

export type Palette = {
  id: string;
  name: string;
  /** The mark's four, on paper. */
  blue: string;
  red: string;
  yellow: string;
  green: string;
  /** The mark's four, lifted for a dark stage. */
  blueLifted: string;
  redLifted: string;
  yellowLifted: string;
  greenLifted: string;
  /** Text-safe tones on paper. */
  blueText: string;
  redText: string;
  greenText: string;
  yellowText: string;
  paper: string;
  raised: string;
  ink: string;
  inkSoft: string;
  /** The stage: a ground darker than ink, its raised card, lines and muted text. */
  stage: string;
  stageRaised: string;
  stageLine: string;
  stageLineStrong: string;
  stageMuted: string;
  stageText: string;
};

export type TypeStack = {
  id: string;
  display: string;
  body: string;
  mono: string;
  displayWeight: number;
  /** Display tracking, em. */
  displayTracking: number;
  /** Display line height. */
  displayLeading: number;
};

export type Shape = { id: string; action: string; card: string; input: string };

export type Light = "flat" | "bloom" | "four" | "glass";

export type Scale = {
  id: string;
  displayMax: number;
  displayMin: number;
  proofMax: number;
};

export type Copy = {
  id: string;
  eyebrow: string;
  headline: string;
  sub: string;
  primary: string;
  secondary: string;
  proof: { value: number; suffix: string; label: string }[];
};

export type Behaviour = "paper" | "moments" | "fields" | "stage";

export type Look = {
  palette: Palette;
  type: TypeStack;
  shape: Shape;
  light: Light;
  scale: Scale;
  copy: Copy;
  behaviour: Behaviour;
};

/** Today's palette, from `tokens/pluto.tokens.json`, with the lab's stage. */
export const TODAY: Palette = {
  id: "today",
  name: "Today",
  blue: "#2456E6",
  red: "#E23A2E",
  yellow: "#F0AE12",
  green: "#1E9E56",
  blueLifted: "#7A9BFF",
  redLifted: "#FF7D73",
  yellowLifted: "#F0AE12",
  greenLifted: "#4CC982",
  blueText: "#2456E6",
  redText: "#C42A1F",
  greenText: "#136E3E",
  yellowText: "#85600B",
  paper: "#F7F7F4",
  raised: "#FFFFFF",
  ink: "#14161C",
  inkSoft: "#4A4F5C",
  stage: "#050608",
  stageRaised: "#0E1014",
  stageLine: "#F7F7F41A",
  stageLineStrong: "#F7F7F424",
  stageMuted: "#9AA0AD",
  stageText: "#F7F7F4",
};

const FALLBACK_SANS = "system-ui, sans-serif";
const FALLBACK_MONO = "ui-monospace, monospace";

export const TYPE: Record<string, TypeStack> = {
  D1: {
    id: "D1",
    display: `"IBM Plex Sans Variable", ${FALLBACK_SANS}`,
    body: `"Geist Variable", ${FALLBACK_SANS}`,
    mono: `"JetBrains Mono Variable", ${FALLBACK_MONO}`,
    displayWeight: 600,
    displayTracking: -0.045,
    displayLeading: 0.95,
  },
  D2: {
    id: "D2",
    display: `"IBM Plex Sans Variable", ${FALLBACK_SANS}`,
    body: `"IBM Plex Sans Variable", ${FALLBACK_SANS}`,
    mono: `"IBM Plex Mono", ${FALLBACK_MONO}`,
    displayWeight: 600,
    displayTracking: -0.04,
    displayLeading: 0.98,
  },
  D3: {
    id: "D3",
    display: `"Figtree Variable", ${FALLBACK_SANS}`,
    body: `"Figtree Variable", ${FALLBACK_SANS}`,
    mono: `"JetBrains Mono Variable", ${FALLBACK_MONO}`,
    displayWeight: 700,
    displayTracking: -0.04,
    displayLeading: 0.98,
  },
  D4: {
    id: "D4",
    display: `"Funnel Display Variable", ${FALLBACK_SANS}`,
    body: `"Funnel Sans Variable", ${FALLBACK_SANS}`,
    mono: `"Geist Mono Variable", ${FALLBACK_MONO}`,
    displayWeight: 600,
    displayTracking: -0.035,
    displayLeading: 0.95,
  },
  D5: {
    id: "D5",
    display: `"Instrument Sans Variable", ${FALLBACK_SANS}`,
    body: `"Instrument Sans Variable", ${FALLBACK_SANS}`,
    mono: `"JetBrains Mono Variable", ${FALLBACK_MONO}`,
    displayWeight: 600,
    displayTracking: -0.045,
    displayLeading: 0.95,
  },
};

export const SHAPE: Record<string, Shape> = {
  H1: { id: "H1", action: "8px", card: "8px", input: "8px" },
  H2: { id: "H2", action: "999px", card: "14px", input: "8px" },
  H3: { id: "H3", action: "999px", card: "24px", input: "16px" },
  H4: { id: "H4", action: "2px", card: "2px", input: "2px" },
};

export const SCALE: Record<string, Scale> = {
  K1: { id: "K1", displayMin: 40, displayMax: 64, proofMax: 72 },
  K2: { id: "K2", displayMin: 48, displayMax: 92, proofMax: 96 },
  K3: { id: "K3", displayMin: 56, displayMax: 160, proofMax: 128 },
};

// True of the platform where shown (the vfs README, read 2026-11-01), the
// same proof `010`'s block uses.
const PROOF = [
  {
    value: 4,
    suffix: " verbs",
    label: "to search it all: glob, grep, glean and graph",
  },
  { value: 1, suffix: " namespace", label: "for every file, row and tool" },
  {
    value: 0,
    suffix: " new databases",
    label: "to run: it mounts the one you have",
  },
];

export const COPY: Record<string, Copy> = {
  L1: {
    id: "L1",
    eyebrow: "pluto workspace",
    headline: "Work runs on data.",
    sub: "Docs, sheets, mail and search on one governed data layer. Agents and people search the same files, under the same permissions.",
    primary: "Start free",
    secondary: "Read the docs",
    proof: PROOF,
  },
  L2: {
    id: "L2",
    eyebrow: "pluto workspace",
    headline: "Work runs on data.",
    sub: "One layer. Every file. Every agent. Every permission.",
    primary: "Get Pluto",
    secondary: "See it run",
    proof: PROOF,
  },
  L3: {
    id: "L3",
    eyebrow: "pluto workspace",
    headline: "Work runs on data.",
    sub: "Spend your day on the work you care about. Pluto finds what you need, and your agents can too, safely.",
    primary: "Try Pluto",
    secondary: "How it works",
    proof: PROOF,
  },
  L4: {
    id: "L4",
    eyebrow: "pluto · built on vfs",
    headline: "Work runs on data.",
    sub: "glob, grep and search across every file your company owns, over MCP or the CLI. One kernel decides who sees what.",
    primary: "pip install vfs-py",
    secondary: "Read the source",
    proof: PROOF,
  },
};

export const RECOMMENDED_LOOK: Omit<Look, "palette"> = {
  type: TYPE.D5,
  shape: SHAPE.H2,
  light: "four",
  scale: SCALE.K2,
  copy: COPY.L3,
  behaviour: "moments",
};

export function look(partial: Partial<Look>): Look {
  return { palette: TODAY, ...RECOMMENDED_LOOK, ...partial };
}
