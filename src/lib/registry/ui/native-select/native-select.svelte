<script lang="ts">
  import CaretDownIcon from "phosphor-svelte/lib/CaretDown";
  import { getContext } from "svelte";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLSelectAttributes } from "svelte/elements";

  /** The contract a `Field` sets under the key "kuiper:field". */
  type FieldContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
  };

  type NativeSelectProps = Omit<
    WithElementRef<HTMLSelectAttributes, HTMLSelectElement>,
    "size"
  > & {
    /** The chosen option's value. Bind it to read or set it. */
    value?: HTMLSelectAttributes["value"];
    /**
     * The control's id. Inside a `Field` it defaults to the field's, so the
     * field's label points here.
     */
    id?: HTMLSelectAttributes["id"];
    /**
     * The ids of the text that describes the control. Inside a `Field` it
     * defaults to the field's description and error.
     */
    "aria-describedby"?: HTMLSelectAttributes["aria-describedby"];
    /**
     * Marks the control invalid and turns its border red. Inside a `Field` it
     * follows the field's `error` or `invalid`.
     */
    "aria-invalid"?: HTMLSelectAttributes["aria-invalid"];
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    children,
    ...restProps
  }: NativeSelectProps = $props();

  // A field from before 0.13.0 sets only its old key, read until 0.14.0.
  const field =
    getContext<FieldContext | undefined>("kuiper:field") ??
    getContext<FieldContext | undefined>("pluto:field");
</script>

<div
  class={cn(
    "group/native-select relative w-full has-[select:disabled]:opacity-50",
    className,
  )}
  data-slot="native-select-wrapper"
>
  <select
    bind:value
    bind:this={ref}
    data-slot="native-select"
    class="h-12 w-full min-w-0 appearance-none rounded border border-input bg-card pr-12 pl-3 text-base text-foreground transition-[color,background-color,border-color] select-none selection:bg-primary selection:text-primary-foreground aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed"
    id={id ?? field?.id}
    aria-describedby={describedBy ?? field?.describedBy}
    aria-invalid={invalid ?? (field?.invalid ? true : undefined)}
    {...restProps}
  >
    {@render children?.()}
  </select>
  <CaretDownIcon
    class="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground select-none"
    aria-hidden="true"
    data-slot="native-select-icon"
  />
</div>
