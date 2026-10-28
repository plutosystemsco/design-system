<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { Skeleton } from "#lib/registry/ui/skeleton";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";

  let {
    loading,
    label = "Loading",
    rows = 3,
    children,
    class: className,
  }: {
    loading: boolean;
    /** What the hidden status says while loading. */
    label?: string;
    /** Skeleton rows while loading. */
    rows?: number;
    /** The loaded content. */
    children: Snippet;
    class?: string;
  } = $props();

  // The status region renders empty, and its text arrives after mount, so the
  // region is in the page before its text changes. Mount this component
  // before loading starts and drive `loading`, rather than mounting it at the
  // moment loading begins.
  let mounted = $state(false);
  onMount(() => {
    mounted = true;
  });
</script>

<!-- A static skeleton on an inset: no shimmer, no spinner, no control inside. -->
<div
  data-slot="page-states-loading"
  aria-busy={loading ? "true" : "false"}
  class={cn(className)}
>
  {#if loading}
    <div class="flex flex-col gap-6">
      {#each Array.from({ length: rows }, (_, i) => i) as row (row)}
        <div
          data-slot="page-states-row"
          aria-hidden="true"
          class="flex flex-col gap-2"
        >
          <Skeleton class="h-6 w-1/2" />
          <Skeleton class="h-4 w-1/3" />
        </div>
      {/each}
    </div>
  {:else}
    {@render children()}
  {/if}
</div>
<Status text={loading && mounted ? label : ""} />
