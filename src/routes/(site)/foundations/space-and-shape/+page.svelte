<script lang="ts">
  import { door } from "#lib/site/doors";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/space-and-shape/")!;
  const atom = $derived(data.spacing.atom);
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "space", title: "Space" },
    { id: "radius", title: "The radius" },
    { id: "lines", title: "The hairline and the focus ring" },
  ]}
>
  <section aria-labelledby="space">
    <h2 id="space" class="text-2xl font-semibold tracking-section">Space</h2>
    <div class="mt-4 grid gap-4">
      <p>
        Every space is a multiple of one atom, {atom} px. Tailwind's spacing utilities
        count in atoms: <code>p-4</code> is {4 * atom} px.
      </p>
      <p>
        Most layouts need only the ladder below. A step off it is a sign that
        something else is wrong.
      </p>
    </div>
    <Table label="The space ladder" head={["Space", "Atoms", "Utility"]}>
      {#each data.spacing.ladder as px (px)}
        <tr data-space-row={px}>
          <td class="tabular-nums">{px} px</td>
          <td class="tabular-nums">{px / atom}</td>
          <td><code>gap-{px / atom}</code></td>
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="radius" class="mt-16">
    <h2 id="radius" class="text-2xl font-semibold tracking-section">
      The radius
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        One radius, {data.radius.case} px, for every card, control and field:
        <code>rounded</code>. Only a dot is round.
      </p>
    </div>
  </section>

  <section aria-labelledby="lines" class="mt-16">
    <h2 id="lines" class="text-2xl font-semibold tracking-section">
      The hairline and the focus ring
    </h2>
    <div class="mt-4 grid gap-4">
      <p>
        An edge is a {data.line.width} px hairline in <code>border</code>. Rows
        are parted by a groove, a hairline in <code>groove-line</code>.
      </p>
      <p>
        The focus ring is {data.focus.width} px of <code>ring</code>, set {data
          .focus.offset} px outside the control. It shows when a control is reached
        by keyboard, and every interactive part has it.
      </p>
    </div>
  </section>
</Leaf>
