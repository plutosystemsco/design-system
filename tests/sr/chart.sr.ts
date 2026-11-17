/**
 * 022 decision 12: `chart`. Its marks are invisible to assistive
 * technology; the figure's name and its table are what a reader gets, and
 * layerchart's pointer tooltip is the pointer's affordance only.
 *
 * C1: from the element before the figure, within 25 `next()` steps, the
 * figure's name, the table's caption and its first column header are
 * spoken whole, in that order. C2: none of the tooltip's texts (the series
 * label with its value, as the tooltip formats it) is spoken in those steps
 * before the first header (022x: the table's cells, which VoiceOver reads
 * with their column header, say the same words).
 *
 * 022q decision 6: 25 steps, room for the name, `004`'s fourteen tick
 * labels (a layerchart figure exposes its ticks and nothing else), the
 * caption and a header. 25 VoiceOver steps take 4.2 to 5.8 minutes, past
 * the suite's 5-minute timeout, so this file's test has its own timeout
 * and runs once, with no retry: an exception to 022 decision 10, which
 * keeps shard 1 inside its 40-minute deadline. A failed C1 is read from its
 * phrases, which the walk records whole.
 *
 * 022ad amends decision 6's 7 minutes to 8: a recovered restart of
 * VoiceOver in `open()` costs about 85 s before the walk begins, and the
 * walk's 5.8 must still fit. Shard 1 ran 29.5 of its 40 minutes in run 7.
 *
 * The example's table has no `<caption>`: its disclosure's summary, "Show
 * as table", names it, so that is the caption the rule reads. The
 * disclosure is opened by test code first, so the table is in the walk.
 */
import { declared, test } from "./fixtures.ts";
import { C1, C2 } from "./rules.ts";

test.describe.configure({ retries: 0, timeout: 8 * 60_000 });

const STEPS = 25;

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
    const steps = await sr.steps(STEPS);
    const order = [FIGURE, CAPTION, FIRST_HEADER];
    await sr.judge(C1(steps, order), C2(steps, TOOLTIPS, order));
  },
);
