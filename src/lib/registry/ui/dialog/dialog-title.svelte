<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    level = 2,
    ...restProps
  }: DialogPrimitive.TitleProps & {
    /**
     * The title's heading level. Kuiper's default makes it a second-level
     * heading, below the page's one first-level heading.
     */
    level?: DialogPrimitive.TitleProps["level"];
  } = $props();
</script>

<!-- A heading in the heading face; bits-ui renders role="heading" aria-level and names the dialog by it. -->
<DialogPrimitive.Title
  bind:ref
  data-slot="dialog-title"
  {level}
  class={cn("font-heading text-base font-bold", className)}
  {...restProps}
/>
