import { highlightCode } from "#lib/registry/lib/highlighter";
import { CODE_SAMPLES } from "#lib/preview/code-samples";
import type { PageServerLoad } from "./$types";

/**
 * The gallery's twenty-six samples are highlighted here, at prerender, with
 * `highlightCode`, so the page ships the token data and no Shiki (007
 * decision 9). Every grammar compiles under the strict engine, or this load
 * fails and the build with it.
 */
export const load: PageServerLoad = async () => {
  const gallery = [];
  for (const sample of CODE_SAMPLES) {
    const lines = await highlightCode(sample.code, sample.language);
    if (!lines)
      throw new Error(`highlighter: ${sample.language} is not listed`);
    gallery.push({ language: sample.language, title: sample.title, lines });
  }
  return { gallery };
};
