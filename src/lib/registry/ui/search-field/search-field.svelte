<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  /** Every word the search field says, for an app to translate. */
  export type SearchFieldStrings = {
    /** The clear button's name: "Clear search". */
    clear: string;
  };

  const STRINGS: SearchFieldStrings = { clear: "Clear search" };

  /** How long typing pauses, in milliseconds, before the count is spoken. */
  export const SEARCH_FIELD_SETTLE_MS = 750;

  export type SearchFieldProps = Omit<
    HTMLInputAttributes,
    "type" | "value" | "files" | "results" | "class" | "children"
  > & {
    /** What is typed. Clear and Escape set it to `""`. */
    value?: string;
    /** The result count for what is typed now, such as "12 results" or "No results". The field speaks it once typing has paused and the count is a string, whichever comes later. `undefined` means the count is on its way: while a server answers a new query, set it to `undefined`, or the field will speak the old count at the pause. Leave it unset to say nothing. */
    results?: string | undefined;
    /** The query that `results` answers. When given, a count is spoken only while `resultsFor` equals `value`. Use it when results come from a server, so a late answer to an older query is never spoken. */
    resultsFor?: string;
    /** Called after Clear or Escape empties the field, once `value` is `""`. */
    onclear?: () => void;
    /** `clear`, "Clear search": the clear button's name. */
    strings?: Partial<SearchFieldStrings>;
    /** Classes for the group. */
    class?: string;
    /** The input, bound. */
    ref?: HTMLInputElement | null;
  };

  /** The id a `Field` gives its control, under the key "kuiper:field". */
  type FieldContext = { readonly id: string };
</script>

<script lang="ts">
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import X from "phosphor-svelte/lib/X";
  import { getContext, onDestroy } from "svelte";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import { Status } from "#lib/registry/ui/status";

  let {
    ref = $bindable(null),
    value = $bindable(""),
    results,
    resultsFor,
    onclear,
    strings,
    class: className,
    ...restProps
  }: SearchFieldProps = $props();

  const uid = $props.id();
  const field = getContext<FieldContext | undefined>("kuiper:field");
  const inputId = $derived(
    (restProps.id as string | undefined) ?? field?.id ?? `${uid}-search`,
  );
  const s = $derived({ ...STRINGS, ...strings });
  const editable = $derived(!restProps.disabled && !restProps.readonly);

  // Each input restarts the pause. The count is spoken once a pause, at the
  // later of the pause and a count for what is typed now.
  let paused = $state(false);
  let said = $state("");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pause = 0;
  let spoken = true;
  let clearing = false;

  function restart() {
    clearTimeout(timer);
    pause += 1;
    paused = false;
    spoken = false;
    timer = setTimeout(() => (paused = true), SEARCH_FIELD_SETTLE_MS);
  }

  $effect(() => {
    if (!paused || spoken) return;
    const count = results;
    if (typeof count !== "string") return;
    if (resultsFor !== undefined && resultsFor !== value) return;
    spoken = true;
    // Empty, then the count a frame later: one text written twice is not
    // spoken twice, so the empty frame lets an unchanged count be heard.
    const mine = pause;
    said = "";
    requestAnimationFrame(() => {
      if (mine === pause) said = count;
    });
  });

  onDestroy(() => clearTimeout(timer));

  /** Empties the field: the DOM first, then `value`, then the app hears it. */
  function clear(input: HTMLInputElement | null) {
    if (!input) return;
    clearTimeout(timer);
    pause += 1;
    paused = false;
    spoken = true;
    input.value = "";
    value = "";
    clearing = true;
    try {
      input.dispatchEvent(new Event("input", { bubbles: true }));
    } finally {
      clearing = false;
    }
    onclear?.();
  }

  // The app's own handlers run first; a preventDefault there stops the item.
  function oninput(event: Event & { currentTarget: HTMLInputElement }) {
    (restProps.oninput as ((e: typeof event) => void) | null | undefined)?.(
      event,
    );
    if (event.defaultPrevented || clearing) return;
    restart();
  }

  // A plain handler, never a capture listener: stopPropagation here is what
  // keeps a dialog around the field open while Escape clears it.
  function onkeydown(
    event: KeyboardEvent & { currentTarget: HTMLInputElement },
  ) {
    (restProps.onkeydown as ((e: typeof event) => void) | null | undefined)?.(
      event,
    );
    if (event.defaultPrevented || event.key !== "Escape") return;
    // An input method ends its composition with Escape: leave it alone.
    if (event.isComposing || event.keyCode === 229) return;
    const input = event.currentTarget;
    if (!input.value || input.disabled || input.readOnly) return;
    // WebKit does not clear a search input on Escape; the others do. The
    // field prevents the native clear and clears itself, so all agree.
    event.preventDefault();
    event.stopPropagation();
    clear(input);
  }
</script>

<!--
  A search input with a magnifier and a Clear button that shows while there
  is text, is a Tab stop, and returns focus to the input. Escape clears a
  filled, editable field and stops there; otherwise it passes on. A hidden
  status, present from the first render, speaks the result count once
  typing pauses, for what is typed now.
-->
<InputGroup.Root data-search-field="" class={className}>
  <InputGroup.Addon align="inline-start">
    <MagnifyingGlass data-slot="search-field-icon" aria-hidden="true" />
  </InputGroup.Addon>
  <InputGroup.Input
    {...restProps}
    bind:ref
    bind:value
    id={inputId}
    type="search"
    class="[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
    {oninput}
    {onkeydown}
  />
  {#if value && editable}
    <InputGroup.Addon align="inline-end">
      <InputGroup.Button
        data-slot="search-field-clear"
        size="icon-sm"
        aria-label={s.clear}
        aria-controls={inputId}
        onclick={() => {
          clear(ref);
          ref?.focus();
        }}
      >
        <X aria-hidden="true" />
      </InputGroup.Button>
    </InputGroup.Addon>
  {/if}
  <Status data-slot="search-field-status" text={said} />
</InputGroup.Root>
