/**
 * `bun run build:registry [--out <dir>]`: builds the registry with the locked
 * local shadcn-svelte CLI, run under Bun (decision 1), into
 * `<out>/r/styles/maia/`, then copies it to `<out>/v<version>/r/styles/maia/`
 * (decision 18). `<out>` is `static` unless `--out` says otherwise.
 *
 * The CLI writes files but deletes none, so it builds into a fresh temporary
 * folder beside `<out>/r/`, which is swapped in only when the CLI exits 0. A
 * removed or renamed item then leaves no stale file behind, and a failed build
 * leaves the last good registry in place for the dev server.
 */
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from "node:fs";
import path from "node:path";

export const STYLE = "maia";

export type BuildRegistryOptions = {
  /** The output folder. Relative paths resolve against `root`. Default `static`. */
  out?: string;
  /** The repository root. Default: the working directory. */
  root?: string;
  /** Print the CLI's output only when it fails. */
  quiet?: boolean;
};

export async function buildRegistry(
  options: BuildRegistryOptions = {},
): Promise<{ out: string }> {
  const root = path.resolve(options.root ?? process.cwd());
  const out = path.resolve(root, options.out ?? "static");
  const version = JSON.parse(
    readFileSync(path.join(root, "package.json"), "utf8"),
  ).version;
  const latest = path.join(out, "r", "styles", STYLE);
  const versioned = path.join(out, `v${version}`, "r", "styles", STYLE);

  mkdirSync(out, { recursive: true });
  const staging = mkdtempSync(path.join(out, ".registry-build-"));
  const fresh = path.join(staging, "maia");
  let output: string;
  try {
    output = await runCli(root, fresh);
    rmSync(latest, { recursive: true, force: true });
    mkdirSync(path.dirname(latest), { recursive: true });
    renameSync(fresh, latest);
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  if (!options.quiet) process.stdout.write(output);

  rmSync(versioned, { recursive: true, force: true });
  mkdirSync(path.dirname(versioned), { recursive: true });
  cpSync(latest, versioned, { recursive: true });
  return { out };
}

/** Runs the locked local CLI under Bun, writing the registry into `output`. Returns its output. */
async function runCli(root: string, output: string): Promise<string> {
  const child = Bun.spawn(
    [
      process.execPath,
      "--bun",
      path.join(root, "node_modules", ".bin", "shadcn-svelte"),
      "registry",
      "build",
      "registry.json",
      "--output",
      output,
    ],
    {
      cwd: root,
      stdout: "pipe",
      stderr: "pipe",
      env: { ...process.env, NO_COLOR: "1" },
    },
  );
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) {
    throw new Error(
      `shadcn-svelte registry build exited ${code}\n${stdout}\n${stderr}`,
    );
  }
  return stdout;
}

function argument(name: string): string | undefined {
  const args = process.argv.slice(2);
  const index = args.indexOf(name);
  if (index !== -1) return args[index + 1];
  const inline = args.find((a) => a.startsWith(`${name}=`));
  return inline?.slice(name.length + 1);
}

if (import.meta.main) {
  try {
    const { out } = await buildRegistry({ out: argument("--out") });
    console.log(
      `build:registry wrote ${path.relative(process.cwd(), out) || "."}`,
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
