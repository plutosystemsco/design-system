/**
 * The Foundations pages' tables, generated from the token files (017 decision
 * 6). Pure: a page's server load and the unit test each pass the tokens.
 * Nothing here is copied by hand, so a palette change redraws every table.
 * A role's and a code slot's job are its `$description` in the token files
 * (021 decision 9).
 */
import type { Theme, Tokens } from "../../../../scripts/tokens.ts";

/** One row of the tokens table: a primitive or a theme role. */
export type TokenRow = {
  /** The token's name, as the token file writes it. */
  name: string;
  /** The row's anchor on `/foundations/tokens/`. A primitive's is prefixed, as `raised` is both. */
  id: string;
  kind: "primitive" | "role";
  /** What the copy button copies: a role's custom property, a primitive's value. */
  copy: string;
  light: string;
  dark: string;
  /** For a role, the primitive it reads in each theme. */
  reads?: { light: string; dark: string };
  words: string;
};

/** Every primitive, then every theme role, in the token file's order. */
export function tokenRows(tokens: Tokens): TokenRow[] {
  const { light, dark } = tokens.themes;
  const primitives = Object.entries(tokens.primitives).map(
    ([name, value]): TokenRow => {
      const users = Object.keys(light).filter(
        (r) => light[r] === name || dark[r] === name,
      );
      return {
        name,
        id: `primitive-${name}`,
        kind: "primitive",
        copy: value,
        light: value,
        dark: value,
        words: users.length
          ? `A primitive, read by ${users.length === 1 ? "the role" : "the roles"} ${list(users)}.`
          : "A primitive that no theme role reads.",
      };
    },
  );
  const roles = Object.keys(light).map((name): TokenRow => ({
    name,
    id: name,
    kind: "role",
    copy: `--${name}`,
    light: tokens.primitives[light[name]],
    dark: tokens.primitives[dark[name]],
    reads: { light: light[name], dark: dark[name] },
    words: tokens.descriptions.roles[name] ?? "",
  }));
  return [...primitives, ...roles];
}

/** One row of the code table: a code role, the theme role it reads, and its colour in each theme. */
export type CodeRow = {
  role: string;
  token: string;
  light: string;
  dark: string;
  words: string;
};

/** Every role of the token file's `code` map, in its order. */
export function codeRows(tokens: Tokens): CodeRow[] {
  return Object.entries(tokens.code).map(([role, token]) => ({
    role,
    token,
    light: colour(tokens, "light", token),
    dark: colour(tokens, "dark", token),
    words: tokens.descriptions.code[role] ?? "",
  }));
}

function colour(tokens: Tokens, theme: Theme, role: string): string {
  return tokens.primitives[tokens.themes[theme][role]];
}

function list(names: string[]): string {
  const quoted = names;
  return quoted.length < 3
    ? quoted.join(" and ")
    : `${quoted.slice(0, -1).join(", ")} and ${quoted.at(-1)}`;
}
