import { execSync } from "node:child_process";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { registryWatch } from "./scripts/registry-watch.ts";
import { redirects } from "./scripts/site/redirects-plugin.ts";

/**
 * 006 decision 8: a git value, or undefined when git or the repository is
 * absent (a copy with no .git, a build image without git), so the build
 * never fails on it.
 */
function git(args: string): string | undefined {
  try {
    const out = execSync(`git ${args}`, {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return out || undefined;
  } catch {
    return undefined;
  }
}

// The footer's commit: a CI build's variable, else the short hash. With
// neither, the version name is left to SvelteKit's default, a timestamp,
// which the footer reads as "no commit" (all digits): no row, no word. The
// commit's own date, so a rebuild of one commit is byte-identical; it reaches
// the client bundle as import.meta.env.VITE_BUILT_AT.
const name =
  process.env.WORKERS_CI_COMMIT_SHA?.slice(0, 7) ??
  git("rev-parse --short HEAD");
const builtAt = git("log -1 --format=%cI");
if (builtAt) process.env.VITE_BUILT_AT = builtAt;

export default defineConfig({
  plugins: [
    registryWatch(),
    // 020 decision 10: the host's _redirects, answered in dev and preview.
    redirects(),
    tailwindcss(),
    sveltekit({
      adapter: adapter(),
      // 015 decision 21: absolute asset paths, so the 404 page, served at any
      // depth by the worker's 404-page handling, loads /_app/ from the root.
      paths: { relative: false },
      // The 404 page is linked from nowhere; the worker serves it for any
      // unknown address.
      prerender: {
        entries: ["*", "/404"],
        // An example view is one example, cut from its component page: a
        // link inside it to an id on that page (#variants) has no target in
        // the view. Every other page must hold the ids it links to.
        // A page's Markdown twin is written after vite build, by
        // scripts/site/markdown.ts; build-output.spec.ts checks every one.
        handleHttpError: ({ path, message }) => {
          if (path.endsWith("/index.md")) return;
          throw new Error(message);
        },
        handleMissingId: ({ path, message }) => {
          if (path.startsWith("/example/")) return;
          throw new Error(message);
        },
      },
      ...(name ? { version: { name } } : {}),
    }),
  ],
});
