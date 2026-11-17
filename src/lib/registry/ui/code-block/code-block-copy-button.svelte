<script lang="ts">
  import { onDestroy } from "svelte";
  import Check from "phosphor-svelte/lib/Check";
  import Copy from "phosphor-svelte/lib/Copy";
  import { Button, type ButtonProps } from "#lib/registry/ui/button";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    class: className,
    code,
    variant = "ghost",
    size = "icon-sm",
    onclick,
    ...restProps
  }: Omit<ButtonProps, "onclick"> & {
    /** The text copied: the block's code. */
    code: string;
    /** Called when the button is pressed, before the code is copied. */
    onclick?: (e: MouseEvent) => void;
    /**
     * The button's look, as `Button`'s. Kuiper's default is quiet, so the code
     * stays the focus.
     */
    variant?: ButtonProps["variant"];
    /**
     * The button's size, as `Button`'s. Kuiper's default is the small square.
     */
    size?: ButtonProps["size"];
  } = $props();

  let copied = $state(false);
  let failed = $state(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function copy() {
    // Absent in an insecure context (http:// other than localhost): nothing to do.
    if (!navigator.clipboard) return;
    failed = false;
    navigator.clipboard
      .writeText(code)
      .then(() => {
        copied = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => (copied = false), 2000);
      })
      .catch(() => {
        // The write was refused: the outcome is said, and the button can be
        // tried again.
        copied = false;
        failed = true;
      });
  }

  onDestroy(() => clearTimeout(timeout));
</script>

<!--
  A 32 px ghost button named "Copy code", which shows a check for two
  seconds after a copy. The status region beside it is in the page from the
  first render, so the outcome is heard: "Copied", or "Could not copy" where
  the write is refused. The name stays "Copy code" either way, so a screen
  reader says the outcome once, from the status.
-->
<Button
  bind:ref
  data-slot="code-block-copy-button"
  data-copied={copied || undefined}
  {variant}
  {size}
  aria-label="Copy code"
  class={cn(className)}
  onclick={(e) => {
    onclick?.(e);
    copy();
  }}
  {...restProps}
>
  {#if copied}
    <Check aria-hidden="true" />
  {:else}
    <Copy aria-hidden="true" />
  {/if}
</Button>
<Status text={copied ? "Copied" : failed ? "Could not copy" : ""} />
