import { readTokens } from "../../../../../scripts/tokens.ts";
import { colourRows } from "#lib/site/foundations/contrast-rows.server";
import { tokenRows } from "#lib/site/foundations/tables";
import type { PageServerLoad } from "./$types";

/** The surface a `-foreground` role is read on: `card` for `card-foreground`. */
function surfaceOf(role: string): string | null {
  if (role === "foreground") return "background";
  return role.endsWith("-foreground")
    ? role.slice(0, -"-foreground".length)
    : null;
}

/**
 * The roles and the contrast rows, generated from the token file at
 * prerender. A `-foreground` role carries its surface's values and the
 * pair's measured ratio in each theme, from `contrastTable` (018 decision 12).
 */
export const load: PageServerLoad = () => {
  const tokens = readTokens();
  const contrast = colourRows(tokens);
  const roles = tokenRows(tokens).filter(
    (r) => r.kind === "role" && !r.name.startsWith("syntax-"),
  );
  const byName = new Map(roles.map((r) => [r.name, r]));
  const ratio = (theme: "light" | "dark", label: string) =>
    contrast.find((c) => c.theme === theme && c.label === label)?.ratio;
  return {
    roles: roles.map((r) => {
      const name = surfaceOf(r.name);
      const surface = name ? byName.get(name) : undefined;
      const label = `${r.name} on ${name}`;
      const light = ratio("light", label);
      const dark = ratio("dark", label);
      return {
        ...r,
        pair:
          name && surface && light !== undefined && dark !== undefined
            ? {
                surface: name,
                light: { on: surface.light, ratio: light },
                dark: { on: surface.dark, ratio: dark },
              }
            : null,
      };
    }),
    contrast,
    exceptions: tokens.contrast.exceptions,
  };
};
