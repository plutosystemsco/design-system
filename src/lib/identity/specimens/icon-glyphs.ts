/**
 * Eight original app glyphs for the product-icon board (question G). Each is
 * drawn on a 24-unit grid as stroked paths (2-unit stroke, round joins), plus
 * optional filled detail. Plain shapes, drawn here: no glyph is traced from
 * another suite's icon set.
 */

export type Hue = "blue" | "red" | "yellow" | "green";

export type Glyph = {
  /** Stroked paths, 24-unit grid. */
  stroke: string;
  /** Filled detail, same grid. */
  fill?: string;
};

export type App = {
  id: string;
  name: string;
  /** The app's leading colour, and in G1 its dot position. */
  hue: Hue;
  glyph: Glyph;
};

/** The mark's positions, in reading order: top-left, top-right, bottom-left, bottom-right. */
export const POSITION: Record<Hue, 0 | 1 | 2 | 3> = {
  blue: 0,
  red: 1,
  yellow: 2,
  green: 3,
};

export const APPS: App[] = [
  {
    id: "docs",
    name: "Docs",
    hue: "blue",
    glyph: {
      // A page with a folded corner, three lines of text.
      stroke: "M14 3H6v18h12V7z M14 3v4h4 M9 11h6 M9 14h6 M9 17h4",
    },
  },
  {
    id: "sheets",
    name: "Sheets",
    hue: "green",
    glyph: {
      // A table: a header row and a key column.
      stroke: "M5 4h14v16H5z M5 9h14 M5 14.5h14 M10 4v16",
    },
  },
  {
    id: "slides",
    name: "Slides",
    hue: "blue",
    glyph: {
      // A screen on a stand, one rising bar inside.
      stroke: "M3 5h18v11H3z M12 16v4 M8 20h8",
      fill: "M7 11h2v3H7z M11 9h2v5h-2z M15 7h2v7h-2z",
    },
  },
  {
    id: "mail",
    name: "Mail",
    hue: "red",
    glyph: {
      // An envelope, its flap a shallow V.
      stroke: "M3 6h18v12H3z M3 7l9 6.5L21 7",
    },
  },
  {
    id: "calendar",
    name: "Calendar",
    hue: "yellow",
    glyph: {
      // A month page with two rings and today marked.
      stroke: "M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5",
      fill: "M13 14h3v3h-3z",
    },
  },
  {
    id: "files",
    name: "Files",
    hue: "green",
    glyph: {
      // A folder with its tab.
      stroke: "M3 6h6l2 2h10v11H3z M3 11h18",
    },
  },
  {
    id: "search",
    name: "Search",
    hue: "yellow",
    glyph: {
      // A lens and its handle, a datum at its focus.
      stroke: "M10.5 4a6.5 6.5 0 1 1 0 13a6.5 6.5 0 1 1 0-13z M15.5 15.5L20 20",
      fill: "M10.5 9a1.5 1.5 0 1 1 0 3a1.5 1.5 0 1 1 0-3z",
    },
  },
  {
    id: "chat",
    name: "Chat",
    hue: "red",
    glyph: {
      // A speech bubble with a tail at the lower left, two lines said.
      stroke: "M4 5h16v11h-9l-4 4v-4H4z M8 9h8 M8 12h5",
    },
  },
];
