import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { registryWatch } from "./scripts/registry-watch.ts";

export default defineConfig({
  plugins: [registryWatch(), tailwindcss(), sveltekit({ adapter: adapter() })],
});
