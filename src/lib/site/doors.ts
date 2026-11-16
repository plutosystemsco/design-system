/**
 * The four doors: the mark's four dots, in N1's order, as the site's four
 * sections. Each door is a colour field, a name, a path and one line.
 */
import { listedItems } from "./items.ts";

export type DoorId = "start" | "components" | "brand" | "foundations";

export type Door = {
  id: DoorId;
  /** The field and the mark's dot: 1 blue, 2 red, 3 yellow, 4 green. */
  n: 1 | 2 | 3 | 4;
  name: string;
  path: string;
  /** The line under the name on the home page's disc. */
  line: string;
  /** One sentence: the section's job. */
  summary: string;
};

export const DOORS: readonly Door[] = [
  {
    id: "start",
    n: 1,
    name: "Start",
    path: "/start/",
    line: "Install, theme, modes",
    summary: "From an empty SvelteKit app to a first Kuiper screen.",
  },
  {
    id: "components",
    n: 2,
    name: "Components",
    path: "/components/",
    line: `${listedItems().length} parts`,
    summary: "Every part you can add, each on a page of its own.",
  },
  {
    id: "brand",
    n: 3,
    name: "Brand",
    path: "/brand/",
    line: "Mark, colour, voice",
    summary: "Who Pluto is, and how it looks, moves and speaks.",
  },
  {
    id: "foundations",
    n: 4,
    name: "Foundations",
    path: "/foundations/",
    line: "Tokens and rules",
    summary: "One token file. Every colour and size comes from it.",
  },
];

export function door(id: DoorId): Door {
  return DOORS.find((d) => d.id === id)!;
}

/**
 * The gap between two discs, as a fraction of the disc: N1's proportion. Two
 * discs and their gap are (2 + 0.267) discs wide.
 */
export const DOOR_GAP_RATIO = 0.267;

/**
 * The door's name, as a fraction of its disc's diameter. Sized by the disc,
 * not by a type step, so the words fit at every width.
 */
export const DOOR_NAME_RATIO = 0.12;

/**
 * Measured, not chosen: how far the first line's cap height sits below the
 * top of its line box, in em, for IBM Plex Sans Variable at weight 600 and a
 * line height of 0.9 (`type-poster`). The doors' top is set this far below
 * the headline's top, so the discs rise from the cap height, as the mark
 * rises beside the word in the lockup. Measured in Chromium with the
 * repository's font file, from a canvas's `measureText("B")`:
 * (fontBoundingBoxAscent + half-leading − actualBoundingBoxAscent) / size.
 */
export const POSTER_CAP_OFFSET = 0.127;
