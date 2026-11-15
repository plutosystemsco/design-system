<script lang="ts">
  import * as Breadcrumb from "#lib/registry/ui/breadcrumb";
  import type { Door } from "../doors.ts";

  let {
    door,
    trail = [],
  }: {
    /** The door the page belongs to: its dot comes first. */
    door: Door | null;
    /** The links after the door's landing, each a label and an address. */
    trail?: { label: string; href: string }[];
  } = $props();
</script>

<Breadcrumb.Root label="Where this page is" data-md="skip">
  <Breadcrumb.List>
    {#if door}
      <Breadcrumb.Item>
        <Breadcrumb.Link href={door.path} class="inline-flex items-center gap-2"
          ><span class="site-dot" data-door={door.n} aria-hidden="true"
          ></span>{door.name}</Breadcrumb.Link
        >
      </Breadcrumb.Item>
    {:else}
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
    {/if}
    {#each trail as step (step.href)}
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link href={step.href}>{step.label}</Breadcrumb.Link>
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
