<script lang="ts">
  import { door } from "#lib/site/doors";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/start/theme/")!;
  const link = "text-primary underline underline-offset-4";
</script>

<Leaf
  door={door("start")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "variables", title: "Variables" },
    { id: "utilities", title: "Utilities" },
    { id: "global", title: "Global names" },
    { id: "fonts", title: "Fonts" },
  ]}
>
  <p>
    <code>add kuiper-theme</code> writes into one file,
    <code>src/app.css</code>, and installs three font packages. It adds no
    component and no script. Every value it writes comes from this system's one
    token file, so
    <a href="/foundations/tokens/" class={link}>Tokens</a> lists them all.
  </p>

  <section
    aria-labelledby="variables"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="variables" class="text-2xl font-semibold tracking-section">
      Variables
    </h2>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        {data.light} custom properties on <code>:root</code>, for the light
        theme.
      </li>
      <li>{data.dark} on <code>.dark</code>, for the dark theme.</li>
      <li>
        {data.theme} in Tailwind's <code>@theme</code>, so each colour and size
        is also a utility: <code>bg-background</code>,
        <code>text-muted-foreground</code>,
        <code>rounded</code>.
      </li>
    </ul>
  </section>

  <section
    aria-labelledby="utilities"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="utilities" class="text-2xl font-semibold tracking-section">
      Utilities
    </h2>
    <p>
      {data.utilities.length} utilities of its own, each a Tailwind
      <code>@utility</code>, so each works with any variant:
    </p>
    <p class="font-mono text-sm">
      {#each data.utilities as u, i (u)}{i ? ", " : ""}<code>{u}</code>{/each}
    </p>
  </section>

  <section
    aria-labelledby="global"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="global" class="text-2xl font-semibold tracking-section">
      Global names
    </h2>
    <p>
      A few rules match by class or attribute, not by utility. If your app
      already uses one of these names for something else, rename yours:
    </p>
    <ul class="grid gap-1 font-mono text-sm">
      {#each data.selectors as s (s)}<li>
          <code class="wrap-anywhere">{s}</code>
        </li>{/each}
    </ul>
    <p>
      It also sets a few base styles: the page's ground and text on
      <code>body</code>, the heading face on <code>h1</code> to <code>h6</code>,
      the focus ring on <code>:focus-visible</code>, and a chip around inline
      <code>code</code>.
    </p>
    <p>
      <code>.dark</code> on <code>html</code> turns on the dark theme.
      <code>data-mode</code>
      chooses productive or expressive;
      <a href="/start/modes/" class={link}>Modes</a> says how.
    </p>
  </section>

  <section
    aria-labelledby="fonts"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="fonts" class="text-2xl font-semibold tracking-section">Fonts</h2>
    <p>Three typefaces, each a part of its own that the theme brings:</p>
    <ul class="grid list-disc gap-2 ps-6">
      {#each data.fonts as f (f.item)}
        <li>
          {f.name}, as <code>{f.variable}</code>, from the package
          <code>{f.package}</code>:
          <a href={componentPath(f.item)} class={link}>{f.item}</a>.
        </li>
      {/each}
    </ul>
  </section>
</Leaf>
