/**
 * The views of each block (003 decision 16), in registry order. `path` is the
 * state's folder under `/view/<block>/`, or "" for the page file itself. The
 * viewer and the tests read this list; it imports nothing, so `bun test` and
 * Playwright can import it.
 */
export type BlockView = { path: string; label: string };

export const BLOCK_VIEWS: Record<string, BlockView[]> = {
  hero: [{ path: "", label: "Default" }],
  "sign-in": [
    { path: "", label: "Ready" },
    { path: "errors", label: "Field errors" },
    { path: "credentials", label: "Wrong credentials" },
    { path: "busy", label: "Signing in" },
  ],
  "sign-up": [
    { path: "", label: "Ready" },
    { path: "errors", label: "Field errors" },
    { path: "verify", label: "Code step" },
    { path: "code-error", label: "Wrong code" },
  ],
  "page-states": [
    { path: "", label: "Empty" },
    { path: "loading", label: "Loading" },
    { path: "error", label: "Error" },
    { path: "not-found", label: "Not found" },
    { path: "cannot-show", label: "Cannot be shown" },
  ],
  settings: [
    { path: "", label: "Ready" },
    { path: "errors", label: "Field errors" },
    { path: "saved", label: "Saved" },
    { path: "failed", label: "Callback failed" },
  ],
  // 006 decision 12: the shell's views live under the (shell) group.
  "app-shell": [
    { path: "", label: "Default" },
    { path: "sidebar", label: "Sidebar" },
    { path: "sidebar-icon", label: "Sidebar as icons" },
    { path: "signed-in", label: "Signed in" },
    { path: "lockup", label: "Lockup as logo" },
    { path: "endorsed", label: "Endorsed" },
  ],
  chat: [
    { path: "", label: "Empty" },
    { path: "thread", label: "Thread" },
    { path: "submitted", label: "Submitted" },
    { path: "streaming", label: "Streaming" },
    { path: "stopped", label: "Stopped" },
    { path: "error", label: "Error" },
  ],
  // 010 decision 9: the product's home page, in the (shell) group, since the
  // block renders its own header, main and footer.
  "product-home": [{ path: "", label: "Default" }],
};

/**
 * 010 decision 10: each composition's views, under `/view/compositions/`,
 * in registry order. `path` is the folder under that root; the viewer shows
 * them with `block` set to "compositions". Two hold a state whose scripted
 * run rejects (010 decisions 3 and 7).
 */
export const COMPOSITION_VIEWS: Record<string, BlockView[]> = {
  // 012 decision 8: a stage on each of its five grounds.
  stage: [
    { path: "stage", label: "Default" },
    { path: "stage/grounds", label: "Grounds" },
  ],
  "stage-card": [
    { path: "stage-card", label: "Ready" },
    { path: "stage-card/failing", label: "Run fails" },
  ],
  "marketing-bar": [{ path: "marketing-bar", label: "Default" }],
  // 012 decision 8: the poster title, for launches.
  "stage-hero": [
    { path: "stage-hero", label: "Default" },
    { path: "stage-hero/poster", label: "Poster" },
  ],
  "proof-band": [{ path: "proof-band", label: "Default" }],
  "live-console": [
    { path: "live-console", label: "Ready" },
    { path: "live-console/failing", label: "Run fails" },
  ],
  "name-strip": [{ path: "name-strip", label: "Default" }],
  "cta-band": [{ path: "cta-band", label: "Default" }],
  "marketing-footer": [{ path: "marketing-footer", label: "Default" }],
};

/** The viewer's `block` for a composition: its views live under `/view/compositions/`. */
export const COMPOSITIONS_ROOT = "compositions";

/** A view's URL: `/view/<block>/` or `/view/<block>/<state>/`. */
export function viewPath(block: string, path: string): string {
  return path ? `/view/${block}/${path}/` : `/view/${block}/`;
}
