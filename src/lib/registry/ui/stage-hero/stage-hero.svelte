<script lang="ts" module>
  import type { ButtonVariant } from "#lib/registry/ui/button";

  /** A call to action: a link styled as a button. The first is filled by default. */
  export type StageHeroAction = {
    label: string;
    href: string;
    variant?: ButtonVariant;
  };

  /** The colour field the object sits on. */
  export type StageHeroField = "field-1" | "field-2" | "field-3" | "field-4";

  // Each class written out in full, so Tailwind finds it in this file and an
  // installed app emits it (012 decision 3).
  const FIELDS: Record<StageHeroField, string> = {
    "field-1": "field-1",
    "field-2": "field-2",
    "field-3": "field-3",
    "field-4": "field-4",
  };
</script>

<script lang="ts">
  import type { Snippet } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { pointerLight } from "#lib/registry/ui/liquid-glass";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    eyebrow,
    title,
    description,
    actions,
    object,
    strip,
    field = "field-1",
    poster = false,
    fill = true,
    underBar = false,
    headingLevel = 1,
    class: className,
    ...restProps
  }: WithElementRef<
    Omit<HTMLAttributes<HTMLDivElement>, "title" | "children">
  > & {
    /** A short line above the title, in mono. */
    eyebrow?: string;
    title: string;
    description: string;
    /** One or two. */
    actions: StageHeroAction[];
    /**
     * The object, on a colour field: opaque things only (cards carrying
     * `surface-plain`, figures, images). Without it there is no field and no
     * glass, and the hero goes only in a canvas stage.
     */
    object?: Snippet;
    /** A row along the bottom of the screen, such as a name strip. */
    strip?: Snippet;
    /** The field the object sits on. */
    field?: StageHeroField;
    /** The poster title, 56 to 160 px: for launches only (K3). */
    poster?: boolean;
    /** Fills the screen less the bar, so the next section is below the fold. */
    fill?: boolean;
    /** Beneath a bar that overlays it: the whole screen's height, its words clear of the bar (010 decision 5). */
    underBar?: boolean;
    /** 1 when the hero holds the page's one h1; 2 beside another h1 (010 decision 5). */
    headingLevel?: 1 | 2;
  } = $props();
</script>

{#snippet words()}
  {#if eyebrow}
    <p
      class="font-mono text-xs font-medium tracking-eyebrow text-muted-foreground lowercase"
    >
      {eyebrow}
    </p>
  {/if}
  <svelte:element
    this={headingLevel === 1 ? "h1" : "h2"}
    class={cn(
      "max-w-full text-foreground",
      poster
        ? "type-poster break-words hyphens-auto"
        : "type-display text-balance",
    )}
  >
    {title}
  </svelte:element>
  <p class="max-w-prose text-base text-muted-foreground">{description}</p>
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
{/snippet}

<!--
  A page's first screen (012 decision 3). With an object: from lg, a twelve-
  column grid whose gap is the stage's gutter. The words sit in a glass panel
  over columns 1 to 7, lit where the pointer moves; the field spans columns 5
  to 12 behind it, a subgrid of those eight, and the object takes its last
  five (the hero's 8 to 12), so the glass overlaps the field by three columns
  and the object is clear of the glass by one gap. Both sit in row 1; the
  glass is positioned and the field is not, so the glass paints above it.
  Below lg the panel comes first and overlaps the field's top by the gutter.
  Without an object there is no field and no glass: the words sit on the
  stage's ground, a canvas. With `fill` the hero is the screen's height less
  the bar, and the strip sits at its bottom on the stage's ground; with
  `underBar` it is the whole screen, padded by the bar that overlays its top.
-->
<div
  bind:this={ref}
  data-slot="stage-hero"
  class={cn(
    "flex flex-col",
    fill && (underBar ? "min-h-svh" : "min-h-(--size-hero-fill)"),
    // Its words clear an overlaying bar whether or not it fills the screen.
    underBar && "pt-(--size-bar)",
    className,
  )}
  {...restProps}
>
  {#if object}
    <div
      class="grid flex-1 content-center py-16 lg:grid-cols-12 lg:gap-x-(--gutter-stage)"
    >
      <div
        data-slot="stage-hero-panel"
        class="glass flex min-w-0 flex-col items-start gap-6 p-(--gutter-stage) lg:col-start-1 lg:col-end-8 lg:row-start-1 lg:self-center"
        {@attach pointerLight}
      >
        {@render words()}
      </div>
      <div
        data-slot="stage-hero-field"
        class={cn(
          FIELDS[field],
          "-mt-(--gutter-stage) rounded-lg pt-(--gutter-stage) lg:col-start-5 lg:col-end-13 lg:row-start-1 lg:mt-0 lg:grid lg:grid-cols-subgrid lg:pt-0",
        )}
      >
        <div
          data-slot="stage-hero-object"
          class="min-w-0 p-(--gutter-stage) lg:col-start-4 lg:col-end-9 lg:self-center lg:ps-0"
        >
          {@render object()}
        </div>
      </div>
    </div>
  {:else}
    <div class="flex flex-1 flex-col items-start justify-center gap-6 py-16">
      {@render words()}
    </div>
  {/if}
  {#if strip}
    <div data-slot="stage-hero-strip" class="pb-8">
      {@render strip()}
    </div>
  {/if}
</div>
