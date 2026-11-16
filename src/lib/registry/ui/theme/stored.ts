/**
 * The stored choice, read once. The key is `kuiper-theme`. Before 0.13.0 it
 * was `pluto-theme`: a `light` or `dark` found there, with no valid choice
 * under the new key, is carried over to it. The old key is then removed in
 * every case, so it is read at most once. The carry-over goes in 0.14.0.
 *
 * `theme-script.svelte`'s head script repeats these steps before first
 * paint, and the two must agree. Imports nothing, so it runs anywhere.
 */

/** The `localStorage` key the store writes and the head script reads. */
export const THEME_KEY = "kuiper-theme";

/** The key before 0.13.0. Read once and removed; it goes in 0.14.0. */
export const OLD_THEME_KEY = "pluto-theme";

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const valid = (value: string | null): value is "light" | "dark" =>
  value === "light" || value === "dark";

/**
 * The stored choice, `light` or `dark`, else null (follow the system). Any
 * storage call may throw, as with storage off; then there is no choice.
 */
export function readStoredTheme(storage: Store): "light" | "dark" | null {
  let choice: "light" | "dark" | null = null;
  try {
    const stored = storage.getItem(THEME_KEY);
    if (valid(stored)) choice = stored;
    else {
      const old = storage.getItem(OLD_THEME_KEY);
      if (valid(old)) {
        storage.setItem(THEME_KEY, old);
        choice = old;
      }
    }
    storage.removeItem(OLD_THEME_KEY);
  } catch {
    // No storage: follow the system.
  }
  return choice;
}
