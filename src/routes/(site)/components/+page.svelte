<script lang="ts">
  import { Input } from "#lib/registry/ui/input";
  import { Label } from "#lib/registry/ui/label";
  import { door } from "#lib/site/doors";
  import Command from "#lib/site/page/command.svelte";
  import Landing from "#lib/site/page/landing.svelte";
  import { componentPath, GROUPS, SITEMAP } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  const items = SITEMAP.filter((p) => p.parent === "/components/").map((p) => {
    const name = p.path.split("/")[2];
    const entry = data.registry[name];
    return {
      name,
      path: componentPath(name),
      title: entry.title,
      description: entry.description,
      group: entry.meta.group,
      modes: entry.meta.modes,
      since: entry.meta.since,
      text: `${entry.title} ${name} ${entry.description}`.toLowerCase(),
    };
  });

  let query = $state("");
  const q = $derived(query.trim().toLowerCase());
  const shown = $derived(items.filter((i) => !q || i.text.includes(q)));
  const count = $derived(
    shown.length === 0
      ? `No components match "${query.trim()}". Clear the filter to see all ${items.length}.`
      : `${shown.length} component${shown.length === 1 ? "" : "s"}`,
  );
</script>

<Landing door={door("components")}>
  {#snippet fact()}{items.length}{/snippet}
  {#snippet sentence()}parts you can add, each a page{/snippet}
  {#snippet glass()}
    <p class="mb-3 font-medium">Start with the theme:</p>
    <Command
      code={data.theme.code}
      lines={data.theme.lines}
      label="Install the theme"
    />
  {/snippet}

  <div
    data-mode="productive"
    class="mx-auto max-w-7xl px-(--gutter-stage) pt-12 pb-20"
  >
    <div class="grid max-w-(--container-md) gap-2" data-md="skip">
      <Label for="filter">Filter components</Label>
      <Input
        id="filter"
        bind:value={query}
        autocomplete="off"
        placeholder="Button, dialog, chart"
      />
    </div>
    <p
      role="status"
      aria-live="polite"
      data-md="skip"
      class="mt-4 mb-10 text-sm text-muted-foreground"
    >
      {count}
    </p>
    {#each GROUPS as group (group.id)}
      {@const rows = shown.filter((i) => i.group === group.id)}
      {#if rows.length}
        <section
          id={group.id}
          aria-labelledby="group-{group.id}"
          class="mt-14 first-of-type:mt-0"
        >
          <h2
            id="group-{group.id}"
            class="flex items-baseline gap-3 text-2xl font-semibold tracking-section"
          >
            {group.title}
            <span
              class="font-sans text-sm font-normal tracking-normal text-muted-foreground"
              >{rows.length}</span
            >
          </h2>
          <ul class="groove-b mt-4">
            {#each rows as item (item.name)}
              <li
                class="groove grid gap-x-6 gap-y-1 py-3 md:grid-cols-[minmax(0,var(--container-3xs))_minmax(0,1fr)_auto] md:items-baseline"
              >
                <a
                  href={item.path}
                  class="font-medium text-foreground hover:underline"
                  >{item.title}</a
                >
                <p class="max-w-prose text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p class="text-xs whitespace-nowrap text-muted-foreground">
                  {item.modes.join(", ")}. Since {item.since}
                </p>
              </li>
            {/each}
          </ul>
        </section>
      {/if}
    {/each}
  </div>
</Landing>
