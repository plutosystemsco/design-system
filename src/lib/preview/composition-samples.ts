/**
 * The compositions' views share the product home's sample copy (010
 * decision 9): every claim true of the open platform the suite is built on.
 * The run functions are stand-ins for an app's server; each resolves or
 * rejects after a fixed 900 ms.
 */
export const INSTALL = "pip install git+https://github.com/ClayGendron/vfs";
export const SEARCH = `db = DatabaseStorage(url=DATABASE_URL)
fs = VirtualFileSystem(storage=db)
result = await fs.grep("renewal")
for path in result.paths: print(path)`;
export const PATHS = ["/contracts/acme-msa.md", "/contracts/globex-renewal.md"];
export const FAILURE =
  "Could not reach the sandbox. Check the connection and run it again.";

/** Resolves to `value` after 900 ms. */
export function after<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 900));
}

/** Rejects with the sample failure after 900 ms. */
export function fail<T>(): Promise<T> {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error(FAILURE)), 900),
  );
}

export const PROOF = [
  { value: 4, label: "search verbs: glob, grep, glean and graph" },
  { value: 1, label: "namespace for every file and row" },
  { value: 0, label: "new databases to run: it mounts the one you have" },
];
export const EXAMPLES = [
  { label: "Find renewals", command: 'await fs.grep("renewal")' },
  {
    label: "Ask a question",
    command: 'await fs.glean("do renewals auto-renew?", limit=3)',
  },
];
export const RESULT = {
  meters: [
    { label: "files searched", value: 12, max: 12 },
    { label: "permission checks", value: 12, max: 12 },
    { label: "results", value: 2, max: 12 },
  ],
  lines: PATHS,
};
export const NAMES = ["docs", "sheets", "mail", "search"];
