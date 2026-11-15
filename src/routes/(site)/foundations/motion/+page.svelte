<script lang="ts">
  import { door } from "#lib/site/doors";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/motion/")!;
  const m = $derived(data.motion);
  const x = $derived(data.expressive);
  const ease = (e: number[]) => `cubic-bezier(${e.join(", ")})`;
  const durations = $derived([
    {
      name: "--motion-micro",
      ms: m.microMs,
      job: "A control's change: a menu or a dialog entering and leaving.",
    },
    {
      name: "--motion-press",
      ms: x.press,
      job: "An action pressed: it scales down and back.",
    },
    {
      name: "--motion-slide",
      ms: x.slide,
      job: "A sliding change. No part uses it yet.",
    },
    {
      name: "--motion-busy",
      ms: x.busy,
      job: "A busy action's edge, drawn in while it works.",
    },
    {
      name: "--motion-reveal",
      ms: x.reveal,
      job: "Glass's rim lighting up under the pointer.",
    },
    {
      name: "--motion-light",
      ms: x.light,
      job: "How long glass's rim stays lit after the pointer stops.",
    },
    {
      name: "--motion-fill",
      ms: x.fill,
      job: "A proof figure or a console line filling in.",
    },
    {
      name: "--motion-entrance",
      ms: m.entranceMs,
      job: "The page's one entrance: the mark's dots docking.",
    },
  ]);
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "durations", title: "Durations" },
    { id: "eases", title: "Eases" },
    { id: "reduced", title: "Reduced motion" },
  ]}
>
  <p>
    Motion answers what the reader does. A page has one entrance, the mark's,
    and nothing else moves until it is asked to.
  </p>

  <section aria-labelledby="durations" class="mt-16">
    <h2 id="durations" class="text-2xl font-semibold tracking-section">
      Durations
    </h2>
    <Table label="Durations" head={["Property", "Duration", "Its job"]}>
      {#each durations as d (d.name)}
        <tr data-motion-row={d.name}>
          <td><code>{d.name}</code></td>
          <td class="tabular-nums">{d.ms} ms</td>
          <td>{d.job}</td>
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="eases" class="mt-16">
    <h2 id="eases" class="text-2xl font-semibold tracking-section">Eases</h2>
    <Table label="Eases" head={["Ease", "Curve", "Its job"]}>
      <tr data-motion-row="entrance">
        <td>Entrance</td>
        <td><code>{ease(m.easeEntrance)}</code></td>
        <td>Things arriving: the entrance, a menu, a dialog.</td>
      </tr>
      <tr data-motion-row="standard">
        <td>Standard</td>
        <td><code>{ease(x.easeStandard)}</code></td>
        <td>Things moving on an expressive page.</td>
      </tr>
      <tr data-motion-row="spring">
        <td>Spring</td>
        <td>damping ratio {x.spring.dampingRatio}</td>
        <td>The mark's dots alone.</td>
      </tr>
    </Table>
    <p class="mt-6">
      A press scales an action to {x.pressScale} of its size. In the entrance, each
      dot starts {Math.round(m.entranceStagger * 100)}% of the entrance after
      the last, and docks in {Math.round(m.entranceDot * 100)}% of it.
    </p>
  </section>

  <section aria-labelledby="reduced" class="mt-16">
    <h2 id="reduced" class="text-2xl font-semibold tracking-section">
      Reduced motion
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        When a reader asks their system for reduced motion, every duration above
        becomes 0 ms and a press no longer scales. Animations and transitions
        end at once, and the mark shows composed from the first frame.
      </p>
      <p>
        Nothing is lost: each motion only shows a change that has already
        happened, so the end state says the same thing.
      </p>
    </div>
  </section>
</Leaf>
