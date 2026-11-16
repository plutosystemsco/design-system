import { highlightCode } from "#lib/registry/lib/highlighter";
import {
  ADD_BUTTON,
  ADD_THEME,
  COMPONENTS,
  CREATE,
  IMPORTS,
  INIT,
  filesWritten,
} from "#lib/site/start/install";
import type { PageServerLoad } from "./$types";

async function block(code: string, language: string) {
  return { code, lines: await highlightCode(code, language) };
}

/** The guide's blocks, highlighted at prerender, and the files each add writes. */
export const load: PageServerLoad = async () => ({
  create: await block(CREATE, "bash"),
  imports: await block(IMPORTS, "json"),
  components: await block(COMPONENTS, "json"),
  init: await block(INIT, "bash"),
  theme: await block(ADD_THEME, "bash"),
  button: await block(ADD_BUTTON, "bash"),
  buttonFiles: filesWritten("button", ["kuiper-theme"]),
});
