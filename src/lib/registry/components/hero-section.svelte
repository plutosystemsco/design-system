<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { Button } from "#lib/registry/ui/button";
  import { cn } from "#lib/utils";

  type Link = { label: string; href: string };

  let {
    eyebrow,
    title,
    description,
    action,
    secondary,
    media,
    class: className,
    ...restProps
  }: Omit<HTMLAttributes<HTMLElement>, "title"> & {
    /** A short mono line above the heading, lowercase. */
    eyebrow?: string;
    /** The page's one heading. */
    title: string;
    /** One sentence. */
    description: string;
    /** The one primary call to action: a link named by its result. */
    action: Link;
    /** An optional secondary link. */
    secondary?: Link;
    /** Real evidence beside the copy from lg, such as a code block. */
    media?: Snippet;
    class?: string;
  } = $props();
</script>

<!--
  A page's opening: no mark, and nothing moves. The heading is 28 px below sm
  and 44 px from sm, with no size between.
-->
<section
  data-slot="hero-section"
  class={cn(
    "flex flex-col gap-12",
    media && "lg:grid lg:grid-cols-2 lg:items-center lg:gap-12",
    className,
  )}
  {...restProps}
>
  <div class="flex flex-col gap-6">
    {#if eyebrow}
      <p
        class="font-mono text-xs font-medium tracking-eyebrow text-muted-foreground lowercase"
      >
        {eyebrow}
      </p>
    {/if}
    <h1
      class="font-heading text-2xl font-bold tracking-section text-foreground sm:text-5xl sm:tracking-display"
    >
      {title}
    </h1>
    <p class="max-w-prose text-muted-foreground">{description}</p>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Button href={action.href} class="w-full sm:w-auto">{action.label}</Button
      >
      {#if secondary}
        <Button variant="link" href={secondary.href} class="self-start"
          >{secondary.label}</Button
        >
      {/if}
    </div>
  </div>
  {#if media}
    <div>{@render media()}</div>
  {/if}
</section>
