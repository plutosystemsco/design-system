<script lang="ts">
  import { door } from "#lib/site/doors";
  import Leaf from "#lib/site/page/leaf.svelte";
  import Snippet from "#lib/site/page/snippet.svelte";
  import {
    GITHUB_REGISTRY,
    SITE_ORIGIN,
    SITE_REGISTRY,
    VERSION,
  } from "#lib/site/site";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/start/install/")!;
  const link = "text-primary underline underline-offset-4";
</script>

<Leaf
  door={door("start")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "app", title: "An app" },
    { id: "alias", title: "The #lib alias" },
    { id: "components-json", title: "components.json" },
    { id: "theme", title: "The theme" },
    { id: "first-part", title: "A first part" },
    { id: "registries", title: "Two addresses" },
    { id: "pin", title: "Pin a release" },
    { id: "update", title: "Update a part" },
    { id: "limits", title: "What is not covered" },
  ]}
>
  <div class="grid gap-4">
    <p>
      Every part here is source code that a command copies into your app. You
      own it from then on: change it, keep it, or delete it. Nothing in your app
      reaches back to this site when it runs.
    </p>
    <p>Five steps take an empty app to a first Pluto button.</p>
  </div>

  <section
    aria-labelledby="app"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="app" class="text-2xl font-semibold tracking-section">An app</h2>
    <p>Start from an empty SvelteKit 3 app with Tailwind CSS:</p>
    <Snippet
      step="create"
      code={data.create.code}
      lines={data.create.lines}
      label="Create the app"
      language="bash"
    />
  </section>

  <section
    aria-labelledby="alias"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="alias" class="text-2xl font-semibold tracking-section">
      The <code>#lib</code> alias
    </h2>
    <p>
      SvelteKit 3 imports your own code through <code>#lib</code>, a Node
      subpath import. Add this block to your app's <code>package.json</code>:
    </p>
    <Snippet
      step="imports"
      code={data.imports.code}
      lines={data.imports.lines}
      label="The imports block of package.json"
      language="json"
    />
    <p data-step="kit2">
      On SvelteKit 2, skip the <code>imports</code> block and use
      <code>$lib</code> wherever this guide says <code>#lib</code>.
    </p>
  </section>

  <section
    aria-labelledby="components-json"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="components-json" class="text-2xl font-semibold tracking-section">
      <code>components.json</code>
    </h2>
    <p>
      The command that adds parts reads one file, <code>components.json</code>,
      at your app's root. It says where each kind of file goes, and which
      registry to add from. Write it in full:
    </p>
    <Snippet
      step="components"
      code={data.components.code}
      lines={data.components.lines}
      label="The components.json file"
      language="json"
    />
    <p>
      Or let the command write it. Once the <code>imports</code> block is in
      place, <code>init</code> writes the same <code>#lib</code> aliases. Name
      <code>src/app.css</code> as your stylesheet when it asks, then set
      <code>registry</code> and <code>style</code> as above. <code>init</code>
      also asks for a preset, and fetches it online from shadcn-svelte's site, so
      it needs a connection; the file above does not.
    </p>
    <Snippet
      step="init"
      code={data.init.code}
      lines={data.init.lines}
      label="Write components.json with init"
      language="bash"
    />
  </section>

  <section
    aria-labelledby="theme"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="theme" class="text-2xl font-semibold tracking-section">
      The theme
    </h2>
    <p>
      First the theme. It writes every colour, size and font into
      <code>src/app.css</code>, and installs the three typefaces.
      <a href="/start/theme/" class={link}>The theme</a> says what it adds.
    </p>
    <Snippet
      step="add"
      code={data.theme.code}
      lines={data.theme.lines}
      label="Add the theme"
      language="bash"
    />
    <p>
      <code>-y</code> answers yes to its questions, and <code>-o</code> lets it
      update <code>src/app.css</code> and write over existing files without asking.
      Leave them off to be asked at each step.
    </p>
  </section>

  <section
    aria-labelledby="first-part"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="first-part" class="text-2xl font-semibold tracking-section">
      A first part
    </h2>
    <p>
      Then a part, here the <a href={componentPath("button")} class={link}
        >button</a
      >. The command also adds what the part needs that you do not have yet.
    </p>
    <Snippet
      step="add"
      code={data.button.code}
      lines={data.button.lines}
      label="Add the button"
      language="bash"
    />
    <p>It writes {data.buttonFiles.length} files, each yours from now on:</p>
    <ul data-files="button" class="grid gap-1 font-mono text-sm wrap-anywhere">
      {#each data.buttonFiles as f (f)}<li>{f}</li>{/each}
    </ul>
    <p>
      Import it as <code class="wrap-anywhere"
        >import {"{"} Button {"}"} from "#lib/components/ui/button";</code
      >, and the page is on brand.
    </p>
  </section>

  <section
    aria-labelledby="registries"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="registries" class="text-2xl font-semibold tracking-section">
      Two addresses
    </h2>
    <p>The same release is served from two places. Either works:</p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>This site: <code class="wrap-anywhere">{SITE_REGISTRY}</code></li>
      <li>GitHub: <code class="wrap-anywhere">{GITHUB_REGISTRY}</code></li>
    </ul>
  </section>

  <section
    aria-labelledby="pin"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="pin" class="text-2xl font-semibold tracking-section">
      Pin a release
    </h2>
    <p>
      Each address names its release, here <code>v{VERSION}</code>. Keep that in
      <code>components.json</code>, and every part you add comes from the same
      release. <code class="wrap-anywhere">{SITE_ORIGIN}/r</code> always serves the
      newest; use it to look, not to build.
    </p>
  </section>

  <section
    aria-labelledby="update"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="update" class="text-2xl font-semibold tracking-section">
      Update a part
    </h2>
    <p>
      Read the <a href="/changelog/" class={link}>changelog</a> first. A part
      whose entry says <strong>interface change</strong> may need your code to
      change with it. Then point <code>components.json</code> at the new release
      and run its <code>add</code> again, with <code>-o</code> to overwrite. Your
      own edits to that part are replaced, so keep them in version control.
    </p>
  </section>

  <section
    aria-labelledby="limits"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="limits" class="text-2xl font-semibold tracking-section">
      What is not covered
    </h2>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        No Content Security Policy ships yet. <a
          href="/foundations/accessibility/#not-yet"
          class={link}>Accessibility</a
        > says why.
      </li>
      <li>
        Parts are checked in Chromium. Firefox and Safari are not checked yet.
      </li>
    </ul>
  </section>
</Leaf>
