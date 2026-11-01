<script lang="ts">
  import { Switch as SwitchPrimitive } from "bits-ui";
  import { getContext } from "svelte";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";

  /** The contract a `Field` sets under the key "pluto:field". */
  type FieldContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
  };

  let {
    ref = $bindable(null),
    class: className,
    checked = $bindable(false),
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    ...restProps
  }: WithoutChildrenOrChild<SwitchPrimitive.RootProps> = $props();

  const field = getContext<FieldContext | undefined>("pluto:field");
</script>

<!--
  A 32 × 64 track with a 24 × 24 thumb inset 4 px, both at the case radius, no
  track border. On is blue and the thumb moves to the end.
-->
<SwitchPrimitive.Root
  bind:ref
  bind:checked
  data-slot="switch"
  class={cn(
    "peer group/switch relative inline-flex h-8 w-16 shrink-0 items-center rounded p-1 transition-[background-color] data-checked:bg-primary data-unchecked:bg-input data-disabled:cursor-not-allowed data-disabled:opacity-50",
    className,
  )}
  id={id ?? field?.id}
  aria-describedby={describedBy ?? field?.describedBy}
  aria-invalid={invalid ?? (field?.invalid ? true : undefined)}
  {...restProps}
>
  <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    class="pointer-events-none block size-6 rounded transition-transform data-checked:translate-x-8 data-checked:bg-primary-foreground data-unchecked:translate-x-0 data-unchecked:bg-card"
  />
</SwitchPrimitive.Root>
