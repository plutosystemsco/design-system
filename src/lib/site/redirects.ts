/**
 * 020 decision 10: the site's redirects. `static/_redirects` holds the same
 * rules in Cloudflare's format, for the host; the preview's Vite plugin
 * (`scripts/site/redirects-plugin.ts`) answers them with the same 301s, so
 * the browser suite tests what the host serves. A redirect is not an alias:
 * it never ends. Each later rename appends its rules, exact rules before
 * splats.
 */
export type Redirect = { from: string; to: string; status: 301 };

export const REDIRECTS: readonly Redirect[] = [
  {
    from: "/components/pluto-theme",
    to: "/components/kuiper-theme/",
    status: 301,
  },
  {
    from: "/components/pluto-theme/",
    to: "/components/kuiper-theme/",
    status: 301,
  },
  {
    from: "/components/pluto-theme/*",
    to: "/components/kuiper-theme/:splat",
    status: 301,
  },
  {
    from: "/example/pluto-theme",
    to: "/components/kuiper-theme/",
    status: 301,
  },
  {
    from: "/example/pluto-theme/",
    to: "/components/kuiper-theme/",
    status: 301,
  },
  {
    from: "/example/pluto-theme/*",
    to: "/example/kuiper-theme/:splat",
    status: 301,
  },
];

/**
 * Parses `_redirects`. It reads three shapes, and rejects any other: an
 * exact source; a source ending `/*` whose destination ends `:splat`; and a
 * status, 301, on every rule. Blank lines and `#` comments are skipped.
 */
export function parseRedirects(text: string): Redirect[] {
  const out: Redirect[] = [];
  for (const [n, raw] of text.split("\n").entries()) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const parts = line.split(/\s+/);
    const fail = (why: string) => {
      throw new Error(`_redirects line ${n + 1}: ${why}: ${line}`);
    };
    if (parts.length !== 3) fail("not source, destination and status");
    const [from, to, status] = parts as [string, string, string];
    if (status !== "301") fail("the status is not 301");
    if (!from.startsWith("/") || !to.startsWith("/")) fail("not a path");
    const splat = from.endsWith("/*");
    const head = splat ? from.slice(0, -1) : from;
    if (head.includes("*") || head.includes(":")) fail("a placeholder");
    if (splat !== to.endsWith(":splat")) fail("a splat on one side only");
    if ((splat ? to.slice(0, -":splat".length) : to).includes(":"))
      fail("a placeholder");
    out.push({ from, to, status: 301 });
  }
  return out;
}

/** The destination of the first rule that matches `pathname`, or null. */
export function matchRedirect(
  pathname: string,
  rules: readonly Redirect[] = REDIRECTS,
): string | null {
  for (const r of rules) {
    if (r.from.endsWith("/*")) {
      const base = r.from.slice(0, -1);
      if (pathname.startsWith(base))
        return r.to.replace(":splat", pathname.slice(base.length));
    } else if (pathname === r.from) return r.to;
  }
  return null;
}
