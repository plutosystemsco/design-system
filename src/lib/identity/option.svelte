<script lang="ts">
  import type { Snippet } from "svelte";
  import type { Option } from "./questions.ts";

  let {
    option,
    specimen,
    bleed = false,
  }: {
    option: Option;
    /** The option shown, not described. */
    specimen: Snippet;
    /** Full width for a specimen that needs the whole screen (a stage). */
    bleed?: boolean;
  } = $props();
</script>

<section
  id={option.id}
  aria-labelledby="{option.id}-name"
  class="groove-s scroll-mt-4 py-16"
>
  <div class="mx-auto max-w-7xl px-6">
    <div class="flex flex-wrap items-baseline gap-x-4 gap-y-2">
      <span
        class="rounded border border-foreground px-2 font-mono text-base font-medium"
        >{option.id}</span
      >
      <h2
        id="{option.id}-name"
        class="font-heading text-2xl font-bold tracking-section"
      >
        {option.name}
      </h2>
      {#if option.chosen}
        <span
          class="rounded bg-foreground px-2 font-mono text-xs font-medium text-background lowercase"
          >chosen</span
        >
      {/if}
      {#if option.round}
        <span
          class="rounded border border-primary px-2 font-mono text-xs font-medium text-primary lowercase"
          >round two</span
        >
      {/if}
      {#if option.recommended}
        <span
          class="rounded bg-primary px-2 font-mono text-xs font-medium text-primary-foreground lowercase"
          >{option.superseded
            ? "recommended in round one"
            : "recommended"}</span
        >
      {/if}
    </div>
    <p class="mt-2 max-w-3xl text-base">{option.idea}</p>
  </div>

  <div class={bleed ? "mt-8" : "mx-auto mt-8 max-w-7xl px-6"}>
    {@render specimen()}
  </div>

  <div class="mx-auto mt-8 grid max-w-7xl gap-8 px-6 md:grid-cols-3">
    <p class="text-muted-foreground">{option.body}</p>
    <div>
      <p
        class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase"
      >
        for
      </p>
      <ul class="mt-2 flex flex-col gap-1">
        {#each option.pros as pro (pro)}<li>+ {pro}</li>{/each}
      </ul>
    </div>
    <div>
      <p
        class="font-mono text-xs tracking-eyebrow text-muted-foreground lowercase"
      >
        against
      </p>
      <ul class="mt-2 flex flex-col gap-1">
        {#each option.cons as con (con)}<li>− {con}</li>{/each}
      </ul>
      {#if option.learns}
        <p class="mt-4 font-mono text-xs text-muted-foreground">
          learns from: {option.learns}
        </p>
      {/if}
    </div>
  </div>
</section>
