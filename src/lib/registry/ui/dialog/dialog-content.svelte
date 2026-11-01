<script lang="ts">
  import { Dialog as DialogPrimitive } from "bits-ui";
  import X from "phosphor-svelte/lib/X";
  import { Button } from "#lib/registry/ui/button";
  import { cn, type WithoutChildrenOrChild } from "#lib/utils";
  import DialogOverlay from "./dialog-overlay.svelte";
  import DialogPortal from "./dialog-portal.svelte";
  import type { ComponentProps, Snippet } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    label,
    showCloseButton = true,
    portalProps,
    children,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DialogPortal>>;
    /** The dialog's name when it holds no `DialogTitle`. One of the two is required. */
    label?: string;
    showCloseButton?: boolean;
    children: Snippet;
  } = $props();
</script>

<!--
  A modal window: role="dialog" aria-modal="true", named by its title (bits-ui
  wires aria-labelledby) or by `label`, focus to the first tabbable inside,
  trapped and looped, returned to the trigger on close. A positioner, 16 px
  in from every edge, centres a box of fitted height, 448 px wide at most;
  a long body scrolls inside it, since its height is capped at the
  positioner's (a cap against the viewport would run 32 px past it). The
  positioner lives only while the dialog does and lets clicks through to the
  scrim. The elevation draws the edge, so no border. It fades over the micro
  budget. The close button is 32 px and the last stop.
-->
<DialogPortal {...portalProps}>
  <DialogOverlay />
  <DialogPrimitive.Content
    bind:ref
    data-slot="dialog-content"
    aria-label={label}
    class={cn(
      "pointer-events-auto relative grid max-h-full w-full max-w-md gap-6 overflow-y-auto rounded bg-popover p-6 text-popover-foreground shadow-elevation scrollbar data-open:animate-enter data-closed:animate-exit",
      className,
    )}
    {...restProps}
  >
    {#snippet child({ props })}
      <div
        data-slot="dialog-positioner"
        class="pointer-events-none fixed inset-4 z-50 flex items-center justify-center"
      >
        <div {...props}>
          {@render children?.()}
          {#if showCloseButton}
            <DialogPrimitive.Close data-slot="dialog-close">
              {#snippet child({ props })}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Close"
                  class="absolute top-4 end-4"
                  {...props}
                >
                  <X aria-hidden="true" class="size-4" />
                </Button>
              {/snippet}
            </DialogPrimitive.Close>
          {/if}
        </div>
      </div>
    {/snippet}
  </DialogPrimitive.Content>
</DialogPortal>
