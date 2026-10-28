<script lang="ts">
  import { PinInput as InputOTPPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    cell,
    class: className,
    ...restProps
  }: InputOTPPrimitive.CellProps = $props();
</script>

<!-- A 48 px square; the active cell's border is blue, and its caret is static. -->
<InputOTPPrimitive.Cell
  {cell}
  bind:ref
  data-slot="input-otp-slot"
  class={cn(
    "relative flex size-12 items-center justify-center border-y border-r border-input bg-card text-base text-foreground transition-[border-color] first:rounded-l first:border-l last:rounded-r data-[active=true]:z-10 data-[active=true]:border-ring",
    className,
  )}
  {...restProps}
>
  {#snippet child({ props })}
    <div {...props} data-active={cell.isActive}>
      {cell.char}
      {#if cell.hasFakeCaret}
        <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div class="h-4 w-(--focus-width) bg-foreground"></div>
        </div>
      {/if}
    </div>
  {/snippet}
</InputOTPPrimitive.Cell>
