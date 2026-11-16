/**
 * 022 decision 12: `chart`. Its marks are invisible to assistive
 * technology; the figure's name and its table are what a reader gets, and
 * layerchart's pointer tooltip is the pointer's affordance only.
 *
 * C1: from the element before the figure, within 15 `next()` steps, the
 * figure's name, the table's caption and its first column header are
 * spoken whole, in that order. C2: none of the tooltip's texts (the series
 * label with its value, as the tooltip formats it) is spoken in those steps.
 *
 * The example's table has no `<caption>`: its disclosure's summary, "Show
 * as table", names it, so that is the caption the rule reads. The
 * disclosure is opened by test code first, so the table is in the walk.
 */
import { declared, test } from "./fixtures.ts";
import { C1, C2 } from "./rules.ts";

const PATH = "/example/chart/variants/";
const FIGURE = "Visitors per weekday, last week";
const CAPTION = "Show as table";
const FIRST_HEADER = "Day";
/** The tooltip's rows, as `chart-tooltip.svelte` writes them: label, then value. */
const TOOLTIPS = [412, 538, 497, 561, 433, 188, 164].map(
  (v) => `Visitors ${v}`,
);

test(
  "from before the figure, its name, the table's caption and first header in order; no tooltip text",
  declared("chart", ["C1", "C2"]),
  async ({ page, sr }) => {
    await sr.open(PATH);
    // Test code: open the table, and put focus (and the reader) on the
    // element before the figure, the card's description.
    await sr.after(
      () =>
        page.evaluate(() => {
          const details = document.querySelector<HTMLDetailsElement>(
            '[data-slot="chart-table"]',
          );
          if (details) details.open = true;
          const before = document.querySelector<HTMLElement>(
            '[data-testid="chart-bars"] [data-slot="card-description"]',
          );
          before?.setAttribute("tabindex", "-1");
          before?.focus();
        }),
      "start",
    );
    sr.fact(
      "the table is open",
      await page
        .locator('[data-slot="chart-table"]')
        .evaluate((d) => (d as HTMLDetailsElement).open),
    );
    await sr.focused(
      page.locator('[data-testid="chart-bars"] [data-slot="card-description"]'),
    );
    const steps = await sr.steps(15);
    const c1 = C1(steps, [FIGURE, CAPTION, FIRST_HEADER]);
    await sr.judge(c1, C2(steps, TOOLTIPS, c1.length === 0));
  },
);
