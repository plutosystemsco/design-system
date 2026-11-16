import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";

// The app has no @types/node, and adds none: Vite runs this config under
// Bun, which has both, so their two uses here are declared by hand.
declare const process: { env: Record<string, string | undefined> };
const fs = "node:fs";
const { writeFileSync } = (await import(fs)) as {
  writeFileSync(file: string, data: string): void;
};

/**
 * 025 decision 2.3: each client chunk's modules and their rendered lengths,
 * written to the file `COST_MODULES` names. The harness keeps that file
 * outside the app, so Tailwind never scans it.
 */
const modules: Plugin = {
  name: "kuiper-cost-modules",
  apply: "build",
  generateBundle(_options, bundle) {
    const out = process.env.COST_MODULES;
    if (!out || this.environment?.name !== "client") return;
    const chunks: Record<string, Record<string, number>> = {};
    for (const [file, chunk] of Object.entries(bundle)) {
      if (chunk.type !== "chunk") continue;
      chunks[file] = Object.fromEntries(
        Object.entries(chunk.modules).map(([id, m]) => [id, m.renderedLength]),
      );
    }
    writeFileSync(out, JSON.stringify(chunks));
  },
};

export default defineConfig({
  plugins: [
    tailwindcss(),
    // A fixed version name, all digits as the default is: the default is
    // the build time, which changes `version.json` on every build, and a
    // name of letters would show in the app shell's footer as a commit.
    sveltekit({ adapter: adapter(), version: { name: "0" } }),
    modules,
  ],
});
