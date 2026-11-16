<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants/lite";
  import { cn, type WithElementRef } from "#lib/utils";
  import type {
    HTMLAnchorAttributes,
    HTMLButtonAttributes,
  } from "svelte/elements";

  export const buttonVariants = tv({
    base: "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-action,var(--radius))] border font-medium whitespace-nowrap transition-[color,background-color,border-color,translate] select-none active:not-aria-[haspopup]:translate-y-px aria-invalid:border-destructive disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    variants: {
      variant: {
        default:
          "border-primary bg-primary text-primary-foreground hover:border-foreground",
        secondary:
          "border-input bg-secondary text-secondary-foreground hover:border-foreground aria-expanded:border-foreground",
        ghost:
          "border-transparent hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:border-foreground",
        link: "border-transparent text-primary underline underline-offset-4",
      },
      size: {
        default: "h-12 px-4 text-base",
        sm: "h-8 px-3 text-sm",
        icon: "size-12",
        "icon-sm": "size-8",
      },
    },
    // A link sits flush with the text around it, at every size: no side
    // padding. Its height, and so its target, stay.
    compoundVariants: [{ variant: "link", class: "px-0" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
  export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      /**
       * The look: `default` for the main action, `secondary` beside it, `ghost`
       * in toolbars and menus, `destructive` for one that deletes, `link` for
       * an action that reads as text.
       */
      variant?: ButtonVariant;
      /**
       * `default` meets the touch target. `sm` is the compact height, for dense
       * rows. The `icon` sizes are square, for a button that shows only an icon
       * and is named by `aria-label`.
       */
      size?: ButtonSize;
      /**
       * Shows a spinner, sets `aria-busy`, and ignores clicks while the button
       * stays enabled and focused, so a form is not sent twice. It has no
       * effect when `href` is set.
       */
      busy?: boolean;
      /**
       * Renders an `<a>` in place of the `<button>`, with the same look. A
       * disabled link loses its `href` and leaves the tab order.
       */
      href?: HTMLAnchorAttributes["href"];
      /**
       * Kuiper's default is `"button"`, so a button inside a form does not submit
       * it. Set `"submit"` on the form's own button.
       */
      type?: HTMLButtonAttributes["type"];
      /**
       * On a link, sets `aria-disabled` and removes the `href` and the tab stop,
       * since an `<a>` has no disabled state.
       */
      disabled?: HTMLButtonAttributes["disabled"];
      /** Called when the button is pressed. Not called while `busy`. */
      onclick?: HTMLButtonAttributes["onclick"];
    };
</script>

<script lang="ts">
  import { Spinner } from "#lib/registry/ui/spinner";

  let {
    class: className,
    variant = "default",
    size = "default",
    ref = $bindable(null),
    href = undefined,
    type = "button",
    disabled,
    busy = false,
    onclick,
    children,
    ...restProps
  }: ButtonProps = $props();

  function handleClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    if (busy) {
      // Also stops a form's implicit submission, which clicks the default button.
      event.preventDefault();
      return;
    }
    (onclick as ((e: typeof event) => void) | null | undefined)?.(event);
  }
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    href={disabled ? undefined : href}
    aria-disabled={disabled}
    role={disabled ? "link" : undefined}
    tabindex={disabled ? -1 : undefined}
    onclick={onclick as HTMLAnchorAttributes["onclick"]}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    class={cn(buttonVariants({ variant, size }), className)}
    {type}
    {disabled}
    aria-busy={busy ? "true" : undefined}
    data-busy={busy ? "" : undefined}
    onclick={handleClick}
    {...restProps}
  >
    {#if busy}
      <Spinner />
    {/if}
    {@render children?.()}
  </button>
{/if}
