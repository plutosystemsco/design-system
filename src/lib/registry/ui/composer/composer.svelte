<script lang="ts" module>
  /** The Vercel AI SDK's four names for a chat's state. */
  export type ComposerStatus = "ready" | "submitted" | "streaming" | "error";
</script>

<script lang="ts">
  import { untrack } from "svelte";
  import ArrowUp from "phosphor-svelte/lib/ArrowUp";
  import Square from "phosphor-svelte/lib/Square";
  import { Button } from "#lib/registry/ui/button";
  import * as Field from "#lib/registry/ui/field";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import { Kbd } from "#lib/registry/ui/kbd";
  import { Spinner } from "#lib/registry/ui/spinner";
  import { Status } from "#lib/registry/ui/status";
  import { cn, type WithElementRef } from "#lib/utils";
  import type { HTMLFormAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    value = $bindable(""),
    status = "ready",
    onsend,
    onstop,
    label = "Message",
    hint,
    labelVisible = false,
    placeholder,
    class: className,
    onsubmit,
    ...restProps
  }: WithElementRef<HTMLFormAttributes, HTMLFormElement> & {
    /** The draft. Cleared on send. */
    value?: string;
    /** The chat's state. `submitted` and `streaming` turn Send into Stop. */
    status?: ComposerStatus;
    /** Called with the trimmed text on send. */
    onsend?: (text: string) => void;
    /** Called when Stop is pressed, or Escape while a reply runs. */
    onstop?: () => void;
    /** The textarea's name. Visually hidden unless `labelVisible`. */
    label?: string;
    /** The description under the textarea. Without it, the keys are shown with Kbd. */
    hint?: string;
    labelVisible?: boolean;
    placeholder?: string;
  } = $props();

  let textarea: HTMLTextAreaElement | null = $state(null);
  const busy = $derived(status === "submitted" || status === "streaming");

  /** Moves focus into the textarea. */
  export function focus(): void {
    textarea?.focus();
  }

  // The status words (decision 13's table): "Responding" at submitted,
  // "Response complete" at ready after a reply, "Stopped" on a Stop press,
  // and the ready that follows a stop is silent. No two in a row are the same.
  let statusText = $state("");
  let previous: ComposerStatus = untrack(() => status);
  let stopped = false;
  $effect(() => {
    const next = status;
    untrack(() => {
      if (next === previous) return;
      if (next === "submitted") {
        statusText = "Responding";
        stopped = false;
      } else if (
        next === "ready" &&
        (previous === "submitted" || previous === "streaming")
      ) {
        if (!stopped) statusText = "Response complete";
        stopped = false;
      }
      previous = next;
    });
  });

  function send(): void {
    const text = value.trim();
    textarea?.focus();
    if (!text) return;
    onsend?.(text);
    value = "";
  }

  function stop(): void {
    stopped = true;
    statusText = "Stopped";
    onstop?.();
    textarea?.focus();
  }

  function handleSubmit(
    event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement },
  ): void {
    onsubmit?.(event);
    event.preventDefault();
    if (busy) return;
    send();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && busy) {
      event.preventDefault();
      stop();
      return;
    }
    if (event.key !== "Enter" || event.shiftKey) return;
    // An input method editor's Enter confirms a candidate, not the message.
    if (event.isComposing || event.keyCode === 229) return;
    event.preventDefault();
    if (busy) return;
    send();
  }
</script>

{#snippet keys()}
  <Kbd>Enter</Kbd> to send. <Kbd>Shift Enter</Kbd> for a new line.
{/snippet}

<!--
  The form a person writes a message in. The textarea grows by field-sizing
  from 64 px to 256 px and scrolls inside after that (where field-sizing is
  absent it keeps its minimum and scrolls). One button: Send, the surface's
  one accent, becomes Stop (secondary, with the spinner while submitted) and
  back, so focus never moves. Nothing is ever disabled: an empty submit is
  ignored. Enter sends, Shift Enter breaks a line, Escape stops. Focus stays
  in the textarea after send and after stop. The composer's file must be among
  Tailwind's sources, so that max-h-(--container-3xs) emits its variable.
-->
<form
  bind:this={ref}
  data-slot="composer"
  data-status={status}
  class={cn("grid gap-2", className)}
  onsubmit={handleSubmit}
  {...restProps}
>
  <Field.Field description={hint ?? keys}>
    <Field.Label class={labelVisible ? undefined : "sr-only"}
      >{label}</Field.Label
    >
    <InputGroup.Root class="items-end">
      <InputGroup.Textarea
        bind:ref={textarea}
        bind:value
        rows={1}
        {placeholder}
        class="max-h-(--container-3xs) min-h-16 overflow-y-auto scrollbar"
        onkeydown={handleKeydown}
      />
      <InputGroup.Addon align="inline-end" class="self-end py-2">
        <Button
          type={busy ? "button" : "submit"}
          variant={busy ? "secondary" : "default"}
          size="icon"
          data-slot="composer-send"
          data-state={busy ? "stop" : "send"}
          aria-label={busy ? "Stop response" : "Send message"}
          onclick={busy ? stop : undefined}
        >
          {#if status === "submitted"}
            <Spinner />
          {:else if busy}
            <Square aria-hidden="true" class="size-4" />
          {:else}
            <ArrowUp aria-hidden="true" class="size-4" />
          {/if}
        </Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </Field.Field>
  <Status text={statusText} />
</form>
