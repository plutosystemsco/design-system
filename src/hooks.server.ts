import type { Handle } from "@sveltejs/kit/hooks";
import { preloadFor } from "#lib/site/page/text-face";

/**
 * 024c: a component page preloads its text face ahead of its scripts. A
 * second `handle` composes with this one through `sequence`, from
 * `@sveltejs/kit/hooks`.
 */
export const handle: Handle = ({ event, resolve }) =>
  resolve(event, { preload: preloadFor(event.route.id) });
