<script lang="ts" module>
  /** The heading, and the page's title, for a status. */
  export function errorTitle(status: number): string {
    if (status === 404) return "Page not found";
    if (status < 500) return "This page cannot be shown";
    return "This page did not load";
  }
</script>

<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import PageStatesMessage from "#lib/registry/components/page-states-message.svelte";

  let {
    status,
    reference,
    homeHref = "/",
    level = 1,
  }: {
    status: number;
    /** A request id or build hash; never a stack trace. */
    reference?: string;
    homeHref?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
  } = $props();

  // Only a 404 says the page is not there. Another status below 500 says the
  // page cannot be shown and names the status in mono. Says what happened and
  // what to do, never whose fault it was.
  const missing = $derived(status === 404);
  const failed = $derived(status >= 500);
  const description = $derived(
    missing
      ? "The address may have a typo, or the page may have moved. Check the address, or start again from the home page."
      : !failed
        ? "Check the address, or start again from the home page."
        : reference
          ? "Try again in a moment. If it keeps happening, include the reference below when you report it."
          : "Try again in a moment.",
  );
</script>

<PageStatesMessage
  title={errorTitle(status)}
  {description}
  {level}
  status={!missing && !failed ? status : undefined}
  reference={failed ? reference : undefined}
>
  {#snippet action()}
    {#if failed}
      <Button onclick={() => location.reload()}>Try again</Button>
    {:else}
      <Button href={homeHref}>Go to the home page</Button>
    {/if}
  {/snippet}
  {#snippet link()}
    {#if failed}
      <Button variant="link" href={homeHref}>Go to the home page</Button>
    {/if}
  {/snippet}
</PageStatesMessage>
