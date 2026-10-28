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
    size?: "default" | "sm" | "lg";
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
