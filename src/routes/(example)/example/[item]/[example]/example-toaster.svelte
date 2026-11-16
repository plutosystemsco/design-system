<script lang="ts">
  import { notifications } from "#lib/site/examples/toast/notifications.svelte.js";
  import { Toaster } from "#lib/registry/ui/toast";
</script>

<!--
  026 decision 24: a toast raised in the other theme's frame, or in a
  screen-reader run, needs a toaster in its own document. Its timers follow
  the setting example's switch, as the component page's toaster does.
-->
<Toaster timers={notifications.keep ? "off" : "on"} />
