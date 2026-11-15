<script lang="ts">
  import type { Snippet } from "svelte";
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import type { Door } from "../doors.ts";

  let {
    door,
    title,
    fact,
    sentence,
    glass,
  }: {
    door: Door;
    /** The band's title: the door's name, or what stands for it. */
    title: Snippet;
    /** One number in the proof step, where the door has one. */
    fact?: Snippet;
    sentence: Snippet;
    /** The glass panel: every control on the band sits inside it. */
    glass?: Snippet;
  } = $props();
</script>

<!--
  A landing's band: the door's field, full bleed, from the top of the page,
  under the floating bar. Its text is the field's legend; the glass carries
  the theme's own roles. It shares its transition name with the door's disc
  on the home page, so the disc grows into it.
-->
<div
  data-slot="band"
  data-mode="expressive"
  class="field-{door.n} pt-[calc(var(--site-bar-room)+var(--spacing)*14)] pb-16"
  style:view-transition-name="door-{door.id}"
>
  <div
    class="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] items-start gap-10 px-(--gutter-stage) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-xl))]"
  >
    <div class="min-w-0">
      <h1 class="type-display">{@render title()}</h1>
      {#if fact}
        <div class="mt-8 flex flex-wrap items-baseline gap-4">
          <span class="type-proof">{@render fact()}</span>
          <p class="max-w-(--container-2xs) text-xl text-balance">
            {@render sentence()}
          </p>
        </div>
      {:else}
        <div class="mt-6 grid max-w-prose gap-2 text-xl text-balance">
          {@render sentence()}
        </div>
      {/if}
    </div>
    {#if glass}
      <div class="glass min-w-0 p-5" {@attach pointerLight}>
        {@render glass()}
      </div>
    {/if}
  </div>
</div>
