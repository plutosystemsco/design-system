<script lang="ts">
  import { PinInput as InputOTPPrimitive, REGEXP_ONLY_DIGITS } from "bits-ui";
  import { getContext } from "svelte";
  import { cn } from "#lib/utils";

  /** The contract a `Field` sets under the key "pluto:field" (field decision 11). */
  type FieldContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
  };

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    maxlength = 6,
    pattern = REGEXP_ONLY_DIGITS,
    pasteTransformer = (text: string) => text.replace(/\D/g, ""),
    inputId,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    ...restProps
  }: Omit<InputOTPPrimitive.RootProps, "maxlength"> & {
    /** The number of cells. Default 6. */
    maxlength?: number;
  } = $props();

  const field = getContext<FieldContext | undefined>("pluto:field");
</script>

<!--
  One real input under the cells, with autocomplete="one-time-code" and
  inputmode="numeric" (bits-ui's defaults). A pasted code loses every
  non-digit first, so "123 456" or a trailing newline still fills six cells.
  bits-ui gives the input an inline style that hides its focus indicator, so
  this root draws it, and turns the cells' borders red when the input is
  invalid.
-->
<div
  data-slot="input-otp"
  class={cn(
    "inline-flex w-fit rounded has-disabled:opacity-50 has-[:focus-visible]:focus-ring",
    // Invalid: the hidden input carries aria-invalid; every cell's border turns red.
    "has-[input[aria-invalid=true]]:**:data-[slot=input-otp-slot]:border-destructive",
    className,
  )}
>
  <InputOTPPrimitive.Root
    bind:ref
    bind:value
    {maxlength}
    {pattern}
    {pasteTransformer}
    inputId={inputId ?? field?.id}
    data-slot="input-otp-input"
    class="flex items-center gap-3 disabled:cursor-not-allowed"
    aria-describedby={describedBy ?? field?.describedBy}
    aria-invalid={invalid ?? (field?.invalid ? true : undefined)}
    {...restProps}
  />
</div>
