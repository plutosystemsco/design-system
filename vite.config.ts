import { execSync } from "node:child_process";
import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { registryWatch } from "./scripts/registry-watch.ts";

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

// The footer's commit: the host's variable, else the short hash. With
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
    tailwindcss(),
    sveltekit({ adapter: adapter(), ...(name ? { version: { name } } : {}) }),
  ],
});
