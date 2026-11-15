<script lang="ts">
  import { door } from "#lib/site/doors";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/start/modes/")!;
  const link = "text-primary underline underline-offset-4";
</script>

<Leaf
  door={door("start")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "two", title: "Two modes" },
    { id: "attribute", title: "Setting the mode" },
    { id: "fields", title: "What a field may hold" },
    { id: "items", title: "Which parts go where" },
  ]}
>
  <section aria-labelledby="two" class="grid grid-cols-[minmax(0,1fr)] gap-4">
    <h2 id="two" class="text-2xl font-semibold tracking-section">Two modes</h2>
    <p>
      <strong>Productive</strong> is for the screens people work in: quiet, flat,
      one blue for action. Most of an app is productive.
    </p>
    <p>
      <strong>Expressive</strong> is for the moments a product speaks for itself:
      a home page, a launch. Only there may a page use the four colour fields, frosted
      glass and poster type. In the dark theme, the mark lifts its four colours there;
      in a productive screen it is paper.
    </p>
  </section>

  <section
    aria-labelledby="attribute"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="attribute" class="text-2xl font-semibold tracking-section">
      Setting the mode
    </h2>
    <p>
      Set <code>data-mode="productive"</code> or
      <code>data-mode="expressive"</code> on the element that holds the page. The
      mode reaches everything inside it, and a productive island inside an expressive
      page stays productive.
    </p>
  </section>

  <section
    aria-labelledby="fields"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="fields" class="text-2xl font-semibold tracking-section">
      What a field may hold
    </h2>
    <p>
      A field, <code>field-1</code> to <code>field-4</code>, is a band of one
      brand colour. Its text takes the field's own legend, the one colour
      measured on it. A field holds:
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>headings, prose and figures, in the legend;</li>
      <li>
        opaque surfaces, such as a card, which carry <code>surface-plain</code>;
      </li>
      <li>glass.</li>
    </ul>
    <p>
      A control never sits on the field itself: put it on a surface or on glass.
      And never put <code>.dark</code> on the same element as a field; set the
      theme on <code>html</code> or a wrapper.
    </p>
  </section>

  <section
    aria-labelledby="items"
    class="mt-16 grid grid-cols-[minmax(0,1fr)] gap-4"
  >
    <h2 id="items" class="text-2xl font-semibold tracking-section">
      Which parts go where
    </h2>
    <p>
      Each part names its modes in its <code>meta.modes</code>, in the registry. {data.both}
      parts work in both, {data.productive} in productive screens only, and {data
        .expressive.length} in expressive pages only:
    </p>
    <ul class="grid gap-1 text-sm sm:grid-cols-2">
      {#each data.expressive as i (i.name)}
        <li><a href={componentPath(i.name)} class={link}>{i.title}</a></li>
      {/each}
    </ul>
  </section>
</Leaf>
