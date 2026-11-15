<script lang="ts">
  import { door } from "#lib/site/doors";
  import Leaf from "#lib/site/page/leaf.svelte";
  import Snippet from "#lib/site/page/snippet.svelte";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/start/your-product/")!;
  const link = "text-primary underline underline-offset-4";
</script>

<Leaf
  door={door("start")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "yours", title: "What is yours" },
    { id: "logo", title: "Your logo" },
    { id: "endorsement", title: "The endorsement" },
  ]}
>
  <section aria-labelledby="yours" class="grid grid-cols-[minmax(0,1fr)] gap-4">
    <h2 id="yours" class="text-2xl font-semibold tracking-section">
      What is yours
    </h2>
    <p>
      A product sets three things: its logo, its name and its copy. Everything
      else is shared: the colours, the type, the space, the radius and the
      motion, all from the one token file and checked for contrast in both
      themes. That is what makes two products feel like one suite.
    </p>
    <p>
      How a product is named is on <a href="/brand/products/" class={link}
        >Products</a
      >.
    </p>
  </section>

  <section
    aria-labelledby="logo"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="logo" class="text-2xl font-semibold tracking-section">Your logo</h2>
    <p>
      The <a href={componentPath("app-shell")} class={link}>app shell</a> takes
      your logo as a snippet: an SVG, an image or markup, at most 36 px tall and
      176 px wide. It renders in the header and again in the footer, and is told
      which. Without a logo, the shell sets <code>appName</code> as a wordmark in
      the heading face.
    </p>
    <Snippet
      code={data.add.code}
      lines={data.add.lines}
      label="Add the app shell"
      language="bash"
    />
    <Snippet
      code={data.shell.code}
      lines={data.shell.lines}
      label="Your logo in the app shell"
      language="svelte"
    />
    <p>
      <code>Logo</code> here is your own component. <code>appName</code> stays even
      with a logo: it is the logo's accessible name, so it should contain any words
      the logo shows.
    </p>
  </section>

  <section
    aria-labelledby="endorsement"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="endorsement" class="text-2xl font-semibold tracking-section">
      The endorsement
    </h2>
    <p>
      The footer can carry one line, “A Pluto Systems product”. It is off until
      you set <code>endorsed</code>. When a reader points at it, the mark's four
      dots appear beside it, quickly, as a response. It is a line of words, not
      the Pluto lockup, so it stays small, under the footer's rows.
    </p>
  </section>
</Leaf>
