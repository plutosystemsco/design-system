<script lang="ts">
  import { Avatar as AvatarPrimitive } from "bits-ui";
  import { cn } from "#lib/utils";

  let {
    ref = $bindable(null),
    loadingStatus = $bindable("loading"),
    size = "default",
    class: className,
    ...restProps
  }: AvatarPrimitive.RootProps & {
    /**
     * `sm` and `lg` step down and up from the default, for a dense list or a
     * profile header.
     */
    size?: "default" | "sm" | "lg";
    /**
     * Whether the image has loaded. The fallback shows until it reads
     * `"loaded"`. Bind it to follow the image.
     */
    loadingStatus?: AvatarPrimitive.RootProps["loadingStatus"];
  } = $props();
</script>

<AvatarPrimitive.Root
  bind:ref
  bind:loadingStatus
  data-slot="avatar"
  data-size={size}
  class={cn(
    "group/avatar relative flex size-8 shrink-0 rounded select-none data-[size=lg]:size-12 data-[size=sm]:size-6 after:absolute after:inset-0 after:rounded after:border after:border-border",
    className,
  )}
  {...restProps}
/>
