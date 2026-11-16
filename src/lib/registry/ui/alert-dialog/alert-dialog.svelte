<script lang="ts">
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui";

  let {
    open = $bindable(false),
    ...restProps
  }: AlertDialogPrimitive.RootProps & {
    /**
     * Whether the dialog shows. Bind it to open the dialog from your own code,
     * such as after a check.
     */
    open?: AlertDialogPrimitive.RootProps["open"];
  } = $props();
</script>

<AlertDialogPrimitive.Root bind:open {...restProps} />
