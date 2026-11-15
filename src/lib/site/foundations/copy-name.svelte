<script lang="ts">
  import { onDestroy } from "svelte";
  import Check from "phosphor-svelte/lib/Check";
  import Copy from "phosphor-svelte/lib/Copy";
  import { Button } from "#lib/registry/ui/button";
  import { Status } from "#lib/registry/ui/status";

  let {
    name,
    copy,
  }: {
    /** The name shown. */
    name: string;
    /** What the button copies. */
    copy: string;
  } = $props();

  let copied = $state(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  function write() {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(copy).then(
      () => {
        copied = true;
        clearTimeout(timeout);
        timeout = setTimeout(() => (copied = false), 2000);
      },
      () => (copied = false),
    );
  }
  onDestroy(() => clearTimeout(timeout));
</script>

<!--
  A token's name, and a button that copies it: its name says what it copies,
  then "Copied" for two seconds.
-->
<span class="inline-flex items-center gap-1">
  <code class="font-medium">{name}</code>
  <Button
    variant="ghost"
    size="icon-sm"
    data-slot="token-copy"
    aria-label={copied ? "Copied" : `Copy ${copy}`}
    onclick={write}
  >
    {#if copied}<Check aria-hidden="true" />{:else}<Copy
        aria-hidden="true"
      />{/if}
  </Button>
  <Status text={copied ? "Copied" : ""} />
</span>
