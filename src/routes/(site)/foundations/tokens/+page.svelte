<script lang="ts">
  import { door } from "#lib/site/doors";
  import CopyName from "#lib/site/foundations/copy-name.svelte";
  import Swatch from "#lib/site/foundations/swatch.svelte";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/tokens/")!;
  const roles = $derived(data.rows.filter((r) => r.kind === "role"));
  const primitives = $derived(data.rows.filter((r) => r.kind === "primitive"));
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "roles", title: "Theme roles" },
    { id: "primitives", title: "Primitives" },
  ]}
>
  <div class="grid gap-4">
    <p>
      There is one token file, <code>tokens/pluto.tokens.json</code>. Every
      colour in every part comes from it. A <strong>primitive</strong> is a
      colour with a name, such as <code>ink</code> or <code>blue</code>. A
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
</Leaf>
