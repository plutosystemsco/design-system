<script lang="ts">
  import { FourDot } from "#lib/registry/ui/four-dot";
  import { QUESTIONS } from "#lib/identity/questions";

  const recommended = QUESTIONS.flatMap((q) =>
    q.options.filter((o) => o.recommended && !o.round).map((o) => ({ q, o })),
  );
</script>

<svelte:head><title>Pluto identity · the options</title></svelte:head>

<div class="mx-auto max-w-7xl px-6 pt-16 pb-12">
  <p class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase">
    pluto systems · identity · round one 2026-11-01 · round two 2026-11-06
  </p>
  <h1 class="mt-4 max-w-4xl font-heading text-5xl font-bold tracking-display">
    An identity that can stand beside Google's.
  </h1>
  <p class="mt-6 max-w-prose text-muted-foreground">
    Fourteen questions decide the brand. Each has three to five options, shown
    live, with what each is for and against. The four-dot mark keeps its blue,
    red, yellow and green; everything else is open. Pick one option per
    question, or mix them, and say what to change. The compose page puts your
    picks together on one reference page.
  </p>
  <p class="mt-4 max-w-prose text-muted-foreground">
    The owner answered on 2026-11-06. Ten questions are settled; their picks are
    marked chosen. Four go to a second round of options, marked round two.
  </p>
  <div class="mt-8 flex flex-wrap gap-4">
    <a
      href="/identity/{QUESTIONS[0].slug}/"
      class="rounded bg-primary px-4 py-2 font-medium text-primary-foreground"
      >Start with question A</a
    >
    <a
      href="/identity/compose/"
      class="rounded border border-input bg-card px-4 py-2 font-medium text-foreground"
      >Compose the picks</a
    >
  </div>
</div>

<section aria-labelledby="questions" class="mx-auto max-w-7xl px-6 pb-16">
  <h2 id="questions" class="sr-only">The questions</h2>
  <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each QUESTIONS as q (q.slug)}
      <li>
        <a
          href="/identity/{q.slug}/"
          class="flex h-full flex-col gap-2 rounded border border-border bg-card p-6 hover:bg-accent"
        >
          <span
            class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase"
            >question {q.letter}</span
          >
          <span class="font-heading text-2xl font-bold tracking-section"
            >{q.title}</span
          >
          <span class="text-muted-foreground">{q.question}</span>
          <span class="mt-auto pt-2 font-mono text-xs font-medium">
            {q.options.some((o) => o.chosen)
              ? `chosen: ${q.options
                  .filter((o) => o.chosen)
                  .map((o) => o.id)
                  .join(", ")}`
              : q.deferred
                ? "left out for now"
                : "round two"}
          </span>
          <span class="font-mono text-xs text-muted-foreground">
            {q.options.length
              ? q.options.map((o) => o.id).join(" · ")
              : "five measured palettes"}
          </span>
        </a>
      </li>
    {/each}
  </ol>
</section>

<section
  aria-labelledby="recommended"
  class="groove-s mx-auto max-w-7xl px-6 py-16"
>
  <div class="flex items-center gap-3">
    <FourDot class="text-5xl" />
    <h2
      id="recommended"
      class="font-heading text-2xl font-bold tracking-section"
    >
      The design lead's first recommended set
    </h2>
  </div>
  <p class="mt-4 max-w-prose text-muted-foreground">
    One coherent direction, offered on 2026-11-01 as a starting point. Kept as
    the record; the owner's picks above replace it.
  </p>
  <dl class="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
    {#each recommended as { q, o } (o.id)}
      <div class="flex gap-4">
        <dt class="w-12 shrink-0 font-mono text-base font-medium">{o.id}</dt>
        <dd>
          <a
            class="font-medium text-primary underline"
            href="/identity/{q.slug}/#{o.id}">{q.title}: {o.name}</a
          >
          <span class="block text-muted-foreground">{o.idea}</span>
        </dd>
      </div>
    {/each}
  </dl>
</section>
