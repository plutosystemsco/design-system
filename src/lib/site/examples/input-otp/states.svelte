<script lang="ts" module>
  export const meta = {
    title: "States",
    intro:
      "Empty, partly filled, complete, invalid with its error, and disabled.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as InputOTP from "#lib/registry/ui/input-otp";
</script>

{#snippet code(value: string, disabled: boolean)}
  <InputOTP.Root maxlength={6} {value} {disabled}>
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
{/snippet}

<div class="grid max-w-md gap-8">
  <div data-testid="otp-paste">
    <Field.Field>
      <Field.Label>Empty</Field.Label>
      {@render code("", false)}
    </Field.Field>
  </div>
  <Field.Field>
    <Field.Label>Partly filled</Field.Label>
    {@render code("123", false)}
  </Field.Field>
  <Field.Field>
    <Field.Label>Complete</Field.Label>
    {@render code("123456", false)}
  </Field.Field>
  <div data-testid="invalid">
    <Field.Field error="That code has expired. We sent a new one.">
      <Field.Label>Invalid, with its error</Field.Label>
      {@render code("123456", false)}
    </Field.Field>
  </div>
  <Field.Field>
    <Field.Label>Disabled</Field.Label>
    {@render code("", true)}
  </Field.Field>
</div>
