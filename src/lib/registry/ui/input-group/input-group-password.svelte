<script lang="ts">
  import { getContext } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "#lib/utils";
  import InputGroupAddon from "./input-group-addon.svelte";
  import InputGroupButton from "./input-group-button.svelte";
  import InputGroupInput from "./input-group-input.svelte";
  import InputGroup from "./input-group.svelte";

  /** The id a `Field` gives its control, under the key "pluto:field" (field decision 11). */
  type FieldContext = { readonly id: string };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    id,
    shown = $bindable(false),
    ...restProps
  }: WithElementRef<
    Omit<HTMLInputAttributes, "type" | "files" | "children">
  > & {
    /** Whether the password shows as text. */
    shown?: boolean;
  } = $props();

  const uid = $props.id();
  const field = getContext<FieldContext | undefined>("pluto:field");
  const inputId = $derived(id ?? field?.id ?? `${uid}-password`);
</script>

<!--
  A password input with a Show and Hide toggle. The toggle's name holds its
  visible word (SC 2.5.3), and paste is never blocked. The app sets
  autocomplete: current-password or new-password.
-->
<InputGroup class={className}>
  <InputGroupInput
    bind:ref
    bind:value
    id={inputId}
    type={shown ? "text" : "password"}
    spellcheck={false}
    autocapitalize="off"
    {...restProps}
  />
  <InputGroupAddon align="inline-end">
    <InputGroupButton
      aria-label={shown ? "Hide password" : "Show password"}
      aria-controls={inputId}
      class={cn("min-w-16")}
      onclick={() => (shown = !shown)}
    >
      {shown ? "Hide" : "Show"}
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
