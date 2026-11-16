<script lang="ts">
  import { getContext } from "svelte";
  import { cn, type WithElementRef } from "#lib/utils";
  import type {
    HTMLInputAttributes,
    HTMLInputTypeAttribute,
  } from "svelte/elements";

  type InputType = Exclude<HTMLInputTypeAttribute, "file">;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, "type"> &
      (
        | {
            /**
             * The input's type. `"file"` renders a file picker in the same
             * frame, and makes `files` bindable.
             */
            type: "file";
            /** The chosen files, when `type` is `"file"`. Bind it to read them. */
            files?: FileList;
          }
        | {
            /**
             * The input's type. `"file"` renders a file picker in the same
             * frame, and makes `files` bindable.
             */
            type?: InputType;
            /** The chosen files, when `type` is `"file"`. Bind it to read them. */
            files?: undefined;
          }
      )
  > & {
    /** The text in the input. Bind it to read or set it. */
    value?: HTMLInputAttributes["value"];
    /**
     * The control's id. Inside a `Field` it defaults to the field's, so the
     * field's label points here.
     */
    id?: HTMLInputAttributes["id"];
    /**
     * The ids of the text that describes the control. Inside a `Field` it
     * defaults to the field's description and error.
     */
    "aria-describedby"?: HTMLInputAttributes["aria-describedby"];
    /**
     * Marks the control invalid and turns its border red. Inside a `Field` it
     * follows the field's `error` or `invalid`.
     */
    "aria-invalid"?: HTMLInputAttributes["aria-invalid"];
    /**
     * The `data-slot` the input carries, so a part that wraps it, such as an
     * input group's control, can name itself.
     */
    "data-slot"?: HTMLInputAttributes["data-slot"];
  };

  /** The contract a `Field` sets under the key "kuiper:field". */
  type FieldContext = {
    readonly id: string;
    readonly invalid: boolean;
    readonly describedBy: string | undefined;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    class: className,
    id,
    "aria-describedby": describedBy,
    "aria-invalid": invalid,
    "data-slot": dataSlot = "input",
    ...restProps
  }: Props = $props();

  // A field from before 0.13.0 sets only its old key, read until 0.14.0.
  const field =
    getContext<FieldContext | undefined>("kuiper:field") ??
    getContext<FieldContext | undefined>("pluto:field");

  const wiring = $derived({
    id: id ?? field?.id,
    "aria-describedby": describedBy ?? field?.describedBy,
    "aria-invalid": invalid ?? (field?.invalid ? true : undefined),
  });

  const recipe =
    "h-12 w-full min-w-0 rounded border border-input bg-card px-3 text-base text-foreground transition-[color,background-color,border-color] placeholder:text-muted-foreground aria-invalid:border-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
</script>

{#if type === "file"}
  <input
    bind:this={ref}
    data-slot={dataSlot}
    class={cn(
      recipe,
      "file:mr-3 file:inline-flex file:h-full file:items-center file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
      className,
    )}
    type="file"
    bind:files
    bind:value
    {...wiring}
    {...restProps}
  />
{:else}
  <input
    bind:this={ref}
    data-slot={dataSlot}
    class={cn(recipe, className)}
    {type}
    bind:value
    {...wiring}
    {...restProps}
  />
{/if}
