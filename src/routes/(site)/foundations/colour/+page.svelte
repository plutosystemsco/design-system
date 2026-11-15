<script lang="ts">
  import { door } from "#lib/site/doors";
  import Swatch from "#lib/site/foundations/swatch.svelte";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/colour/")!;

  // The roles by job. A role the token file adds lands in "Everything else"
  // until it is named here, so none is ever left off the page.
  const JOBS: { id: string; title: string; test: (n: string) => boolean }[] = [
    {
      id: "surfaces",
      title: "Surfaces",
      test: (n) =>
        /^(background|card|popover|secondary|muted|accent|raised)$/.test(n),
    },
    {
      id: "text",
      title: "Text on surfaces",
      test: (n) =>
        n === "foreground" ||
        /^(card|popover|secondary|accent|muted)-foreground$/.test(n),
    },
    {
      id: "actions",
      title: "Action and focus",
      test: (n) => /^(primary|primary-foreground|ring)$/.test(n),
    },
    {
      id: "status",
      title: "Status",
      test: (n) => /^(destructive|success|caution)(-|$)/.test(n),
    },
    {
      id: "lines",
      title: "Lines, depth and veils",
      test: (n) => /^(border|input|groove-|elevation-|scrim)/.test(n),
    },
    { id: "charts", title: "Charts", test: (n) => n.startsWith("chart-") },
    { id: "the-mark", title: "The mark", test: (n) => n.startsWith("mark-") },
    { id: "sidebar", title: "Sidebar", test: (n) => n.startsWith("sidebar") },
  ];
  const groups = $derived.by(() => {
    const placed = new Set<string>();
    const out = JOBS.map((j) => {
      const rows = data.roles.filter(
        (r) => !placed.has(r.name) && j.test(r.name),
      );
      for (const r of rows) placed.add(r.name);
      return { ...j, rows };
    });
    const rest = data.roles.filter((r) => !placed.has(r.name));
    if (rest.length)
      out.push({
        id: "other",
        title: "Everything else",
        test: () => true,
        rows: rest,
      });
    return out.filter((g) => g.rows.length);
  });
  const light = $derived(data.contrast.filter((r) => r.theme === "light"));
  const dark = $derived(data.contrast.filter((r) => r.theme === "dark"));
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "by-job", title: "Roles by job" },
    { id: "contrast", title: "Contrast" },
  ]}
>
  <div class="grid gap-4">
    <p>
      Pick a colour by its job, not by how it looks. A role reads one colour in
      light and another in dark, so a part that uses <code
        >muted-foreground</code
      >
      for a hint is right in both themes.
    </p>
    <p>
      Code's colours have a page of their own, <a
        href="/foundations/code/"
        class="text-primary underline underline-offset-4">Code</a
      >. Every value here, with its copy button, is on
      <a
        href="/foundations/tokens/"
        class="text-primary underline underline-offset-4">Tokens</a
      >.
    </p>
  </div>

  <section aria-labelledby="by-job" class="mt-16">
    <h2 id="by-job" class="text-2xl font-semibold tracking-section">
      Roles by job
    </h2>
    <p class="mt-4">
      Each role is shown in both themes, with its value. A text role shows "Aa"
      on the surface it is read on, with the pair's measured contrast.
    </p>
    {#each groups as g (g.id)}
      <h3 id={g.id} class="site-h3 mt-10">{g.title}</h3>
      <Table label={g.title} head={["Role", "Its job", "Light", "Dark"]}>
        {#each g.rows as r (r.id)}
          <tr data-role-row={r.name}>
            <td><code>{r.name}</code></td>
            <td>{r.words}</td>
            {#each ["light", "dark"] as const as theme (theme)}
              <td
                ><Swatch
                  size="specimen"
                  value={r[theme]}
                  {theme}
                  on={r.pair?.[theme].on}
                  surface={r.pair?.surface}
                  ratio={r.pair?.[theme].ratio}
                /></td
              >
            {/each}
          </tr>
        {/each}
      </Table>
    {/each}
  </section>

  <section aria-labelledby="contrast" class="mt-16">
    <h2 id="contrast" class="text-2xl font-semibold tracking-section">
      Contrast
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        Every pair the parts set, measured by WCAG 2.2's contrast ratio. Text
        needs 4.5:1; a control's edge or a graphic needs 3:1. The ratio is cut
        to two places, never rounded up, so a pair never passes by rounding.
      </p>
      <p>
        An exception is a pair allowed below its minimum, for a reason the token
        file records. There {data.exceptions.length === 1
          ? "is one"
          : `are ${data.exceptions.length}`}:
      </p>
      <ul class="grid list-disc gap-2 ps-6">
        <!-- The reason without its bracketed sources, which a reader of
             this site cannot open. -->
        {#each data.exceptions as e (e.theme + e.pair.join())}
          <li>
            <code>{e.pair[0]}</code> on <code>{e.pair[1]}</code>, {e.theme}:
            {e.why.replace(/\s*\(.*\)$/, "")}.
          </li>
        {/each}
      </ul>
    </div>
    {#each [{ theme: "Light", rows: light }, { theme: "Dark", rows: dark }] as t (t.theme)}
      <h3 class="site-h3 mt-10">{t.theme}</h3>
      <Table
        label="Contrast, {t.theme.toLowerCase()}"
        head={["Pair", "Kind", "Ratio", "Needs", "Result"]}
      >
        {#each t.rows as r (r.n)}
          <tr data-contrast-row="{r.theme}:{r.label}">
            <td><code>{r.label}</code></td>
            <td>{r.kind === "text" ? "Text" : "Non-text"}</td>
            <td class="tabular-nums">{r.ratio.toFixed(2)}:1</td>
            <td class="tabular-nums">{r.minimum}:1</td>
            <td
              >{r.result === "pass"
                ? "Passes"
                : r.result === "exception"
                  ? "Exception"
                  : "Fails"}</td
            >
          </tr>
        {/each}
      </Table>
    {/each}
  </section>
</Leaf>
