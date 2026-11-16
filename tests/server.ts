/**
 * 022 decision 6: the web server both Playwright configs share.
 *
 * It builds the site and serves it with `vite preview`, as before. With
 * `E2E_PREBUILT=1` it only serves: CI builds once, on Linux, and every test
 * job extracts the same `build/` and `.svelte-kit/output/` from the `site`
 * artifact. `vite preview` serves `.svelte-kit/output/`; `build/` is what
 * `build-output.spec.ts` reads.
 *
 * `E2E_PORT` moves the server off 4173 when another checkout on the same
 * machine holds that port. It is never set in CI.
 */
export const PORT = Number(process.env.E2E_PORT ?? 4173);
export const BASE_URL = `http://localhost:${PORT}`;

export function server() {
  const serve = `bun --bun vite preview --port ${PORT} --strictPort`;
  return {
    command: process.env.E2E_PREBUILT ? serve : `bun run build && ${serve}`,
    url: `${BASE_URL}/`,
    reuseExistingServer: false,
    timeout: 180_000,
  };
}
