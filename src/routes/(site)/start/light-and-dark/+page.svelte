<script lang="ts">
  import { door } from "#lib/site/doors";
  import Leaf from "#lib/site/page/leaf.svelte";
  import Snippet from "#lib/site/page/snippet.svelte";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/start/light-and-dark/")!;
  const link = "text-primary underline underline-offset-4";
</script>

<Leaf
  door={door("start")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "add", title: "Add the switch" },
    { id: "script", title: "The head script" },
    { id: "choice", title: "The stored choice" },
    { id: "toggle", title: "The toggle" },
    { id: "no-script", title: "With scripts off" },
  ]}
>
  <p>
    The theme already holds both palettes: light on <code>:root</code>, dark on
    <code>.dark</code>. What remains is to set <code>.dark</code> on
    <code>html</code> at the right moment. The
    <a href={componentPath("theme")} class={link}>theme</a> part does that.
  </p>

  <section
    aria-labelledby="add"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="add" class="text-2xl font-semibold tracking-section">
      Add the switch
    </h2>
    <Snippet
      code={data.add.code}
      lines={data.add.lines}
      label="Add the theme switch"
      language="bash"
    />
  </section>

  <section
    aria-labelledby="script"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="script" class="text-2xl font-semibold tracking-section">
      The head script
    </h2>
    <p>
      Render <code>ThemeScript</code> once, in your root layout. It writes a small
      script into the page's head, which runs before the first paint, so a reader
      never sees the wrong theme flash. Prerendered pages keep it.
    </p>
    <Snippet
      code={data.layout.code}
      lines={data.layout.lines}
      label="src/routes/+layout.svelte"
      language="svelte"
    />
  </section>

  <section
    aria-labelledby="choice"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="choice" class="text-2xl font-semibold tracking-section">
      The stored choice
    </h2>
    <p>
      Until a reader chooses, the page follows their system, and changes with
      it. A choice is stored in <code>localStorage</code> under the key
      <code>{data.key}</code>, and the head script reads it on every page.
      Choosing <code>system</code> again removes the key.
    </p>
  </section>

  <section
    aria-labelledby="toggle"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="toggle" class="text-2xl font-semibold tracking-section">
      The toggle
    </h2>
    <p>
      <code>ThemeToggle</code> is a button that switches to the other theme. For
      a control of your own, the <code>theme</code> store gives what is in
      force, <code>theme.resolved</code>, and what was chosen,
      <code>theme.preference</code>; <code>theme.set()</code> and
      <code>theme.toggle()</code> change it.
    </p>
    <Snippet
      code={data.toggle.code}
      lines={data.toggle.lines}
      label="A toggle, and the store"
      language="svelte"
    />
  </section>

  <section
    aria-labelledby="no-script"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="no-script" class="text-2xl font-semibold tracking-section">
      With scripts off
    </h2>
    <p>
      The theme is set by a script, so with scripts off no class is set and a
      reader sees the light theme, even if their system is dark.
    </p>
  </section>
</Leaf>
