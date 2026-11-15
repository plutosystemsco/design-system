/**
 * 013 decision 5: `bun test` has no Vite, so this preload teaches Bun the two
 * import suffixes the highlighter uses. A `?raw` import loads as the file's
 * text; a `?url` import resolves to the file's absolute path, which the
 * server branch never reads (it resolves the package path itself) but a
 * test may.
 */
import { plugin } from "bun";
import { readFileSync } from "node:fs";
import path from "node:path";

plugin({
  name: "vite-imports",
  setup(build) {
    build.onResolve({ filter: /\?(raw|url)$/ }, (args) => {
      const [specifier, query] = args.path.split("?") as [string, string];
      const resolved = specifier.startsWith(".")
        ? path.resolve(path.dirname(args.importer), specifier)
        : Bun.resolveSync(specifier, path.dirname(args.importer));
      return { path: resolved, namespace: `vite-${query}` };
    });
    build.onLoad({ filter: /.*/, namespace: "vite-raw" }, (args) => ({
      contents: `export default ${JSON.stringify(readFileSync(args.path, "utf8"))};`,
      loader: "js",
    }));
    build.onLoad({ filter: /.*/, namespace: "vite-url" }, (args) => ({
      contents: `export default ${JSON.stringify(args.path)};`,
      loader: "js",
    }));
  },
});
