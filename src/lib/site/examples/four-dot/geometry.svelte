<script lang="ts" module>
  export const meta = {
    title: "Geometry",
    intro:
      "The lockup at 100 px, on the baseline beside a zero-size probe whose bottom edge is the baseline, so its geometry can be measured.",
  };
</script>

<script lang="ts">
  import { Lockup } from "#lib/registry/ui/four-dot";
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  role="region"
  aria-label="The lockup at 100 px"
  tabindex="0"
  class="overflow-x-auto py-6 scrollbar"
>
  <div
    data-testid="geometry"
    class="flex items-baseline"
    style="font-size: 100px"
  >
    <Lockup data-testid="geometry-lockup" />
    <span
      data-testid="baseline-probe"
      class="inline-block"
      style="width: 0; height: 0"
    ></span>
  </div>
</div>
