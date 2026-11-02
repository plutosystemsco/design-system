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
};

/** A view's URL: `/view/<block>/` or `/view/<block>/<state>/`. */
export function viewPath(block: string, path: string): string {
  return path ? `/view/${block}/${path}/` : `/view/${block}/`;
}
