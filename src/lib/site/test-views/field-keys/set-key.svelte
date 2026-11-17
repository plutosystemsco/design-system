<script lang="ts">
  import { setContext, type Snippet } from "svelte";

  // 020 test 7: a parent that sets one context key alone, as a 0.11.0
  // `field` set `pluto:field`. A test fixture, never installed; it goes in
  // 0.14.0 with the old keys.
  let {
    key,
    value,
    children,
  }: { key: string; value: unknown; children: Snippet } = $props();

  // svelte-ignore state_referenced_locally
  setContext(key, value);
</script>

{@render children()}
