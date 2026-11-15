import adapter from "@sveltejs/adapter-node";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// 013 decision 21: the kit3 fixture on adapter-node, so a route renders per
// request on a production install.
export default defineConfig({
  plugins: [tailwindcss(), sveltekit({ adapter: adapter() })],
});
