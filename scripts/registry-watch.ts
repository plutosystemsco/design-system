/**
 * The dev loop's Vite plugin (decision 23). Active only under `vite dev`.
 *
 * At start, before the server listens, it runs build:tokens then
 * build:registry, so any `vite dev` serves a fresh registry. It then watches
 * the token file, `registry.json`, the registry sources and `utils.ts`. A
 * token change rebuilds both; any other change rebuilds the registry. Runs are
 * debounced by 200 ms and never overlap; a change during a run queues one more.
 */
import path from "node:path";
import type { Plugin } from "vite";
import { buildRegistry } from "./build-registry.ts";
import { buildTokens } from "./build-tokens.ts";

const DEBOUNCE_MS = 200;
const WATCHED = [
  "tokens",
  "registry.json",
  "src/lib/registry",
  "src/lib/utils.ts",
];

type Logger = { info(message: string): void; error(message: string): void };

/** Debounces and serialises builds. Exported for its own sake; the plugin is the only caller. */
export function createRunner(root: string, logger: Logger) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running: Promise<void> | undefined;
  let pendingTokens = false;
  let pending = false;

  async function build(tokens: boolean) {
    if (tokens) {
      const { changed } = await buildTokens(root);
      if (changed.length)
        logger.info(`[registry] build:tokens wrote ${changed.join(", ")}`);
    }
    await buildRegistry({ root, quiet: true });
    logger.info("[registry] build:registry done");
  }

  /** A watch-time rebuild: a failure is logged, and the server keeps serving the last good registry. */
  async function run(tokens: boolean) {
    try {
      await build(tokens);
    } catch (error) {
      logger.error(
        `[registry] ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async function drain() {
    while (pending) {
      const tokens = pendingTokens;
      pending = false;
      pendingTokens = false;
      await run(tokens);
    }
    running = undefined;
  }

  return {
    /**
     * Runs now, once, at start. A failure rejects, so `vite dev` stops with the
     * build's own message instead of serving a stale registry or none.
     */
    async now(tokens: boolean) {
      await build(tokens);
    },
    /** Schedules a run after the debounce. */
    schedule(tokens: boolean) {
      pending = true;
      pendingTokens ||= tokens;
      clearTimeout(timer);
      timer = setTimeout(() => {
        running ??= drain();
      }, DEBOUNCE_MS);
    },
    close() {
      clearTimeout(timer);
    },
  };
}

export function registryWatch(): Plugin {
  return {
    name: "pluto-registry-watch",
    apply: "serve",
    async configureServer(server) {
      const root = server.config.root;
      const runner = createRunner(root, server.config.logger);
      await runner.now(true);

      const targets = WATCHED.map((p) => path.join(root, p));
      server.watcher.add(targets);
      const onChange = (file: string) => {
        const relative = path.relative(root, file).split(path.sep).join("/");
        const watched = WATCHED.some(
          (p) => relative === p || relative.startsWith(`${p}/`),
        );
        if (!watched) return;
        runner.schedule(relative.startsWith("tokens/"));
      };
      server.watcher.on("add", onChange);
      server.watcher.on("change", onChange);
      server.watcher.on("unlink", onChange);
      server.httpServer?.on("close", () => runner.close());
    },
  };
}
