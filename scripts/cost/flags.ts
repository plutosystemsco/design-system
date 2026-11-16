/**
 * `bun run cost`'s flags, parsed in one place so a unit test can hold them.
 * Not hashed: no flag decides a figure.
 */
export type Flags = {
  full: boolean;
  only: string[] | undefined;
  sizesOnly: boolean;
  out: string | undefined;
  budget: string | undefined;
  tighten: boolean;
  guard: boolean;
  registry: string | undefined;
  keep: boolean;
};

/**
 * Parses `bun run cost`'s arguments. `--full` with `--only` is refused: a run
 * marked full must have measured every item, since `--budget instrument`,
 * `--tighten` and the release check trust it (the change review's finding 4).
 */
export function parseFlags(argv: string[]): Flags {
  const has = (name: string) => argv.includes(name);
  const value = (name: string) => {
    const at = argv.indexOf(name);
    return at === -1 ? undefined : argv[at + 1];
  };
  const only = value("--only")?.split(",").filter(Boolean);
  if (has("--full") && only)
    throw new Error(
      "cost: --full measures every item, so it takes no --only. Drop one of the two.",
    );
  return {
    full: has("--full"),
    only,
    sizesOnly: has("--sizes-only"),
    out: value("--out"),
    budget: value("--budget"),
    tighten: has("--tighten"),
    guard: has("--guard"),
    registry: value("--registry"),
    keep: has("--keep"),
  };
}
