/**
 * 025 decision 9: the main interaction of each interactive item, and of each
 * case that has one (keyed `<item>.<case>`). Every field is a string, so an
 * entry's canonical serialisation is exact and the runtime hash sees any
 * change to it.
 *
 * - `target` is a Playwright selector that matches exactly one element.
 * - `state` is a script expression, true once the interaction's work is done.
 *   It may call `__cost.inside(selector)`: true when an element matching the
 *   selector holds the focus.
 * - `key` is the key a `key` entry presses, as Playwright names it.
 * - `prepare` runs in the page before the measure is armed.
 */
export const KINDS = ["click", "key", "hover"] as const;
export const STARTS = [
  "click",
  "pointerdown",
  "keydown",
  "pointerover",
] as const;
export const VERBS = [
  "opens",
  "shows",
  "updates",
  "sends",
  "copies",
  "toggles",
  "selects",
  "expands",
  "focuses",
] as const;

export type Interaction = {
  kind: (typeof KINDS)[number];
  start: (typeof STARTS)[number];
  target: string;
  state: string;
  says: (typeof VERBS)[number];
  viewport: string;
  key?: string;
  prepare?: string;
  note?: string;
};

const DEFAULT = "1280x800";
const TARGET = "[data-cost=target]";
const STATE_IS_1 = `document.querySelector("[data-cost=state]")?.textContent?.trim() === "1"`;
const attr = (name: string, value: string, selector = TARGET) =>
  `document.querySelector(${JSON.stringify(selector)})?.getAttribute(${JSON.stringify(name)}) === ${JSON.stringify(value)}`;
const COPIED = `[...document.querySelectorAll("[role=status]")].some((s) => /copied/i.test(s.textContent ?? ""))`;
const CLIPBOARD =
  "The figure includes the browser's asynchronous clipboard write, run with the clipboard permission granted.";
/** Types a draft into the page's one textarea, as a person would before pressing Enter. */
const DRAFT = `(() => { const t = document.querySelector("textarea"); t.focus(); t.value = "Hello"; t.dispatchEvent(new Event("input", { bubbles: true })); return 0; })()`;

export const INTERACTIONS: Record<string, Interaction> = {
  button: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: STATE_IS_1,
    says: "updates",
    viewport: DEFAULT,
  },
  theme: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `document.documentElement.classList.contains("dark")`,
    says: "toggles",
    viewport: DEFAULT,
  },
  tooltip: {
    kind: "hover",
    start: "pointerover",
    target: TARGET,
    state: `!!document.querySelector("[data-slot=tooltip-content]")?.checkVisibility()`,
    says: "shows",
    viewport: DEFAULT,
    note: "The provider's open delay is 0, its default.",
  },
  toggle: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: attr("aria-pressed", "true"),
    says: "toggles",
    viewport: DEFAULT,
  },
  "toggle-group": {
    kind: "click",
    start: "click",
    target: TARGET,
    state: attr("data-state", "on"),
    says: "selects",
    viewport: DEFAULT,
  },
  tabs: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `${attr("aria-selected", "true")} && !!document.getElementById(document.querySelector("${TARGET}").getAttribute("aria-controls"))?.checkVisibility()`,
    says: "selects",
    viewport: DEFAULT,
  },
  collapsible: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `document.querySelector("[data-slot=collapsible-content]")?.getAttribute("data-state") === "open"`,
    says: "expands",
    viewport: DEFAULT,
  },
  popover: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `__cost.inside("[data-slot=popover-content]")`,
    says: "opens",
    viewport: DEFAULT,
  },
  accordion: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: attr("aria-expanded", "true"),
    says: "expands",
    viewport: DEFAULT,
  },
  "alert-dialog": {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `__cost.inside("[role=alertdialog]")`,
    says: "opens",
    viewport: DEFAULT,
  },
  dialog: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `__cost.inside("[role=dialog]")`,
    says: "opens",
    viewport: DEFAULT,
  },
  sheet: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: `__cost.inside("[role=dialog]")`,
    says: "opens",
    viewport: DEFAULT,
  },
  "dropdown-menu": {
    kind: "click",
    start: "pointerdown",
    target: TARGET,
    state: `__cost.inside("[role=menu]")`,
    says: "opens",
    viewport: DEFAULT,
  },
  "error-summary": {
    kind: "click",
    start: "click",
    target: `[data-slot=error-summary] a`,
    state: `document.activeElement?.id === "cost-name"`,
    says: "focuses",
    viewport: DEFAULT,
  },
  checkbox: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: attr("aria-checked", "true"),
    says: "toggles",
    viewport: DEFAULT,
  },
  "radio-group": {
    kind: "click",
    start: "click",
    target: TARGET,
    state: attr("aria-checked", "true"),
    says: "selects",
    viewport: DEFAULT,
  },
  switch: {
    kind: "click",
    start: "click",
    target: TARGET,
    state: attr("aria-checked", "true"),
    says: "toggles",
    viewport: DEFAULT,
  },
  "input-otp": {
    kind: "key",
    start: "keydown",
    target: "input",
    key: "1",
    state: `document.querySelector("[data-slot=input-otp-slot]")?.textContent?.includes("1") === true`,
    says: "updates",
    viewport: DEFAULT,
  },
  "input-group": {
    kind: "click",
    start: "click",
    target: `role=button[name="Show password"]`,
    state: `document.querySelector("input")?.type === "text"`,
    says: "toggles",
    viewport: DEFAULT,
  },
  "code-block": {
    kind: "click",
    start: "click",
    target: `role=button[name="Copy code"]`,
    state: COPIED,
    says: "copies",
    viewport: DEFAULT,
    note: CLIPBOARD,
  },
  "code-editor": {
    kind: "key",
    start: "keydown",
    target: ".cm-content",
    key: "a",
    state: `document.querySelector(".cm-content")?.textContent?.includes("a") === true`,
    says: "updates",
    viewport: DEFAULT,
  },
  chart: {
    kind: "hover",
    start: "pointerover",
    target: "[data-slot=chart-box] rect.lc-tooltip-rect >> nth=0",
    state: `!!document.querySelector("[data-slot=chart-tooltip]")?.textContent?.includes("Mon")`,
    says: "shows",
    viewport: DEFAULT,
    note: "The target is the first point's hover band, which layerchart lays over the bars.",
  },
  sidebar: {
    kind: "click",
    start: "click",
    target: `role=button[name="Toggle sidebar"]`,
    state: `!!document.querySelector("[data-slot=sidebar][data-state=collapsed]")`,
    says: "toggles",
    viewport: DEFAULT,
  },
  composer: {
    kind: "key",
    start: "keydown",
    target: "textarea",
    key: "Enter",
    prepare: DRAFT,
    state: STATE_IS_1,
    says: "sends",
    viewport: DEFAULT,
  },
  "stage-card": {
    kind: "click",
    start: "click",
    target: `role=button[name="Copy code"]`,
    state: COPIED,
    says: "copies",
    viewport: DEFAULT,
    note: CLIPBOARD,
  },
  "marketing-bar": {
    kind: "click",
    start: "click",
    target: `role=button[name="Menu"]`,
    state: `__cost.inside("[role=dialog]")`,
    says: "opens",
    viewport: "390x844",
    note: "Its block's floor trials run at its viewport too.",
  },
  "live-console": {
    kind: "click",
    start: "click",
    target: `role=tab >> nth=1`,
    state: `document.querySelectorAll("[role=tab]")[1]?.getAttribute("aria-selected") === "true" && !!document.querySelector("[role=tabpanel][data-state=active]")?.textContent?.includes("cost two")`,
    says: "selects",
    viewport: DEFAULT,
  },
  "sign-in": {
    kind: "click",
    start: "click",
    target: `role=button[name="Sign in"]`,
    state: `__cost.inside("[data-slot=error-summary]")`,
    says: "shows",
    viewport: DEFAULT,
  },
  "sign-up": {
    kind: "click",
    start: "click",
    target: `role=button[name="Create account"]`,
    state: `__cost.inside("[data-slot=error-summary]")`,
    says: "shows",
    viewport: DEFAULT,
  },
  settings: {
    kind: "click",
    start: "click",
    target: `role=button[name="Delete account"]`,
    state: `__cost.inside("[role=alertdialog]")`,
    says: "opens",
    viewport: DEFAULT,
  },
  "app-shell": {
    kind: "click",
    start: "click",
    target: `[data-shell=menu-button]`,
    state: `__cost.inside("[data-shell=menu]")`,
    says: "opens",
    viewport: "390x844",
    note: "The block as installed has no user, so no user menu: the phone menu opens the shell's navigation sheet. Its block's floor trials run at its viewport too.",
  },
  chat: {
    kind: "key",
    start: "keydown",
    target: "textarea",
    key: "Enter",
    prepare: DRAFT,
    state: `!!document.querySelector("[role=log]")?.textContent?.includes("Hello")`,
    says: "sends",
    viewport: DEFAULT,
  },
};

/** An entry serialised with its keys sorted: what the runtime hash reads. */
export function canonical(entry: Interaction | undefined): string {
  if (!entry) return "null";
  const sorted = Object.fromEntries(
    Object.entries(entry).sort(([a], [b]) => a.localeCompare(b)),
  );
  return JSON.stringify(sorted);
}
