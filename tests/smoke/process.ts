/**
 * Process helpers for the smoke tests. Every tool is spawned under Bun with
 * `--bun` in its argv (001 decision 1): a child of `bun test` runs under Node
 * otherwise.
 */
import { setTimeout as sleep } from "node:timers/promises";

export type Result = { code: number; output: string };

/** Runs a command to completion and returns its exit code and combined output. */
export async function run(
  cmd: string[],
  cwd: string,
  env: Record<string, string> = {},
): Promise<Result> {
  const child = Bun.spawn(cmd, {
    cwd,
    env: { ...process.env, ...env },
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { code, output: `${stdout}\n${stderr}` };
}

/** Runs a package's bin under Bun: `[bun, --bun, <dir>/node_modules/.bin/<bin>, ...args]`. */
export function bin(dir: string, name: string, ...args: string[]): string[] {
  return [
    process.execPath,
    "--bun",
    `${dir}/node_modules/.bin/${name}`,
    ...args,
  ];
}

/** A free TCP port on localhost. */
export function freePort(): number {
  const server = Bun.listen({
    hostname: "127.0.0.1",
    port: 0,
    socket: { data() {} },
  });
  const port = server.port;
  server.stop(true);
  return port;
}

/** A dev server started by `startDevServer`: the child and where it logs. */
export type DevServer = ReturnType<typeof Bun.spawn> & { log: string };

/** Starts `vite dev` in `dir` on `port`, logging to `log` and `log.err`. */
export function startDevServer(dir: string, port: number, log: string) {
  const child = Bun.spawn(
    bin(dir, "vite", "dev", "--port", String(port), "--strictPort"),
    {
      cwd: dir,
      env: { ...process.env },
      stdin: "ignore",
      stdout: Bun.file(log),
      stderr: Bun.file(`${log}.err`),
    },
  );
  return Object.assign(child, { log }) as DevServer;
}

/** Each request in the poll gets this long; a connection the server accepts but never answers must not stall the poll. */
const REQUEST_TIMEOUT_MS = 2_000;

/**
 * Polls `url` until it answers 200, or throws after `ms`. With `server`, it
 * also throws as soon as the server exits, and every error carries the
 * server's log.
 */
export async function waitFor200(
  url: string,
  ms: number,
  server?: DevServer,
): Promise<void> {
  const deadline = Date.now() + ms;
  let last = "";
  while (Date.now() < deadline) {
    if (server && server.exitCode !== null) {
      throw new Error(
        `vite dev exited ${server.exitCode} before ${url} answered\n${await logs(server)}`,
      );
    }
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (response.status === 200) return;
      last = `status ${response.status}`;
    } catch (error) {
      last =
        error instanceof Error
          ? `${error.name}: ${error.message}`
          : String(error);
    }
    await sleep(250);
  }
  throw new Error(
    `${url} did not answer 200 within ${ms} ms (last: ${last})${server ? `\n${await logs(server)}` : ""}`,
  );
}

async function logs(server: DevServer): Promise<string> {
  const read = async (file: string) =>
    (await Bun.file(file).exists()) ? await Bun.file(file).text() : "";
  return `--- vite dev log\n${await read(server.log)}--- vite dev stderr\n${await read(`${server.log}.err`)}`;
}

/** Polls `check` until it returns true, or returns false after `ms`. */
export async function until(
  check: () => boolean,
  ms: number,
): Promise<boolean> {
  const deadline = Date.now() + ms;
  while (Date.now() < deadline) {
    if (check()) return true;
    await sleep(100);
  }
  return check();
}
