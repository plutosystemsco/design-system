import type { Handle } from "@sveltejs/kit/hooks";
import { preloadFor } from "#lib/site/page/text-face";

/** 024c: a component page preloads its text face ahead of its scripts. */
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, { preload: preloadFor(event.route.id) });
