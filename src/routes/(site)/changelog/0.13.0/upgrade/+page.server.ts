import { highlightCode } from "#lib/registry/lib/highlighter";
import { BEFORE, SECTIONS } from "#lib/site/upgrade/0.13.0";
import type { PageServerLoad } from "./$types";

async function block(code: string | undefined, language = "bash") {
  return code ? { code, lines: await highlightCode(code, language) } : null;
}

/** 020 decision 12: the guide's commands, highlighted at prerender. */
export const load: PageServerLoad = async () => ({
  before: await block(BEFORE.command),
  sections: await Promise.all(
    SECTIONS.map(async (s) => ({
      id: s.id,
      steps: await Promise.all(s.steps.map((step) => block(step.command))),
    })),
  ),
});
