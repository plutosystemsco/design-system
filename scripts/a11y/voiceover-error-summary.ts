/**
 * 019 decision 12: what VoiceOver says when the error summary appears, and
 * when each of its links is followed. It drives VoiceOver on macOS through
 * `@guidepup/guidepup` and a headed Chromium through Playwright, and writes
 * the spoken-phrase log of each step to stdout.
 *
 * It is not part of `bun run test`. It needs macOS, VoiceOver and a visible
 * browser, and it takes over the machine's speech. It needs two settings on
 * the machine that runs it: VoiceOver's "Allow VoiceOver to be controlled
 * with AppleScript", and accessibility permission for the terminal. The owner
 * sets them and starts the script; no agent does either.
 *
 *   bun run build && bun --bun vite preview --port 4173
 *   bun scripts/a11y/voiceover-error-summary.ts [http://localhost:4173]
 *
 * The pass rule, for the insertion and for the second submit: the title is
 * spoken at least once; every error message is spoken at least once, whole;
 * and the title is not read twice in a row. The script exits 1 if either
 * step fails it.
 */
import { voiceOver } from "@guidepup/guidepup";
import { chromium, type Page } from "@playwright/test";

const BASE = process.argv[2] ?? "http://localhost:4173";
const PATH = "/components/error-summary/";
const TITLE = "There is a problem";
const ERRORS = [
  "Enter a project name",
  "Enter the owner's email address",
  "Choose who can see the project",
];
/** How long VoiceOver is given to finish speaking after each step. */
const SETTLE_MS = 6000;

type Step = { name: string; phrases: string[] };

async function settle(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
  return voiceOver.spokenPhraseLog();
}

/** The pass rule of decision 12, for one step's phrases. */
function judge(phrases: string[]): string[] {
  const faults: string[] = [];
  if (!phrases.some((p) => p.includes(TITLE)))
    faults.push(`the title "${TITLE}" was not spoken`);
  for (const message of ERRORS)
    if (!phrases.some((p) => p.includes(message)))
      faults.push(`"${message}" was not spoken whole`);
  for (let i = 1; i < phrases.length; i++)
    if (phrases[i - 1]!.includes(TITLE) && phrases[i]!.includes(TITLE))
      faults.push(
        `the title was read twice in a row (phrases ${i} and ${i + 1})`,
      );
  return faults;
}

async function submit(page: Page): Promise<void> {
  const fixture = page.getByTestId("keyboard-fixture");
  await fixture.getByRole("button", { name: "Create project" }).focus();
  await page.keyboard.press("Enter");
}

const steps: Step[] = [];
const browser = await chromium.launch({ headless: false });
let failed = false;
try {
  await voiceOver.start();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  await page.goto(new URL(PATH, BASE).href);
  await page.locator("button[aria-pressed][data-ready]").first().waitFor();
  await page.bringToFront();

  // The insertion: an empty submit.
  await voiceOver.clearSpokenPhraseLog();
  await submit(page);
  steps.push({ name: "the insertion", phrases: await settle() });

  // The second submit, unchanged.
  await voiceOver.clearSpokenPhraseLog();
  await submit(page);
  steps.push({ name: "the second submit", phrases: await settle() });

  // Each link, from the summary.
  const summary = page
    .getByTestId("keyboard-fixture")
    .locator('[data-slot="error-summary"]');
  for (const message of ERRORS) {
    await voiceOver.clearSpokenPhraseLog();
    await summary.getByRole("link", { name: message }).focus();
    await page.keyboard.press("Enter");
    steps.push({ name: `the link "${message}"`, phrases: await settle() });
  }
} finally {
  await voiceOver.stop().catch(() => undefined);
  await browser.close();
}

for (const step of steps) {
  console.log(`\n## ${step.name}`);
  step.phrases.forEach((p, i) => console.log(`${i + 1}. ${p}`));
}
for (const step of steps.slice(0, 2)) {
  const faults = judge(step.phrases);
  console.log(`\n${step.name}: ${faults.length ? "FAIL" : "pass"}`);
  for (const f of faults) console.log(`  - ${f}`);
  if (faults.length) failed = true;
}
process.exit(failed ? 1 : 0);
