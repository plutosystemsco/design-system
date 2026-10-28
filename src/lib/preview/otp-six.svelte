<script lang="ts">
  import type { ComponentProps } from "svelte";
  import * as InputOTP from "#lib/registry/ui/input-otp";

  let {
    value = $bindable(""),
    ...rest
  }: Omit<ComponentProps<typeof InputOTP.Root>, "children"> = $props();
</script>

<InputOTP.Root bind:value {...rest}>
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells.slice(0, 3) as cell, i (i)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
    <InputOTP.Separator />
    <InputOTP.Group>
      {#each cells.slice(3, 6) as cell, i (i)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
