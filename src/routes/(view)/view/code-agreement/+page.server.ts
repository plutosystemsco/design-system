import { highlightCode } from "#lib/registry/lib/highlighter";
import { CODE_SAMPLES } from "#lib/preview/code-samples";
import type { PageServerLoad } from "./$types";

/**
 * 013 decision 21: the agreement view. Each gallery sample is highlighted
 * here, at prerender, and again in the browser from its code, so the two
 * copies can be compared character by character.
 */
export const load: PageServerLoad = async () => {
  const gallery = [];
  for (const sample of CODE_SAMPLES) {
    const lines = await highlightCode(sample.code, sample.language);
    if (!lines)
      throw new Error(`highlighter: ${sample.language} is not listed`);
    gallery.push({
      language: sample.language,
      title: sample.title,
      code: sample.code,
      lines,
    });
  }
  return { gallery };
};
