<script lang="ts">
  import { door } from "#lib/site/doors";
  import CopyName from "#lib/site/foundations/copy-name.svelte";
  import Swatch from "#lib/site/foundations/swatch.svelte";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { GITHUB_REGISTRY, SITE_ORIGIN, SITE_REGISTRY } from "#lib/site/site";
  import { sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/tokens/")!;
  const roles = $derived(data.rows.filter((r) => r.kind === "role"));
  const primitives = $derived(data.rows.filter((r) => r.kind === "primitive"));
  const link = "text-primary underline underline-offset-4";
  /** 021 decision 13: the published token files, at this release. */
  const files = [
    {
      name: "kuiper.css",
      words:
        "Every token as a CSS custom property, light on :root and dark on .dark, for a stack without Tailwind.",
    },
    {
      name: "kuiper.resolver.json",
      words:
        "The DTCG resolver: which token files make the light scheme and which the dark, for a tool that reads resolvers.",
    },
    {
      name: "kuiper.flat-light.tokens.json",
      words:
        "The light scheme in one DTCG file, for a tool that cannot read a resolver.",
    },
    {
      name: "kuiper.flat-dark.tokens.json",
      words: "The dark scheme in one DTCG file.",
    },
    {
      name: "kuiper.removed.json",
      words:
        "Every name the system shipped and no longer ships, with what replaces it.",
    },
  ];
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "roles", title: "Theme roles" },
    { id: "primitives", title: "Primitives" },
    { id: "anywhere", title: "Use the tokens anywhere" },
  ]}
>
  <div class="grid gap-4">
    <p>
      The tokens live in <code>tokens/</code>, in the W3C Design Tokens format
      (DTCG 2025.10). <code>kuiper.tokens.json</code> holds what is the same in
      both themes, <code>kuiper.light.tokens.json</code> and
      <code>kuiper.dark.tokens.json</code> the roles of each, and
      <code>kuiper.resolver.json</code> says which make each theme. Every colour
      in every part comes from them. A <strong>primitive</strong> is a colour
      with a name, such as <code>ink</code> or <code>blue</code>. A
      <strong>theme role</strong> is a job, such as <code>background</code> or
      <code>ring</code>, and names the primitive it reads in each theme.
    </p>
    <p>
      Parts use roles, never primitives. In your app a role is a custom
      property, <code>--background</code>, and a Tailwind colour,
      <code>bg-background</code>. The copy button beside a role copies its
      property; beside a primitive, its value.
    </p>
  </div>

  <section aria-labelledby="roles" class="mt-16">
    <h2 id="roles" class="text-2xl font-semibold tracking-section">
      Theme roles
    </h2>
    <p class="mt-4">
      {roles.length} roles. Each reads one primitive in light and one in dark.
    </p>
    <Table label="Theme roles" head={["Role", "Light", "Dark", "Its job"]}>
      {#each roles as r (r.id)}
        <tr id={r.id} data-token-row={r.id}>
          <td><CopyName name={r.copy} copy={r.copy} /></td>
          <td><Swatch value={r.light} theme="light" /></td>
          <td><Swatch value={r.dark} theme="dark" /></td>
          <td>{r.words}</td>
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="primitives" class="mt-16">
    <h2 id="primitives" class="text-2xl font-semibold tracking-section">
      Primitives
    </h2>
    <p class="mt-4">
      {primitives.length} primitives. A primitive has one value in both themes.
    </p>
    <Table label="Primitives" head={["Primitive", "Value", "Read by"]}>
      {#each primitives as r (r.id)}
        <tr id={r.id} data-token-row={r.id}>
          <td><CopyName name={r.name} copy={r.copy} /></td>
          <td><Swatch value={r.light} /></td>
          <td>{r.words}</td>
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="anywhere" class="mt-16">
    <h2 id="anywhere" class="text-2xl font-semibold tracking-section">
      Use the tokens anywhere
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        The theme part is the way to take the tokens with Tailwind. For any
        other stack, each release publishes them as files. Copy a file into your
        app; never link to it from your app at run time.
      </p>
      <ul class="grid list-disc gap-2 ps-6">
        {#each files as f (f.name)}
          <li>
            <a href={`${SITE_REGISTRY}/tokens/${f.name}`} class={link}
              ><code class="wrap-anywhere">{f.name}</code></a
            >: {f.words}
          </li>
        {/each}
      </ul>
      <p>
        Each file has three addresses. This release's,
        <code class="wrap-anywhere">{SITE_REGISTRY}/tokens/kuiper.css</code>,
        stays the same. The latest release's is
        <code class="wrap-anywhere">{SITE_ORIGIN}/r/tokens/kuiper.css</code>.
        GitHub serves the same file from the release's tag, at
        <code class="wrap-anywhere">{GITHUB_REGISTRY}/tokens/kuiper.css</code>.
      </p>
      <p>
        <code>kuiper.css</code> loads no font. Its font variables name Geist, IBM
        Plex Sans and JetBrains Mono; load them yourself. Each token in the DTCG files
        says what it is for, the release that first shipped it, and the CSS variable
        an app reads.
      </p>
    </div>
  </section>
</Leaf>
