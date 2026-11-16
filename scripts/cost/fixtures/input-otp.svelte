<script lang="ts">
  import * as InputOTP from "#lib/components/ui/input-otp";
</script>

<InputOTP.Root maxlength={6} aria-label="Verification code">
  {#snippet children({ cells })}
    <InputOTP.Group>
      {#each cells as cell, i (i)}
        <InputOTP.Slot {cell} />
      {/each}
    </InputOTP.Group>
  {/snippet}
</InputOTP.Root>
