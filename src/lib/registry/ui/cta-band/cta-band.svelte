<script lang="ts" module>
  import type { ButtonVariant } from "#lib/registry/ui/button";

  /** A call to action: a link styled as a button. The first is filled by default. */
  export type CtaBandAction = {
    /** The link's text. */
    label: string;
    /** Where the link goes. */
    href: string;
    /**
     * The link's look, as `Button`'s. Without it, the first is filled and the
     * rest are secondary.
     */
    variant?: ButtonVariant;
  };
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    title,
    description,
    actions,
    headingLevel = 2,
    class: className,
    ...restProps
  }: WithElementRef<Omit<HTMLAttributes<HTMLElement>, "title" | "children">> & {
    /** The band's heading, which names it. */
    title: string;
    /** A line under the heading. */
    description?: string;
    /** One or two. */
    actions: CtaBandAction[];
    /** The heading's level, so the band fits the page's outline. */
    headingLevel?: 2 | 3;
  } = $props();

  const uid = $props.id();
</script>

<!--
  A closing section, named by its heading in the section step. Its actions
  are at the action height with the 8 px case radius, each pressed in its own
  wrapper; the band sets the expressive mode itself, so they take the mode's
  volume on any ground. No ground of its own: a parent places it.
-->
<section
  bind:this={ref}
  data-slot="cta-band"
  data-mode="expressive"
  aria-labelledby="{uid}-title"
  class={cn("flex flex-col items-start gap-6", className)}
  {...restProps}
>
  <svelte:element
    this={headingLevel === 2 ? "h2" : "h3"}
    id="{uid}-title"
    class="type-section text-balance"
  >
    {title}
  </svelte:element>
  {#if description}
    <p class="max-w-prose text-muted-foreground">{description}</p>
  {/if}
  <div class="flex flex-wrap gap-3">
    {#each actions as action, index (index)}
      <span class="action-press inline-flex">
        <Button
          href={action.href}
          variant={action.variant ?? (index === 0 ? "default" : "secondary")}
          class="h-(--size-action) px-6">{action.label}</Button
        >
      </span>
    {/each}
  </div>
</section>
