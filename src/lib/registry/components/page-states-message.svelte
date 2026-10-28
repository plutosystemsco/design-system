<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Empty from "#lib/registry/ui/empty";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import CaretRight from "phosphor-svelte/lib/CaretRight";
  import { cn } from "#lib/utils";

  let {
    title,
    description,
    level = 1,
    align = "start",
    icon,
    action,
    link,
    status,
    reference,
    class: className,
  }: {
    title: string;
    /** One or two sentences: what happened, and what to do. */
    description: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    /** "start" on a full page; "center" in a tile. */
    align?: "start" | "center";
    /** An optional monochrome icon, hidden from assistive technology. */
    icon?: Snippet;
    /** The one primary action. */
    action?: Snippet;
    /** At most one link. */
    link?: Snippet;
    /** A status code, shown in mono under the description. */
    status?: number;
    /** A request id or build hash, inside a closed details element. */
    reference?: string;
    class?: string;
  } = $props();

  const start = $derived(align === "start");
  // The disclosure's state, shown by its caret: right when closed, down open.
  let open = $state(false);
</script>

<!--
  The family's one shape: an optional icon, a heading, a sentence or two, one
  action and at most one link. No red, no apology, no code in the words.
-->
<Empty.Root
  class={cn(
    "gap-6 p-0",
    start && "items-start justify-start text-left",
    className,
  )}
>
  <Empty.Header class={cn(start && "max-w-prose items-start")}>
    {#if icon}
      <Empty.Media variant="icon">{@render icon()}</Empty.Media>
    {/if}
    <!-- A page's h1 outranks everything under it: 44 px from sm. -->
    <Empty.Title
      {level}
      class={cn(level === 1 && "sm:text-5xl sm:tracking-display")}
      >{title}</Empty.Title
    >
    <Empty.Description
      class={cn("text-base", start && "max-w-prose text-left")}
    >
      {description}
    </Empty.Description>
    {#if status !== undefined}
      <p class="font-mono text-xs text-muted-foreground">
        status <code>{status}</code>
      </p>
    {/if}
  </Empty.Header>
  {#if action || link}
    <Empty.Content class={cn(start && "max-w-prose items-start")}>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        {@render action?.()}
        {@render link?.()}
      </div>
    </Empty.Content>
  {/if}
  {#if reference}
    <details bind:open class="text-sm text-muted-foreground">
      <summary class="inline-flex min-h-6 cursor-pointer items-center gap-2">
        {#if open}
          <CaretDown aria-hidden="true" class="size-4" />
        {:else}
          <CaretRight aria-hidden="true" class="size-4" />
        {/if}
        <span class="underline underline-offset-4">Technical details</span>
      </summary>
      <p class="mt-2">
        Reference <code class="font-mono text-foreground">{reference}</code>
      </p>
    </details>
  {/if}
</Empty.Root>
