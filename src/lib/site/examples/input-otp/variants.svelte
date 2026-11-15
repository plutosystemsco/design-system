<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "Six 48 px cells in two groups of three, over one real input. The active cell has a blue border and a still caret.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as InputOTP from "#lib/registry/ui/input-otp";
</script>

<Field.Field class="max-w-md">
  <Field.Label>Verification code</Field.Label>
  <InputOTP.Root maxlength={6}>
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
</Field.Field>
