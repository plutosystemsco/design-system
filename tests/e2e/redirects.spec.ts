/**
 * 020 test 15, decision 10: on the preview, which applies `static/_redirects`
 * through the site's Vite plugin as the host does, each old address answers
 * 301 with its rule's Location. And test 14's half that reads `build/`:
 * nothing is built at an old address.
 */
import { expect, test } from "../test.ts";
import { existsSync } from "node:fs";
import path from "node:path";
import { EXAMPLE_ORDER } from "../../src/lib/site/example-order.ts";

const FIRST = EXAMPLE_ORDER["kuiper-theme"]?.[0] ?? "colours";

const CASES: [from: string, location: string][] = [
  ["/components/pluto-theme", "/components/kuiper-theme/"],
  ["/components/pluto-theme/", "/components/kuiper-theme/"],
  ["/components/pluto-theme/index.md", "/components/kuiper-theme/index.md"],
  ["/example/pluto-theme", "/components/kuiper-theme/"],
  ["/example/pluto-theme/", "/components/kuiper-theme/"],
  [`/example/pluto-theme/${FIRST}/`, `/example/kuiper-theme/${FIRST}/`],
];

test.describe("020 test 15: the old theme addresses redirect", () => {
  for (const [from, location] of CASES) {
    test(`${from} answers 301 to ${location}`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(response.headers()["location"]).toBe(location);
      // A Markdown twin is written into build/ after vite build, and the
      // preview serves pages only, so the twin is found on disk.
      if (location.endsWith(".md"))
        expect(existsSync(path.join("build", location))).toBe(true);
      else expect((await request.get(location)).status()).toBe(200);
    });
  }

  test("a bookmark to /components/pluto-theme/#fields lands on the new page's section, in view", async ({
    page,
  }) => {
    await page.goto("/components/pluto-theme/#fields");
    await expect(page).toHaveURL(/\/components\/kuiper-theme\/#fields$/);
    await expect(page.locator('[id="fields"]')).toBeInViewport();
  });
});

test.describe("020 test 14: nothing is built at an old address", () => {
  test("build/ holds no components/pluto-theme/ and no example/pluto-theme/", () => {
    expect(existsSync("build/components/kuiper-theme/index.html")).toBe(true);
    expect(existsSync("build/components/pluto-theme")).toBe(false);
    expect(existsSync("build/example/pluto-theme")).toBe(false);
  });
});
