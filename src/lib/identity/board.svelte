<script lang="ts">
  import type { Snippet } from "svelte";
  import { QUESTIONS, ordered as inOrder, type Question } from "./questions.ts";

  let {
    question,
    count,
    children,
  }: { question: Question; count?: number; children: Snippet } = $props();

  const index = $derived(QUESTIONS.findIndex((q) => q.slug === question.slug));
  const prev = $derived(index > 0 ? QUESTIONS[index - 1] : undefined);
  const next = $derived(
    index < QUESTIONS.length - 1 ? QUESTIONS[index + 1] : undefined,
  );
  const n = $derived(count ?? question.options.length);
  const ordered = $derived(inOrder(question));
</script>

<svelte:head
  ><title>{question.letter}. {question.title} · Pluto identity</title
  ></svelte:head
>

<div class="mx-auto max-w-7xl px-6 pt-12 pb-8">
  <p class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase">
    question {question.letter} · {index + 1} of {QUESTIONS.length} · {n} options
  </p>
  <h1 class="mt-3 font-heading text-5xl font-bold tracking-display">
    {question.title}
  </h1>
  <p class="mt-4 max-w-3xl text-2xl font-medium tracking-section">
    {question.question}
  </p>
  <p class="mt-4 max-w-prose text-muted-foreground">{question.why}</p>
  {#if question.deferred}
    <p class="mt-4 max-w-prose font-medium">{question.deferred}</p>
  {/if}
  {#if question.options.length}
    <nav aria-label="Options" class="mt-6 flex flex-wrap gap-2">
      {#each ordered as option (option.id)}
        <a
          href="#{option.id}"
          class="rounded border border-border bg-card px-3 py-1 font-mono text-xs text-foreground hover:bg-accent"
          >{option.id} · {option.name}</a
        >
      {/each}
    </nav>
  {/if}
</div>

{@render children()}

<div class="mx-auto max-w-7xl px-6 py-16">
  <div class="groove-b mb-8"></div>
  <p class="max-w-prose text-muted-foreground">
    To answer, name an option by its id, such as
    <span class="font-mono text-foreground">{question.letter}2</span>, or mix
    them: “{question.letter}2, with {question.letter}4's …”. Notes on any option
    are welcome.
  </p>
  <nav aria-label="Questions" class="mt-6 flex flex-wrap justify-between gap-4">
    {#if prev}
      <a class="text-primary underline" href="/identity/{prev.slug}/"
        >← {prev.letter}. {prev.title}</a
      >
    {:else}
      <a class="text-primary underline" href="/identity/">← All questions</a>
    {/if}
    {#if next}
      <a class="text-primary underline" href="/identity/{next.slug}/"
        >{next.letter}. {next.title} →</a
      >
    {:else}
      <a class="text-primary underline" href="/identity/compose/"
        >Compose the picks →</a
      >
    {/if}
  </nav>
</div>
