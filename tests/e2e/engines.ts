/**
 * 022 decision 3: the only three ways a browser test may skip by engine or
 * project. Each skips where the test does not apply, with a reason, and each
 * call is listed in `ENGINE_ONLY` (`engine-only.ts`). A call with no entry
 * throws, so an exception the suite cannot count never runs.
 *
 * Try the engine-neutral API first: `page.emulateMedia({ forcedColors })`
 * replaces CDP for forced colours, for example.
 *
 * Call a helper inside a test's body to skip that test, or in a `describe`
 * (or at the top of a file) to skip every test under it.
 */
import type { TestInfo } from "@playwright/test";
import path from "node:path";
import { test } from "../test.ts";
import {
  ENGINE_ONLY,
  type Engine,
  type EngineOnly,
  type Platform,
} from "./engine-only.ts";
import { projectLabel } from "./scheme.ts";

export type { Engine, Platform };

/**
 * 022o: `onlyIn` and `adaptsIn` take a platform where an engine's default
 * differs by system, such as WebKit's focus on click: on macOS a click
 * focuses no button; on Linux it does, as in Chromium. The worker runs on
 * the browser's system, so `process.platform` is the browser's.
 */
const onPlatform = (platform?: Platform) =>
  !platform || process.platform === platform;

function current(): TestInfo | null {
  try {
    return test.info();
  } catch {
    return null;
  }
}

function engineOf(info: TestInfo): Engine {
  return (info.project.use.defaultBrowserType ??
    info.project.use.browserName ??
    "chromium") as Engine;
}

function requireListed(
  info: TestInfo,
  helper: EngineOnly["helper"],
  arg: Engine | string[],
  reason: string,
  platform?: Platform,
): void {
  const file = path
    .relative(info.project.testDir, info.file)
    .split(path.sep)
    .join("/");
  const want = JSON.stringify(arg);
  const hit = ENGINE_ONLY.some(
    (e) =>
      e.file === file &&
      e.helper === helper &&
      JSON.stringify(helper === "onlyProjects" ? e.projects : e.engine) ===
        want &&
      e.reason === reason &&
      e.platform === platform,
  );
  if (!hit)
    throw new Error(
      `${helper}(${want}, ${JSON.stringify(reason)}${platform ? `, ${JSON.stringify(platform)}` : ""}) in ${file} has no entry in ENGINE_ONLY (tests/e2e/engine-only.ts)`,
    );
}

function skipUnless(
  helper: EngineOnly["helper"],
  arg: Engine | string[],
  reason: string,
  applies: (info: TestInfo) => boolean,
  platform?: Platform,
): void {
  const run = (info: TestInfo) => {
    requireListed(info, helper, arg, reason, platform);
    test.skip(!applies(info), reason);
  };
  const info = current();
  if (info) run(info);
  else test.beforeEach(({}, info) => run(info));
}

/**
 * The test runs in `engine` only, and with `platform`, on that system only.
 * `reason` names the API the others lack.
 */
export function onlyIn(
  engine: Engine,
  reason: string,
  platform?: Platform,
): void {
  skipUnless(
    "onlyIn",
    engine,
    reason,
    (i) => engineOf(i) === engine && onPlatform(platform),
    platform,
  );
}

/** The test runs in every engine but `engine`. `reason` names what it lacks. */
export function notIn(engine: Engine, reason: string): void {
  skipUnless("notIn", engine, reason, (i) => engineOf(i) !== engine);
}

/**
 * 022's review, finding 10: the test runs in every engine, but in `engine`
 * it checks less, or another way (`reason` says how). It never skips. It
 * is listed in `ENGINE_ONLY` like the others, and in that engine the test
 * carries an `adapts` annotation, so `030` reads its pass as partial there.
 * With `platform`, only that engine on that system (`022o`). Returns
 * whether the test is running there. Call it in the body.
 */
export function adaptsIn(
  engine: Engine,
  reason: string,
  platform?: Platform,
): boolean {
  const info = test.info();
  requireListed(info, "adaptsIn", engine, reason, platform);
  const here = engineOf(info) === engine && onPlatform(platform);
  if (here) info.annotations.push({ type: "adapts", description: reason });
  return here;
}

/** The test runs only in the named projects, for a skip by scheme or project. */
export function onlyProjects(projects: string[], reason: string): void {
  skipUnless("onlyProjects", projects, reason, (i) =>
    projects.includes(projectLabel(i)),
  );
}
