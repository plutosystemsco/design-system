<script lang="ts">
  import { version } from "$app/env";
  import { CtaBand } from "#lib/registry/ui/cta-band";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import {
    LiveConsole,
    type LiveConsoleResult,
  } from "#lib/registry/ui/live-console";
  import { MarketingBar } from "#lib/registry/ui/marketing-bar";
  import { MarketingFooter } from "#lib/registry/ui/marketing-footer";
  import { NameStrip } from "#lib/registry/ui/name-strip";
  import { ProofBand } from "#lib/registry/ui/proof-band";
  import { Stage } from "#lib/registry/ui/stage";
  import { StageCard } from "#lib/registry/ui/stage-card";
  import { StageHero } from "#lib/registry/ui/stage-hero";

  // Your product's values. Every claim here is true of the open platform
  // the suite is built on, as its README states it; replace
  // them with your own. A link goes to "/" or to an id on this page.
  const NAME = "Pluto Systems";
  const LINKS = [
    { label: "The layer", href: "#layer" },
    { label: "Try it", href: "#console" },
  ];
  const DOCS = { label: "Read the docs", href: "/" };
  const SOURCE = { label: "See the source", href: "/" };

  const INSTALL = "pip install git+https://github.com/ClayGendron/vfs";
  const SEARCH = `db = DatabaseStorage(url=DATABASE_URL)
fs = VirtualFileSystem(storage=db)
result = await fs.grep("renewal")
for path in result.paths: print(path)`;

  // A stand-in for your server. Replace it. It resolves after a fixed 900 ms
  // with fixed lines: two paths, each from the namespace's root.
  const ROOT = "/";
  function search(): Promise<string[]> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            ["contracts/acme-msa.md", "contracts/globex-renewal.md"].map(
              (path) => ROOT + path,
            ),
          ),
        900,
      ),
    );
  }

  const PROOF = [
    { value: 4, label: "search verbs: glob, grep, glean and graph" },
    { value: 1, label: "namespace for every file and row" },
    { value: 0, label: "new databases to run: it mounts the one you have" },
  ];
  const EXAMPLES = [
    { label: "Find renewals", command: 'await fs.grep("renewal")' },
    {
      label: "Ask a question",
      command: 'await fs.glean("do renewals auto-renew?", limit=3)',
    },
  ];

  // A stand-in for your server. Replace it. Each command resolves after a
  // fixed 900 ms with fixed meters and lines.
  function query(command: string): Promise<LiveConsoleResult> {
    const result: LiveConsoleResult = command.includes(".grep(")
      ? {
          meters: [
            { label: "files searched", value: 12, max: 12 },
            { label: "permission checks", value: 12, max: 12 },
            { label: "results", value: 2, max: 12 },
          ],
          lines: ["contracts/acme-msa.md", "contracts/globex-renewal.md"].map(
            (path) => ROOT + path,
          ),
        }
      : {
          // glean ranks by meaning: the three best, in order.
          meters: [
            { label: "files searched", value: 12, max: 12 },
            { label: "permission checks", value: 12, max: 12 },
            { label: "results", value: 3, max: 12 },
          ],
          lines: [
            "contracts/globex-renewal.md",
            "contracts/acme-msa.md",
            "policies/renewals.md",
          ].map((path, rank) => `${rank + 1}. ${ROOT}${path}`),
        };
    return new Promise((resolve) => setTimeout(() => resolve(result), 900));
  }

  const FOOTER = {
    groups: [
      {
        title: "Product",
        links: [
          { label: "Docs", href: "/" },
          { label: "Source", href: "/" },
        ],
      },
      { title: "Company", links: [{ label: "About", href: "/" }] },
    ],
    // SvelteKit's version name: the commit when vite.config.ts sets it to
    // one; its default is a timestamp, all digits, which means no commit: no
    // row.
    commit: /^\d+$/.test(version) ? undefined : version,
    // The commit's own date, set by vite.config.ts; without it, no row.
    builtAt: import.meta.env.VITE_BUILT_AT as string | undefined,
  };
</script>

<svelte:head><title>Work runs on data.</title></svelte:head>

<!-- The page's one entrance: the bar's lockup, never the footer's. -->
{#snippet logo(place: "header" | "footer")}
  <Lockup entrance={place === "header"} class="text-2xl" />
{/snippet}

<MarketingBar
  {logo}
  homeLabel={NAME}
  links={LINKS}
  secondary={DOCS}
  primary={SOURCE}
  overlay
/>

<main id="main" tabindex="-1">
  <Stage>
    <StageHero
      underBar
      field="field-1"
      eyebrow="pluto workspace"
      title="Work runs on data."
      description="Docs, sheets, mail and search on one governed data layer. People and agents search the same files, under the same permissions."
      actions={[DOCS, SOURCE]}
    >
      {#snippet object()}
        <div class="grid gap-4">
          <StageCard title="shell" code={INSTALL} language="bash" />
          <StageCard
            title="search.py"
            code={SEARCH}
            language="python"
            run={search}
          />
        </div>
      {/snippet}
      {#snippet strip()}
        <NameStrip
          label="The apps on the layer"
          names={["docs", "sheets", "mail", "search"]}
        />
      {/snippet}
    </StageHero>
  </Stage>

  <!-- Three owned moments, one colour each: blue in the hero, yellow
  for the proof, green for the console. -->
  <Stage element="div" ground="field-3">
    <div class="py-24">
      <ProofBand id="layer" title="One layer under every app" items={PROOF} />
    </div>
  </Stage>

  <Stage element="div" id="console">
    <div class="py-24">
      <!-- The console is a flat card on a green panel, never a control on the field itself. -->
      <div class="field-4 mx-auto max-w-3xl rounded-lg p-(--gutter-stage)">
        <LiveConsole
          title="Try the layer"
          examples={EXAMPLES}
          language="python"
          run={query}
        />
      </div>
    </div>
  </Stage>

  <!-- A call to action holds controls, so it goes on the canvas. -->
  <Stage element="div">
    <div class="py-24">
      <CtaBand title="Start with the data you already have." actions={[DOCS]} />
    </div>
  </Stage>
</main>

<MarketingFooter {logo} appName={NAME} {...FOOTER} />
