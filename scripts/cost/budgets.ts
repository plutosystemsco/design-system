/**
 * 025 decision 15: the budgets, `scripts/cost/budgets.json`, and the checks
 * the gate runs against them. A budget rises only by a recorded ruling; it
 * may fall freely.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { COST_DIR } from "./items.ts";
import type { CaseEntry, Entry, Report } from "./report.ts";
import { SETTINGS } from "./settings.ts";

export const BUDGETS_PATH = path.join(COST_DIR, "budgets.json");

/** A rise, recorded where the raised number lives. Append-only. */
export type Raised = {
  metric: string;
  from: number;
  to: number;
  date: string;
  /** A link to the landing notes of the specification that raised it. */
  ruling: string;
};

export type CaseBudget = {
  hydrateMs: number;
  interactionMs?: number;
  raised?: Raised[];
};

export type ItemBudget = {
  js: number;
  css: number;
  lazy: number;
  assets: number;
  hydrateMs: number;
  interactionMs?: number;
  cases?: Record<string, CaseBudget>;
  raised?: Raised[];
};

export type Budgets = {
  /** The release machine's model string. */
  machine: string;
  /** The committed instrument values (decision 12). Not budgets. */
  instrument: { floorHydrateMs: number; noopMs: number };
  items: Record<string, ItemBudget>;
};

export function readBudgets(file = BUDGETS_PATH): Budgets {
  return JSON.parse(readFileSync(file, "utf8"));
}

export const SIZE_METRICS = ["js", "css", "lazy", "assets"] as const;
type Metric = (typeof SIZE_METRICS)[number] | "hydrateMs" | "interactionMs";

/** A first budget: the measured figure plus decision 15's margin, rounded up. */
export function firstBudget(metric: Metric, measured: number): number {
  const m =
    metric === "hydrateMs" || metric === "interactionMs"
      ? SETTINGS.margins[metric]
      : SETTINGS.margins.size;
  // A figure measured below zero (an item that removes a byte of the floor,
  // or hydration within noise) takes its margin from zero.
  const base = Math.max(0, measured);
  const raw = base + Math.max(base * m.ratio, m.min);
  return Math.ceil(raw / m.step) * m.step;
}

/** The figures an entry has, by budget metric. */
function figures(
  e: CaseEntry | Entry,
  isCase: boolean,
): Partial<Record<Metric, number>> {
  const out: Partial<Record<Metric, number>> = {};
  if (!isCase) for (const m of SIZE_METRICS) out[m] = e.size[m];
  out.hydrateMs = e.hydrate.ms;
  if (e.interaction) out.interactionMs = e.interaction.ms;
  return out;
}

/** Every entry of a report: items and cases, keyed `<item>` and `<item>.<case>`. */
function entries(report: Report) {
  return Object.entries(report.items).flatMap(([name, e]) => [
    { key: name, entry: e as CaseEntry | Entry, isCase: false },
    ...Object.entries(e.cases).map(([k, c]) => ({
      key: `${name}.${k}`,
      entry: c,
      isCase: true,
    })),
  ]);
}

function budgetOf(
  budgets: Budgets,
  key: string,
): ItemBudget | CaseBudget | undefined {
  const [item, kase] = key.split(".") as [string, string | undefined];
  const b = budgets.items[item];
  return kase ? b?.cases?.[kase] : b;
}

/**
 * Every figure over its budget, as "<item> <metric>: <figure> over <budget>".
 * Sizes and hydration are held everywhere. A response time is held to the
 * 200 ms ceiling always, and to its budget only when its run is on the
 * release machine and not noisy (decisions 12 and 15).
 */
export function overBudget(report: Report, budgets: Budgets): string[] {
  const out: string[] = [];
  for (const { key, entry, isCase } of entries(report)) {
    const b = budgetOf(budgets, key) as Record<string, number> | undefined;
    const run = report.runs[entry.run];
    for (const [metric, value] of Object.entries(figures(entry, isCase))) {
      if (metric === "interactionMs") {
        if (value > SETTINGS.ceilingMs)
          out.push(
            `${key} interactionMs: ${value} over the ${SETTINGS.ceilingMs} ms ceiling`,
          );
        const held =
          run !== undefined &&
          run.machine.model === budgets.machine &&
          !run.noisy;
        if (!held) continue;
      }
      const budget = b?.[metric];
      if (typeof budget === "number" && value > budget)
        out.push(`${key} ${metric}: ${value} over ${budget}`);
    }
  }
  return out;
}

/** Every budget an entry lacks for a figure it has, and every budget for a figure it lacks. */
export function missingBudgets(report: Report, budgets: Budgets): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const { key, entry, isCase } of entries(report)) {
    seen.add(key);
    const b = (budgetOf(budgets, key) ?? {}) as Record<string, unknown>;
    const has = figures(entry, isCase);
    for (const metric of Object.keys(has))
      if (typeof b[metric] !== "number")
        out.push(`${key}: no ${metric} budget`);
    for (const metric of [...SIZE_METRICS, "hydrateMs", "interactionMs"])
      if (!(metric in has) && metric in b)
        out.push(`${key}: a ${metric} budget for a figure it lacks`);
  }
  for (const [item, b] of Object.entries(budgets.items)) {
    if (!seen.has(item)) out.push(`${item}: a budget for an item not measured`);
    for (const k of Object.keys(b.cases ?? {}))
      if (!seen.has(`${item}.${k}`))
        out.push(`${item}.${k}: a budget for a case not measured`);
  }
  return out;
}

/** Each budget number in a version, keyed `<item>.<metric>` or `<item>.<case>.<metric>`. */
function numbers(budgets: Budgets): Map<string, number> {
  const out = new Map<string, number>();
  for (const [item, b] of Object.entries(budgets.items ?? {})) {
    for (const [metric, v] of Object.entries(b))
      if (typeof v === "number") out.set(`${item}\t\t${metric}`, v);
    for (const [k, c] of Object.entries(b.cases ?? {}))
      for (const [metric, v] of Object.entries(c))
        if (typeof v === "number") out.set(`${item}\t${k}\t${metric}`, v);
  }
  return out;
}

function raisedOf(budgets: Budgets, item: string, kase: string) {
  const b = budgets.items?.[item];
  return (kase ? b?.cases?.[kase]?.raised : b?.raised) ?? [];
}

/** The text of a specification's "Landing notes" section, or null. */
function landingNotes(text: string): string | null {
  const at = text.search(/^## Landing notes\s*$/m);
  if (at === -1) return null;
  const rest = text.slice(at);
  const next = rest.slice(1).search(/^## /m);
  return next === -1 ? rest : rest.slice(0, next + 1);
}

/**
 * Criterion 7. `versions` is budgets.json's history, oldest first, then the
 * working tree; `readSpec` returns a specification's text by its link, or
 * null. Each number is compared with its value in the last earlier version
 * in which its key existed. Every rise needs a `raised` record with that
 * metric and those two numbers, whose ruling links a specification whose
 * Landing notes name the item. No record is removed or changed.
 */
export function checkRulings(
  versions: { label: string; budgets: Budgets }[],
  readSpec: (link: string) => string | null,
): string[] {
  const out: string[] = [];
  const last = new Map<string, number>();
  let previous: Budgets | null = null;
  for (const { label, budgets } of versions) {
    for (const [key, value] of numbers(budgets)) {
      const [item, kase, metric] = key.split("\t") as [string, string, string];
      const name = kase ? `${item}.${kase}` : item;
      const before = last.get(key);
      if (before !== undefined && value > before) {
        const record = raisedOf(budgets, item, kase).find(
          (r) => r.metric === metric && r.from === before && r.to === value,
        );
        if (!record)
          out.push(
            `${label}: ${name} ${metric} rose from ${before} to ${value} with no raised record`,
          );
      }
      last.set(key, value);
    }
    for (const [item, b] of Object.entries(budgets.items ?? {})) {
      const lists: [string, Raised[]][] = [
        ["", b.raised ?? []],
        ...Object.entries(b.cases ?? {}).map(
          ([k, c]) => [k, c.raised ?? []] as [string, Raised[]],
        ),
      ];
      for (const [kase, list] of lists) {
        const name = kase ? `${item}.${kase}` : item;
        for (const r of list) {
          const text = readSpec(r.ruling);
          const notes = text && landingNotes(text);
          if (!notes || !notes.includes(item))
            out.push(
              `${label}: ${name}'s ${r.metric} ruling ${r.ruling} is not a specification whose Landing notes name ${item}`,
            );
          else if (
            r.metric === "interactionMs" &&
            r.to > SETTINGS.ceilingMs &&
            !notes
              .split(/\n\s*\n/)
              .some((p) => p.includes("the owner") && p.includes(item))
          )
            out.push(
              `${label}: ${name}'s interactionMs over ${SETTINGS.ceilingMs} needs a Landing notes paragraph naming it and "the owner"`,
            );
        }
        if (previous) {
          const was = raisedOf(previous, item, kase);
          const kept = was.every(
            (r, i) => JSON.stringify(r) === JSON.stringify(list[i]),
          );
          if (!kept)
            out.push(
              `${label}: a raised record of ${name} was removed or changed`,
            );
        }
      }
    }
    if (previous)
      for (const [item, b] of Object.entries(previous.items ?? {}))
        if (!budgets.items?.[item] && (b.raised?.length ?? 0) > 0)
          out.push(
            `${label}: a raised record of ${item} was removed or changed`,
          );
    previous = budgets;
  }
  return out;
}
