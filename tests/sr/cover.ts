/**
 * 022q decision 3: the cover `Sr.open()` lays over the page while guidepup's
 * `navigateToWebContent()` runs. Under NVDA that helper clicks the centre
 * of `<body>`, and on a narrow page the click can land on a link and leave
 * the page (the memo §3: `/view/app-shell/` at 360 px went to `/`).
 *
 * The cover is a `div` appended to `<body>` (Playwright's `body` click
 * checks that what it hits is `body` or inside it), fixed over the whole
 * viewport at the top `z-index`, transparent, `aria-hidden`, and with no
 * tab stop. A click listener records each hit.
 *
 * Both functions run in the page, through `page.evaluate`, so each stands
 * alone. This file imports nothing: `tests/e2e/sr-cover.spec.ts` checks the
 * same cover in every engine without loading a reader.
 */

/** Lay the cover. Run in the page. */
export function layCover(): void {
  document.querySelector("[data-sr-cover]")?.remove();
  const cover = document.createElement("div");
  cover.setAttribute("data-sr-cover", "");
  cover.setAttribute("aria-hidden", "true");
  cover.style.cssText = [
    "position: fixed",
    "inset: 0",
    "z-index: 2147483647",
    "background: transparent",
  ].join(";");
  cover.dataset.hits = "0";
  cover.addEventListener("click", () => {
    cover.dataset.hits = String(Number(cover.dataset.hits) + 1);
  });
  document.body.append(cover);
}

/** Lift the cover. Run in the page. True if it took a click. */
export function liftCover(): boolean {
  const cover = document.querySelector<HTMLElement>("[data-sr-cover]");
  if (!cover) return false;
  const hit = Number(cover.dataset.hits) > 0;
  cover.remove();
  return hit;
}
