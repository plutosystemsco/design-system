<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";
  import {
    cn,
    type WithoutChild,
    type WithoutChildrenOrChild,
  } from "#lib/utils";
  import AlertDialogOverlay from "./alert-dialog-overlay.svelte";
  import AlertDialogPortal from "./alert-dialog-portal.svelte";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    size = "default",
    portalProps,
    onOpenAutoFocus,
    ...restProps
  }: WithoutChild<AlertDialogPrimitive.ContentProps> & {
    size?: "default" | "sm";
    portalProps?: WithoutChildrenOrChild<
      ComponentProps<typeof AlertDialogPortal>
    >;
  } = $props();

  /**
   * bits-ui focuses the content node on open. A confirm should start on the
   * safe choice, so focus goes to Cancel, found by its data-slot because the
   * footer's order is the app's markup. An app's own handler runs first and
   * wins if it prevents the default.
   */
  function focusCancel(event: Event) {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    const node = ref;
    setTimeout(() => {
      if (!node?.isConnected) return;
      const cancel = node.querySelector<HTMLElement>(
        '[data-slot="alert-dialog-cancel"]',
      );
      (cancel ?? node).focus();
    }, 0);
  }
</script>

<AlertDialogPortal {...portalProps}>
  <AlertDialogOverlay />
  <AlertDialogPrimitive.Content
    bind:ref
    data-slot="alert-dialog-content"
    data-size={size}
    onOpenAutoFocus={focusCancel}
    class={cn(
      "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-6 rounded bg-popover p-6 text-popover-foreground shadow-elevation data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-md data-open:animate-enter data-closed:animate-exit",
      className,
    )}
    {...restProps}
  />
</AlertDialogPortal>
