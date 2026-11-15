<script lang="ts">
  import LadderFigure from "#lib/site/brand/ladder-figure.svelte";
  import { door } from "#lib/site/doors";
  import Specimen from "#lib/site/foundations/specimen.svelte";
  import Table from "#lib/site/foundations/table.svelte";
  import Leaf from "#lib/site/page/leaf.svelte";
  import { componentPath, sitePage } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const page = sitePage("/foundations/type/")!;

  const JOBS: Record<string, string> = {
    sans: "Reading: body text, labels, controls.",
    heading: "Display: headings, the lockup, poster type.",
    mono: "Code, keys and samples.",
  };
  // 018 decision 12: each sample is set by the utility it shows. A step the
  // token file adds before it is named here is set from its numbers.
  const SCALE: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    "2xl": "text-2xl",
    "5xl": "text-5xl",
  };
  const DISPLAY: Record<string, string> = {
    display: "type-display",
    section: "type-section",
    proof: "type-proof",
    poster: "type-poster",
  };
  const SAMPLE = "Work runs on data.";
  const rem = (px: number) => `${px / 16}rem`;
  const families = $derived(Object.entries(data.families));
  const scale = $derived(Object.entries(data.scale));
  const tracking = $derived(Object.entries(data.tracking));
  const steps = $derived(Object.entries(data.steps));
  const name = (family: string) =>
    family
      .split(",")[0]
      .replaceAll("'", "")
      .replace(/ Variable$/, "");
</script>

<Leaf
  door={door("foundations")}
  title={page.title}
  summary={page.summary}
  sections={[
    { id: "families", title: "Families" },
    { id: "scale", title: "The text scale" },
    { id: "tracking", title: "Tracking and weight" },
    { id: "display", title: "Display steps" },
  ]}
>
  <p>
    Three faces, each with one job. The theme brings all three as variable
    fonts, so every weight comes from one file per face. A product screen uses
    the text scale; the display steps are for expressive pages.
  </p>

  <section aria-labelledby="families" class="mt-16">
    <h2 id="families" class="text-2xl font-semibold tracking-section">
      Families
    </h2>
    <p class="mt-4">Each face's sample is set at <code>text-2xl</code>.</p>
    <Table
      label="Families"
      head={["Face", "Sample", "Its job", "Variable", "Part"]}
    >
      {#each families as [id, f] (id)}
        <tr data-family-row={id}>
          <td>{name(f.family)}</td>
          <td><Specimen text={SAMPLE} class="text-2xl" family={f.family} /></td>
          <td>{JOBS[id] ?? ""}</td>
          <td><code>{f.variable}</code></td>
          <td
            ><a
              href={componentPath(f.item)}
              class="text-primary underline underline-offset-4">{f.item}</a
            ></td
          >
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="scale" class="mt-16">
    <h2 id="scale" class="text-2xl font-semibold tracking-section">
      The text scale
    </h2>
    <p class="mt-4">
      Tailwind's text utilities, with this system's sizes and leading. Base is
      16 px.
    </p>
    <Table
      label="The text scale"
      head={["Utility", "Sample", "Size", "Leading"]}
    >
      {#each scale as [id, s] (id)}
        <tr data-scale-row={id}>
          <td><code>text-{id}</code></td>
          <td
            >{#if SCALE[id]}<Specimen
                text={SAMPLE}
                class={SCALE[id]}
              />{:else}<Specimen
                text={SAMPLE}
                size={rem(s.px)}
                leading={s.lineHeight}
              />{/if}</td
          >
          <td class="tabular-nums">{s.px} px</td>
          <td class="tabular-nums">{s.lineHeight}</td>
        </tr>
      {/each}
    </Table>
  </section>

  <section aria-labelledby="tracking" class="mt-16">
    <h2 id="tracking" class="text-2xl font-semibold tracking-section">
      Tracking and weight
    </h2>
    <p class="mt-4">
      Large type is set tighter, and small capitals looser. Each value is in
      ems, so it scales with the size.
    </p>
    <Table label="Tracking" head={["Utility", "Tracking"]}>
      {#each tracking as [id, v] (id)}
        <tr data-tracking-row={id}>
          <td><code>tracking-{id}</code></td>
          <td class="tabular-nums">{v} em</td>
        </tr>
      {/each}
    </Table>
    <p class="mt-6">
      The text weights: {data.weight.normal} for text, {data.weight.medium}
      for labels and {data.weight.bold} for bold, as in the lockup's word. Each display
      step sets its own weight, below.
    </p>
  </section>

  <section aria-labelledby="display" class="mt-16">
    <h2 id="display" class="text-2xl font-semibold tracking-section">
      Display steps
    </h2>
    <p class="mt-4">
      Four steps of display type, in {name(data.families.heading.family)}. Each
      grows with the window between its smallest and largest size. They are for
      expressive pages: a product screen's headings use the text scale.
    </p>
    <Table
      label="Display steps"
      head={[
        "Utility",
        "Sample",
        "Smallest",
        "Grows",
        "Largest",
        "Leading",
        "Tracking",
        "Weight",
      ]}
    >
      {#each steps as [id, s] (id)}
        <tr data-step-row={id}>
          <td><code>type-{id}</code></td>
          <td
            >{#if DISPLAY[id]}<Specimen
                text="Pluto"
                class={DISPLAY[id]}
              />{:else}<Specimen
                text="Pluto"
                class="font-semibold"
                family={data.families.heading.family}
                size="clamp({rem(s.minPx)}, {s.vw}vw, {rem(s.maxPx)})"
                leading={s.lineHeight}
              />{/if}</td
          >
          <td class="tabular-nums">{s.minPx} px</td>
          <td class="tabular-nums">{s.vw} vw</td>
          <td class="tabular-nums">{s.maxPx} px</td>
          <td class="tabular-nums">{s.lineHeight}</td>
          <td class="tabular-nums">{s.tracking} em</td>
          <td class="tabular-nums">{s.weight}</td>
        </tr>
      {/each}
    </Table>
    <figure class="mt-6 grid gap-4">
      <LadderFigure {steps} />
      <figcaption class="text-sm text-muted-foreground">
        Each step's em box at its smallest and its largest, and its line height,
        drawn from the token file.
      </figcaption>
    </figure>
  </section>
</Leaf>
