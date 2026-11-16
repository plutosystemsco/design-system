<script lang="ts">
  import { getContext } from "svelte";

  // 020 test 8: a child that reads one context key alone, as a 0.12.0
  // control or an app's own code would, and writes what it found into a
  // data- attribute. A test fixture, never installed; it goes in 0.14.0
  // with the old keys.
  let {
    key,
    testid,
    found,
  }: {
    key: string;
    testid: string;
    /** What to write from the context: its id, or whether it is set. */
    found: (context: unknown) => string;
  } = $props();

  // svelte-ignore state_referenced_locally
  const context = getContext<unknown>(key);
</script>

<span data-testid={testid} data-key={key} data-found={found(context)}></span>
