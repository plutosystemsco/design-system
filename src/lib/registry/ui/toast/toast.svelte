<script lang="ts" module>
  import type { ToastAction, ToastKind } from "./toast-queue.js";
  import type { ToasterStrings } from "./toast-words.js";

  /** The start edge's colour and the icon's, by kind: solid colours, never a tint. */
  const EDGE: Record<ToastKind, string> = {
    info: "border-s-input",
    success: "border-s-success",
    caution: "border-s-caution",
    error: "border-s-destructive",
    loading: "border-s-input",
  };
  const ICON: Record<ToastKind, string> = {
    info: "text-muted-foreground",
    success: "text-success",
    caution: "text-caution-text",
    error: "text-destructive",
    loading: "text-muted-foreground",
  };

  export type ToastProps = {
    /** Which of the five kinds: its icon, its edge and its hidden word. */
    kind: ToastKind;
    /** The message, in a few words. Text only. */
    title: string;
    /** One short sentence under the title. */
    description?: string;
    /** One button, such as Undo, under the text. */
    action?: ToastAction;
    /** Runs when Dismiss is pressed. */
    ondismiss?: () => void;
    /** The title's id, which describes the Dismiss button. */
    titleId?: string;
    /** Every word the card shows or hides for a reader. */
    strings?: ToasterStrings;
    /** `"li"` in a list, the default; `"div"` for a specimen outside one. */
    as?: "li" | "div";
  };
</script>

<script lang="ts">
  import CheckCircle from "phosphor-svelte/lib/CheckCircle";
  import Info from "phosphor-svelte/lib/Info";
  import Warning from "phosphor-svelte/lib/Warning";
  import WarningCircle from "phosphor-svelte/lib/WarningCircle";
  import X from "phosphor-svelte/lib/X";
  import type { HTMLAttributes } from "svelte/elements";
  import { Button } from "#lib/registry/ui/button";
  import { Spinner } from "#lib/registry/ui/spinner";
  import { cn } from "#lib/utils";
  import { DEFAULT_STRINGS, kindWord } from "./toast-words.js";

  let {
    kind,
    title,
    description,
    action,
    ondismiss,
    titleId,
    strings = DEFAULT_STRINGS,
    as = "li",
    ...restProps
  }: ToastProps & Omit<HTMLAttributes<HTMLElement>, "title"> = $props();

  const uid = $props.id();
  const id = $derived(titleId ?? `${uid}-title`);
  const word = $derived(kindWord(kind, strings));
</script>

<!--
  One toast, as the toaster draws it. Rendered alone it is a specimen:
  render it inside `inert`, with no role, no timer, never spoken. In an app,
  call `toast()`.
-->
<svelte:element
  this={as}
  {...restProps}
  data-slot="toast"
  data-kind={kind}
  class={cn(
    "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 gap-y-2 rounded border border-transparent border-s-(length:--focus-width) bg-popover p-3 text-popover-foreground shadow-elevation",
    EDGE[kind],
    restProps.class,
  )}
>
  <span
    data-slot="toast-icon"
    aria-hidden="true"
    class={cn("flex h-lh items-center text-sm", ICON[kind])}
  >
    {#if kind === "success"}
      <CheckCircle class="size-4" />
    {:else if kind === "caution"}
      <Warning class="size-4" />
    {:else if kind === "error"}
      <WarningCircle class="size-4" />
    {:else if kind === "loading"}
      <Spinner class="size-4" />
    {:else}
      <Info class="size-4" />
    {/if}
  </span>
  <div class="grid min-w-0 gap-1">
    {#if word}<span data-slot="toast-kind" class="sr-only">{word}: </span>{/if}
    <p {id} data-slot="toast-title" class="text-sm font-medium">{title}</p>
    {#if description}
      <p data-slot="toast-description" class="text-sm text-muted-foreground">
        {description}
      </p>
    {/if}
    {#if action}
      <div class="mt-1">
        <Button
          variant="secondary"
          size="sm"
          data-slot="toast-action"
          onclick={() => action.onclick()}>{action.label}</Button
        >
      </div>
    {/if}
  </div>
  <Button
    variant="ghost"
    size="icon-sm"
    data-slot="toast-close"
    aria-label={strings.dismiss}
    aria-describedby={id}
    class="-me-1 -mt-1"
    onclick={() => ondismiss?.()}
  >
    <X aria-hidden="true" />
  </Button>
</svelte:element>
