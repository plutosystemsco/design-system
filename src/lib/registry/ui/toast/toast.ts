/**
 * The app's `toast` function. One queue for the document, created on the
 * first call in a browser; on the server every call returns "" and does
 * nothing, so no state is ever shared between requests. Mount one
 * `<Toaster />` in the root layout to draw and speak what it holds.
 */
import {
  createToastQueue,
  type PromiseMessages,
  type ToastKind,
  type ToastOptions,
  type ToastQueue,
} from "./toast-queue.js";

let queue: ToastQueue | undefined;

/** The document's queue, created on first use; undefined on the server. */
export function toastQueue(): ToastQueue | undefined {
  if (typeof document === "undefined") return undefined;
  queue ??= createToastQueue({
    now: () => Date.now(),
    setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
    clearTimeout: (handle) =>
      globalThis.clearTimeout(handle as ReturnType<typeof setTimeout>),
    frame: (fn) =>
      typeof requestAnimationFrame === "function"
        ? void requestAnimationFrame(() => fn())
        : void globalThis.setTimeout(fn, 16),
    warn: (message) => {
      if (import.meta.env?.DEV) console.warn(message);
    },
  });
  return queue;
}

const raise =
  (kind: ToastKind) =>
  (title: string, options?: ToastOptions): string =>
    toastQueue()?.raise(kind, title, options) ?? "";

/**
 * Raises a toast and returns its id: `toast("Sent")` is info. Success and
 * info leave after at least 6 s; errors, cautions, loading toasts and any
 * toast with an action wait to be dismissed. Text only.
 */
export const toast = Object.assign(raise("info"), {
  /** A neutral message that leaves on its own, after at least 6 s. */
  info: raise("info"),
  /** A result that leaves on its own, after at least 6 s. Spoken as "Success: …". */
  success: raise("success"),
  /** A warning that waits to be dismissed. Spoken as "Warning: …". */
  caution: raise("caution"),
  /** An error that waits to be dismissed, and interrupts the reader. Spoken as "Error: …". */
  error: raise("error"),
  /** A job in progress, which waits. Its own updates by `id` are not spoken. */
  loading: raise("loading"),
  /**
   * A loading toast for `promise`, shown only if it takes over 400 ms, then
   * its result in the same place. Returns the id; the app's own `catch` still runs.
   */
  promise: <T>(
    promise: Promise<T>,
    messages: PromiseMessages<T>,
    options?: Omit<ToastOptions, "duration">,
  ): string => toastQueue()?.promise(promise, messages, options) ?? "",
  /** Closes the toast with `id`, or every toast. */
  dismiss: (id?: string): void => toastQueue()?.dismiss(id, "api"),
  /** Call in `beforeNavigate`: speech waits for the next page's title. */
  navigating: (): void => toastQueue()?.navigating(),
  /** Call in `afterNavigate`: speech resumes, and a success or info toast that survived one navigation closes. */
  navigated: (): void => toastQueue()?.navigated(),
});

/** The same `toast`, as a default export, so the item's index can name its file. */
export default toast;
