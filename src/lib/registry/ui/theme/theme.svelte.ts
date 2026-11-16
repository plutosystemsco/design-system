/**
 * The theme store. `preference` is what the person chose:
 * `light`, `dark`, or `system` (no choice made; the operating system's
 * preference is followed and can change under the page). `resolved` is the
 * theme in force. The key is `kuiper-theme`: written on a choice, removed for
 * `system`. `theme-script.svelte` reads the same key before first paint and
 * must agree with `readStoredTheme` in `stored.ts`.
 */
import { MediaQuery } from "svelte/reactivity";
import { readStoredTheme, THEME_KEY } from "./stored.js";

export { THEME_KEY };

/**
 * What the person chose: `light`, `dark`, or `system` to follow the operating
 * system.
 */
export type ThemePreference = "light" | "dark" | "system";
/** The theme in force, once `system` is resolved. */
export type ResolvedTheme = "light" | "dark";

const browser = typeof document !== "undefined";

/** The stored choice, else `system`. Storage may be unavailable. */
function read(): ThemePreference {
  if (!browser) return "system";
  let storage: Storage;
  try {
    storage = localStorage;
  } catch {
    // No storage: follow the system.
    return "system";
  }
  return readStoredTheme(storage) ?? "system";
}

class Theme {
  // Read once, when the module first runs in the browser; `system` on the server.
  #preference: ThemePreference = $state(read());
  // The server's MediaQuery is a stub whose value is the fallback, so
  // `resolved` is `light` there and nothing is written.
  #system = new MediaQuery("(prefers-color-scheme: dark)", false);

  constructor() {
    if (!browser) return;
    // Outside a component, so the effect needs a root of its own. It lives
    // for the page: the theme has no end.
    $effect.root(() => {
      $effect(() => {
        document.documentElement.classList.toggle(
          "dark",
          this.resolved === "dark",
        );
      });
      const onStorage = (event: StorageEvent) => {
        if (event.key === null || event.key === THEME_KEY)
          this.#preference = read();
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    });
  }

  /** The person's choice, or `system`. */
  get preference(): ThemePreference {
    return this.#preference;
  }

  /** The theme in force: the preference, or the system's while it is `system`. */
  get resolved(): ResolvedTheme {
    if (this.#preference !== "system") return this.#preference;
    return this.#system.current ? "dark" : "light";
  }

  /** Sets the preference and stores it; `system` removes the key. */
  set(preference: ThemePreference): void {
    this.#preference = preference;
    if (!browser) return;
    try {
      if (preference === "system") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, preference);
    } catch {
      // No storage: the choice holds for this page.
    }
  }

  /** Chooses the opposite of what is in force. */
  toggle(): void {
    this.set(this.resolved === "dark" ? "light" : "dark");
  }
}

/**
 * The app's one theme store: read `preference` and `resolved`, call `set` or
 * `toggle`.
 */
export const theme = new Theme();
