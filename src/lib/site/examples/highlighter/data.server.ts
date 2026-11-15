import { highlightCode } from "#lib/registry/lib/highlighter";
import { CODE_SAMPLES } from "#lib/preview/code-samples";

/**
 * The gallery's twenty-six samples are highlighted here, at prerender, with
 * `highlightCode`, so the page ships the token data and no engine.
 */
export async function load() {
  const gallery = [];
  for (const sample of CODE_SAMPLES) {
    const lines = await highlightCode(sample.code, sample.language);
    if (!lines)
      throw new Error(`highlighter: ${sample.language} is not listed`);
    gallery.push({ language: sample.language, title: sample.title, lines });
  }
  return { gallery };
}
