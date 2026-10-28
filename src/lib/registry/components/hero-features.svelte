<script lang="ts">
  import type { Component } from "svelte";
  import { cn } from "#lib/utils";

  type Feature = {
    title: string;
    description: string;
    /** A decorative, monochrome icon, such as one from phosphor-svelte. */
    icon?: Component<{ class?: string; "aria-hidden"?: "true" }>;
  };

  let {
    title,
    id,
    features,
    class: className,
  }: {
    /** The section's heading. */
    title: string;
    /** The section's id, for a link to it. */
    id?: string;
    features: Feature[];
    class?: string;
  } = $props();
</script>

<!--
  A ruled list, not cards: each feature has a groove across its top. One
  column below sm, two from sm, three from lg.
-->
<section
  {id}
  data-slot="hero-features"
  class={cn("flex flex-col gap-8", className)}
>
  <h2 class="font-heading text-2xl font-bold tracking-section text-foreground">
    {title}
  </h2>
  <ul
    role="list"
    class="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3"
  >
    {#each features as feature (feature.title)}
      <li class="groove flex flex-col gap-3 pt-6">
        {#if feature.icon}
          <feature.icon class="size-6 text-foreground" aria-hidden="true" />
        {/if}
        <h3 class="font-heading text-base font-bold text-foreground">
          {feature.title}
        </h3>
        <p class="text-muted-foreground">{feature.description}</p>
      </li>
    {/each}
  </ul>
</section>
