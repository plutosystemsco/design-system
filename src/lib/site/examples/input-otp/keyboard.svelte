<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro: "One stop.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as InputOTP from "#lib/registry/ui/input-otp";
</script>

<div data-testid="keyboard-fixture" class="max-w-md">
  <Field.Field>
    <Field.Label>Code from your authenticator</Field.Label>
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
</div>
