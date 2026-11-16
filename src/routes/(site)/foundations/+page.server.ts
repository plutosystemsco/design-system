import { readFileSync } from "node:fs";
import path from "node:path";
import type { PageServerLoad } from "./$types";

/** Three facts generated from the token file. */
export const load: PageServerLoad = () => {
  const tokens = JSON.parse(
    readFileSync(path.resolve("tokens/kuiper.tokens.json"), "utf8"),
  ) as {
    primitives: Record<string, unknown>;
    themes: { light: Record<string, unknown> };
    radius: { case: number };
  };
  return {
    roles: Object.keys(tokens.themes.light).length,
    primitives: Object.keys(tokens.primitives).length,
    radius: tokens.radius.case,
  };
};
