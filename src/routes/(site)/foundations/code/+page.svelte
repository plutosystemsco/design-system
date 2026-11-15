<script lang="ts">
  import { door } from "#lib/site/doors";
  import Swatch from "#lib/site/foundations/swatch.svelte";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import Snippet from "#lib/site/page/snippet.svelte";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/code/")!;
  const ground = $derived(data.rows.find((r) => r.role === "background")!);
  const treeSitter = $derived(
    data.languages.filter((l) => l.engine === "tree-sitter"),
  );
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "roles", title: "The roles" },
    { id: "ground", title: "The ground" },
    { id: "languages", title: "The languages" },
  ]}
>
  <div class="grid gap-4">
    <p>
      Highlighted code is coloured by role, not by language. A keyword is the
      keyword colour in Python and in Rust alike, so a reader learns the palette
      once. The roles follow the Meridian guide; the colours are this system's
      own palette, Tombaugh.
    </p>
    <Snippet
      code={data.sample.code}
      lines={data.sample.lines}
      label="A TypeScript sample"
      language="ts"
    />
    <p>
      A token is coloured by a class, <code>text-code-&lt;role&gt;</code>, never
      by a style, so both themes come from the same markup. No token is bold or
      italic; a link is underlined.
    </p>
  </div>

  <section aria-labelledby="roles" class="mt-16">
    <h2 id="roles" class="text-2xl font-semibold tracking-section">
      The roles
    </h2>
    <p class="mt-4">
      {data.rows.length} roles. Each is a custom property,
      <code>--code-&lt;role&gt;</code>, that reads a theme role.
    </p>
    <Table
      label="Code roles"
      head={["Role", "What it colours", "Reads", "Light", "Dark"]}
    >
      {#each data.rows as r (r.role)}
        <tr data-code-row={r.role}>
          <td><code>{r.role}</code></td>
          <td>{r.words}</td>
          <td><code>{r.token}</code></td>
          <td><Swatch value={r.light} theme="light" /></td>
          <td><Swatch value={r.dark} theme="dark" /></td>
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="ground" class="mt-16">
    <h2 id="ground" class="text-2xl font-semibold tracking-section">
      The ground
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        Code sits on its own ground: <code>{ground.light}</code> in light,
        white, and <code>{ground.dark}</code> in dark. Every colour above is measured
        against it, against the active line and against a selection, and passes 4.5:1
        on each.
      </p>
      <p>
        The ground has a hairline edge in both themes, so a block reads as a
        block on a white card too. The <a
          href={componentPath("code-block")}
          class="text-primary underline underline-offset-4">code block</a
        >
        and the
        <a
          href={componentPath("code-editor")}
          class="text-primary underline underline-offset-4">code editor</a
        > both use it.
      </p>
    </div>
  </section>

  <section aria-labelledby="languages" class="mt-16">
    <h2 id="languages" class="text-2xl font-semibold tracking-section">
      The languages
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        {data.languages.length} languages. {treeSitter.length} are parsed by tree-sitter,
        with queries this system writes; the other {data.languages.length -
          treeSitter.length} are highlighted by Shiki, which is also the fallback
        of every one. A name the table does not know is shown plain.
      </p>
      <p>
        The engines load only when a page asks for them. A page highlighted at
        build, like this one, ships neither.
      </p>
    </div>
    <Table label="Languages" head={["Language", "Also called", "Engine"]}>
      {#each data.languages as l (l.id)}
        <tr data-language-row={l.id}>
          <td><code>{l.id}</code></td>
          <td>
            {#if l.aliases.length}{#each l.aliases as a, i (a)}{i
                  ? ", "
                  : ""}<code>{a}</code>{/each}{:else}<span
                class="text-muted-foreground">None</span
              >{/if}
          </td>
          <td>{l.engine === "tree-sitter" ? "tree-sitter" : "Shiki"}</td>
        </tr>
      {/each}
    </Table>
  </section>
</Leaf>
