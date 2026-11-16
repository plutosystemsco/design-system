/**
 * 020 decision 10: `vite dev` and `vite preview` answer `static/_redirects`
 * as the host does, with the same 301s, so the browser suite tests the file
 * the host serves. Site tooling: it ships nothing, and uses only Vite's own
 * API. The middleware is registered directly, not in a returned post hook,
 * so it runs before SvelteKit's.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Connect, Plugin } from "vite";
import { matchRedirect, parseRedirects } from "../../src/lib/site/redirects.ts";

function middleware(root: string): Connect.NextHandleFunction {
  const rules = parseRedirects(
    readFileSync(path.join(root, "static", "_redirects"), "utf8"),
  );
  return (req, res, next) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const to = matchRedirect(decodeURI(url.pathname), rules);
    if (!to) return next();
    res.statusCode = 301;
    res.setHeader("Location", to + url.search);
    res.end();
  };
}

export function redirects(): Plugin {
  return {
    name: "kuiper-redirects",
    configureServer(server) {
      server.middlewares.use(middleware(server.config.root));
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware(server.config.root));
    },
  };
}
