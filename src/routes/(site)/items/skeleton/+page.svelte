<script lang="ts">
  import { Skeleton } from "#lib/registry/ui/skeleton";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="skeleton" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A static block on the muted inset. It does not shimmer: nothing moves while a person reads."
>
  <div class="grid max-w-md gap-12">
    <Specimen caption="card-shaped" class="w-full">
      <div class="grid w-full gap-3 rounded border border-border bg-card p-6">
        <Skeleton class="h-6 w-1/2" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>
    </Specimen>
    <Specimen caption="row-shaped" class="w-full">
      <div class="flex w-full items-center gap-4">
        <Skeleton class="size-12" />
        <div class="grid flex-1 gap-2">
          <Skeleton class="h-4 w-2/3" />
          <Skeleton class="h-4 w-1/3" />
        </div>
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <p class="max-w-prose text-sm text-muted-foreground">
    One state. The region it fills carries <code>aria-busy</code> while it loads.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>Hidden from assistive technology: <code>aria-hidden="true"</code>.</li>
    <li>Static, so it never loops.</li>
  </ul>
</PreviewSection>
