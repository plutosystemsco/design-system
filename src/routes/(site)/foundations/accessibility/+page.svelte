<script lang="ts">
  import { door } from "#lib/site/doors";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";

  const page = sitePage("/foundations/accessibility/")!;
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "promised", title: "What is promised" },
    { id: "checked", title: "How it is checked" },
    { id: "not-yet", title: "Not checked yet" },
  ]}
>
  <section aria-labelledby="promised">
    <h2 id="promised" class="text-2xl font-semibold tracking-section">
      What is promised
    </h2>
    <ul class="mt-4 grid list-disc gap-2 ps-6">
      <li>
        WCAG 2.2 at level AA, in the light theme and in the dark. Every pair of
        colours the parts set is measured, and the ratios are on
        <a
          href="/foundations/colour/#contrast"
          class="text-primary underline underline-offset-4">Colour</a
        >.
      </li>
      <li>
        Every interactive part works by keyboard alone, and shows a focus ring
        when it is reached.
      </li>
      <li>
        Under reduced motion, nothing moves; under reduced transparency, glass
        is opaque.
      </li>
    </ul>
  </section>

  <section aria-labelledby="checked" class="mt-16">
    <h2 id="checked" class="text-2xl font-semibold tracking-section">
      How it is checked
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        In Chromium, by the test suite each release must pass. axe scans every
        page of this site in both themes, at a phone's width, a tablet's and a
        desktop's. A keyboard walk presses through each part's fixture and its
        behaviours, and checks where focus goes.
      </p>
      <p>
        The contrast of every pair is measured from the token file, so a colour
        that would fail cannot be added.
      </p>
    </div>
  </section>

  <section aria-labelledby="not-yet" class="mt-16">
    <h2 id="not-yet" class="text-2xl font-semibold tracking-section">
      Not checked yet
    </h2>
    <ul class="mt-4 grid list-disc gap-2 ps-6">
      <li>Firefox, Safari and Safari on iOS.</li>
      <li>
        Screen readers. The parts are built to be read, but no one has listened
        through them yet.
      </li>
      <li>
        A Content Security Policy. None ships yet. The theme's script runs
        inline in the page's head, and the code highlighter's tree-sitter engine
        needs WebAssembly compiled at run time. A policy written before both are
        measured would either break the code pages or allow too much. A later
        release adds one, with hashes.
      </li>
    </ul>
  </section>
</Leaf>
