import { error } from "@sveltejs/kit";
import { readTokens } from "../../../../../../scripts/tokens.ts";
import { DOWNLOADS, downloadSvg } from "#lib/site/brand/downloads";
import type { EntryGenerator, RequestHandler } from "./$types";

export const prerender = true;

/** The six files, written at build at their own paths (017 decision 4). */
export const entries: EntryGenerator = () =>
  DOWNLOADS.map((d) => ({ file: d.file }));

export const GET: RequestHandler = async ({ params }) => {
  if (!DOWNLOADS.some((d) => d.file === params.file)) error(404);
  return new Response(await downloadSvg(readTokens(), params.file), {
    headers: { "content-type": "image/svg+xml" },
  });
};
