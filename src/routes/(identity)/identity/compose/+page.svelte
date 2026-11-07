<script lang="ts">
  import { onMount } from "svelte";
  import { QUESTIONS } from "#lib/identity/questions";
  import {
    look,
    TYPE,
    SHAPE,
    SCALE,
    COPY,
    type Behaviour,
    type Light,
  } from "#lib/identity/look";
  import { candidate } from "#lib/identity/palettes";
  import StageHero from "#lib/identity/specimens/stage-hero.svelte";
  import ProofBand from "#lib/identity/specimens/proof-band.svelte";
  import Mark from "#lib/identity/specimens/mark.svelte";
  import Wordmark from "#lib/identity/specimens/wordmark.svelte";
  import IconSet from "#lib/identity/specimens/icon-set.svelte";
  import IconKeyboard from "#lib/identity/specimens/icon-keyboard.svelte";
  import type { KeyVariant } from "#lib/identity/specimens/icon-key.svelte";
  import LightCase from "#lib/identity/specimens/light-case.svelte";
  import Ground from "#lib/identity/specimens/ground.svelte";
  import { DARK, LIGHT as WARM } from "#lib/identity/round-two";

  // The compose page: one pick per question, shown together. The picks live
  // in the address (?B=B3&D=D5…), so a composition can be sent as a link.
  // The owner's pick first; where none yet, the design lead's
  // recommendation (round two's, when a question has one).
  const recommended = Object.fromEntries(
    QUESTIONS.map((q) => [
      q.letter,
      (
        q.options.find((o) => o.chosen) ??
        q.options.find((o) => o.recommended && o.round) ??
        q.options.find((o) => o.recommended) ??
        q.options[0]
      ).id,
    ]),
  );
  let picks = $state<Record<string, string>>({ ...recommended });

  onMount(() => {
    const params = new URLSearchParams(location.search);
    for (const q of QUESTIONS) {
      const v = params.get(q.letter);
      if (v && q.options.some((o) => o.id === v)) picks[q.letter] = v;
    }
  });

  function update() {
    const params = new URLSearchParams(picks);
    history.replaceState(history.state, "", `?${params}`);
  }

  const BEHAVIOUR: Record<string, Behaviour> = {
    C1: "paper",
    C2: "moments",
    C3: "fields",
    C4: "stage",
  };
  const LIGHT: Record<string, Light> = {
    I1: "flat",
    I2: "bloom",
    I3: "four",
    I4: "glass",
  };

  const palette = $derived(candidate(picks.B).palette);
  const current = $derived(
    look({
      palette,
      behaviour: BEHAVIOUR[picks.C],
      type: TYPE[picks.D],
      shape: SHAPE[picks.H],
      // Round two's light (I5–I9) is drawn in its own panel below; the
      // reference hero keeps round one's flat light for it.
      light: LIGHT[picks.I] ?? "flat",
      scale: SCALE[picks.K],
      copy: COPY[picks.L],
    }),
  );
  const roundTwo = (letter: string) =>
    QUESTIONS.find((q) => q.letter === letter)?.options.find(
      (o) => o.id === picks[letter],
    )?.round === 2;
  const CANVAS = `--g-bg:${WARM.canvas};--g-text:${WARM.ink};--g-muted:${WARM.inkSoft};--g-line:${WARM.hairline}`;
  const GRAPHITE = `--g-bg:${DARK.canvas};--g-text:${DARK.text};--g-muted:${DARK.muted};--g-line:${DARK.hairline}`;
  const order = $derived(picks.N === "N3" || picks.N === "N4");
  const gap = $derived(picks.N === "N2" || picks.N === "N4" ? 0.16 : 0.08);
  const markOn = (c: [string, string, string, string]) =>
    (order ? [c[0], c[3], c[2], c[1]] : c) as [string, string, string, string];
  const paperMark = $derived(
    markOn([palette.blue, palette.red, palette.yellow, palette.green]),
  );
  const stageMark = $derived(
    markOn([
      palette.blueLifted,
      palette.redLifted,
      palette.yellowLifted,
      palette.greenLifted,
    ]),
  );
  const answer = $derived(QUESTIONS.map((q) => picks[q.letter]).join(" "));

  let copied = $state(false);
  async function copyAnswer() {
    try {
      await navigator.clipboard.writeText(answer);
    } catch {
      // No clipboard in this context; the line stays visible to copy by hand.
    }
    copied = true;
    setTimeout(() => (copied = false), 1600);
  }
</script>

<svelte:head><title>Compose the picks · Pluto identity</title></svelte:head>

<div class="mx-auto max-w-7xl px-6 pt-12 pb-8">
  <p class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase">
    compose · every question at once
  </p>
  <h1 class="mt-3 font-heading text-5xl font-bold tracking-display">
    Compose the picks
  </h1>
  <p class="mt-4 max-w-prose text-muted-foreground">
    Choose one option per question and see them together. It starts on the
    design lead's recommended set. The address keeps your picks, so the page can
    be sent as a link; the line below is your answer, ready to paste.
  </p>

  <form
    class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    onsubmit={(e) => e.preventDefault()}
  >
    {#each QUESTIONS as q (q.letter)}
      <label class="flex min-w-0 flex-col gap-1">
        <span class="font-mono text-xs text-muted-foreground"
          >{q.letter} · {q.title}</span
        >
        <select
          class="h-10 w-full min-w-0 rounded border border-input bg-card px-2 text-foreground"
          bind:value={picks[q.letter]}
          onchange={update}
        >
          {#each q.options as o (o.id)}
            <option value={o.id}
              >{o.id} · {o.name}{o.chosen
                ? " (chosen)"
                : o.recommended && !o.superseded
                  ? " (recommended)"
                  : ""}</option
            >
          {/each}
        </select>
      </label>
    {/each}
  </form>

  <div
    class="mt-6 flex flex-wrap items-center gap-3 rounded border border-border bg-card p-4"
  >
    <span class="font-mono text-xs text-muted-foreground lowercase"
      >your answer</span
    >
    <code class="font-mono text-base">{answer}</code>
    <button
      type="button"
      class="ml-auto rounded border border-input px-3 py-1 text-sm"
      onclick={copyAnswer}>{copied ? "Copied" : "Copy"}</button
    >
  </div>
</div>

<section
  aria-label="The mark and wordmark"
  class="mx-auto grid max-w-7xl gap-4 px-6 pb-12 md:grid-cols-2"
>
  <div class="sheet" style="background:{palette.paper}">
    <Wordmark
      variant={picks.E as "E1"}
      font={current.type.display}
      colours={paperMark}
      ink={palette.ink}
      class="wm"
    />
    <div class="row">
      <Mark colours={paperMark} {gap} class="m64" />
      <Mark colours={paperMark} {gap} class="m32" />
      <Mark colours={paperMark} {gap} class="m16" />
    </div>
  </div>
  <div class="sheet" style="background:{palette.stage}">
    <Wordmark
      variant={picks.E as "E1"}
      font={current.type.display}
      colours={stageMark}
      ink={palette.stageText}
      class="wm"
    />
    <div class="row">
      <Mark colours={stageMark} {gap} class="m64" />
      <Mark colours={stageMark} {gap} class="m32" />
      <Mark colours={stageMark} {gap} class="m16" />
    </div>
  </div>
  <p class="text-sm text-muted-foreground md:col-span-2">
    The mark here follows question N ({picks.N}). The hero below keeps the
    mark's current order; N changes only this panel.
  </p>
</section>

{#key answer}
  <StageHero
    label="The picks, on the reference hero"
    look={current}
    wordmark={picks.E as "E1"}
  />
  <ProofBand look={current} label="The picks, on the proof band" />
{/key}

{#if roundTwo("I")}
  <section aria-label="Light and depth" class="mx-auto max-w-7xl px-6 pt-12">
    <h2 class="font-heading text-2xl font-bold tracking-section">
      Light and depth, {picks.I}
    </h2>
    <p class="mt-2 text-sm text-muted-foreground">
      Round two's light, on the warm canvas and on graphite, in Deep Field.
    </p>
    <div class="mt-6 grid gap-4 lg:grid-cols-2">
      {#each ["light", "dark"] as const as theme (theme)}
        <LightCase
          variant={picks.I as "I5" | "I6" | "I7" | "I8" | "I9"}
          {theme}
        />
      {/each}
    </div>
  </section>
{/if}

<section aria-label="Product icons" class="mx-auto max-w-7xl px-6 py-12">
  <h2 class="font-heading text-2xl font-bold tracking-section">
    Product icons, {picks.G}
  </h2>
  {#if roundTwo("G")}
    <p class="mt-2 text-sm text-muted-foreground">
      Phosphor glyphs, in Deep Field.
    </p>
    <div class="mt-6 grid gap-4 lg:grid-cols-2">
      <Ground ground="paper" style={CANVAS} caption="on the warm canvas">
        <IconKeyboard variant={picks.G as KeyVariant} theme="light" />
      </Ground>
      <Ground ground="stage" style={GRAPHITE} caption="on graphite">
        <IconKeyboard variant={picks.G as KeyVariant} theme="dark" />
      </Ground>
    </div>
  {:else}
    <p class="mt-2 text-sm text-muted-foreground">Drawn in today's colours.</p>
    <div class="mt-6"><IconSet variant={picks.G as "G1"} /></div>
  {/if}
</section>

<div class="mx-auto max-w-7xl px-6 pb-16">
  <p class="max-w-prose text-muted-foreground">
    Questions without a live part on this page ({["A", "F", "J", "M"]
      .map((l) => `${l}: ${picks[l]}`)
      .join(", ")}) are still recorded in your answer line. Their boards show
    them in full.
  </p>
  <a class="mt-4 inline-block text-primary underline" href="/identity/"
    >← All questions</a
  >
</div>

<style>
  .sheet {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: flex-start;
    justify-content: center;
    min-height: 260px;
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #14161c1a;
  }
  .sheet :global(.wm) {
    font-size: 72px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 32px;
  }
  .row :global(.m64) {
    font-size: 94px;
  }
  .row :global(.m32) {
    font-size: 47px;
  }
  .row :global(.m16) {
    font-size: 24px;
  }
  @media (max-width: 600px) {
    .sheet :global(.wm) {
      font-size: 48px;
    }
    .row :global(.m64) {
      font-size: 72px;
    }
  }
</style>
