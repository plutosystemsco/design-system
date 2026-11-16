<script lang="ts" module>
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  /** Every word a tag says, for an app to translate. */
  export type TagStrings = {
    /** The remove button's name, from the tag's label: "Remove Design". */
    remove: (label: string) => string;
  };

  const STRINGS: TagStrings = { remove: (label) => `Remove ${label}` };

  type TagBase = Omit<HTMLAttributes<HTMLElement>, "class" | "children"> & {
    /** The tag's text: three words or fewer. It also names the remove button. */
    label: string;
    /** Makes the tag removable. Called when its remove button is pressed, or when Delete or Backspace is pressed on it. Remove the tag from your list in this call; the group moves focus. Not with `pressed`. */
    onremove?: () => void;
    /** Makes the tag pressable: a toggle button, `aria-pressed`, with a check while pressed. Not with `onremove`. */
    pressed?: boolean;
    /** Called after a pressable tag is pressed, with its new state. */
    onpressedchange?: (pressed: boolean) => void;
    /** A leading icon. It is hidden from assistive technology; the label says what the tag is. */
    icon?: Snippet;
    /** `remove`, `(label) => "Remove " + label`: the remove button's name. */
    strings?: Partial<TagStrings>;
    /** Classes for the tag. */
    class?: string;
  };

  /** A tag is removable, pressable or static: never removable and pressable at once. */
  type TagKind =
    | { onremove: () => void; pressed?: never; onpressedchange?: never }
    | { pressed: boolean; onremove?: never }
    | { onremove?: never; pressed?: never; onpressedchange?: never };

  export type TagProps = TagBase & TagKind;

  // A tag's shape: a solid input-coloured border, never the translucent
  // hairline, and the font's own spacing.
  const LOOK =
    "inline-flex h-8 items-center gap-1 rounded border border-input bg-card px-2 text-sm whitespace-nowrap text-foreground";
  const PRESSABLE =
    "cursor-pointer transition-[color,background-color,border-color] select-none hover:not-aria-pressed:bg-accent hover:not-aria-pressed:text-accent-foreground aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground";
</script>

<script lang="ts">
  import Check from "phosphor-svelte/lib/Check";
  import X from "phosphor-svelte/lib/X";
  import { getContext } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { cn } from "#lib/utils";
  import { TAG_GROUP_KEY, type TagGroupContext } from "./tag-group.svelte";

  let {
    label,
    onremove,
    pressed = $bindable(),
    onpressedchange,
    icon,
    strings,
    class: className,
    ...restProps
  }: TagProps = $props();

  const group = getContext<TagGroupContext | undefined>(TAG_GROUP_KEY);
  const s = $derived({ ...STRINGS, ...strings });
  const kind = $derived(
    onremove ? "removable" : pressed !== undefined ? "pressable" : "static",
  );
  let control: HTMLElement | null = $state(null);

  /** Tells the group the control's index, then lets the app remove the tag. */
  function remove() {
    const list = control?.closest('[data-slot="tag-group"]');
    if (control && list)
      group?.removing(
        Array.from(list.querySelectorAll("[data-tag-control]")).indexOf(
          control,
        ),
      );
    onremove?.();
  }

  function onRemoveKey(event: KeyboardEvent) {
    if (event.key !== "Delete" && event.key !== "Backspace") return;
    event.preventDefault();
    remove();
  }

  function toggle() {
    pressed = !pressed;
    onpressedchange?.(pressed);
  }
</script>

{#snippet leading()}
  {#if icon}
    <span
      data-slot="tag-icon"
      aria-hidden="true"
      class="flex [&_svg]:size-4 [&_svg]:shrink-0"
    >
      {@render icon()}
    </span>
  {/if}
{/snippet}

<!--
  A short label to remove or press. A removable tag holds a remove button
  named for it; Delete and Backspace remove it too, and its group moves
  focus. A pressable tag is a toggle button with a check while pressed. A
  static tag is text in a tag's shape.
-->
<svelte:element
  this={group ? "li" : "span"}
  data-slot="tag"
  data-kind={kind}
  class={cn(
    kind === "pressable" ? "inline-flex" : LOOK,
    kind === "removable" && "pe-1",
    className,
  )}
  {...restProps}
>
  {#if kind === "pressable"}
    <button
      bind:this={control}
      type="button"
      data-slot="tag-toggle"
      data-tag-control=""
      aria-pressed={pressed ? "true" : "false"}
      class={cn(LOOK, PRESSABLE)}
      onclick={toggle}
    >
      {@render leading()}
      <span data-slot="tag-label">{label}</span>
      {#if pressed}
        <Check data-slot="tag-check" aria-hidden="true" class="size-4" />
      {/if}
    </button>
  {:else}
    {@render leading()}
    <span data-slot="tag-label">{label}</span>
    {#if kind === "removable"}
      <Button
        bind:ref={control}
        data-slot="tag-remove"
        data-tag-control=""
        variant="ghost"
        size="icon-sm"
        class="size-6"
        aria-label={s.remove(label)}
        onclick={remove}
        onkeydown={onRemoveKey}
      >
        <X aria-hidden="true" />
      </Button>
    {/if}
  {/if}
</svelte:element>
