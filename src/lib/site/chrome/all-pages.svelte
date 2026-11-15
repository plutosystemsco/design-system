<script lang="ts">
  import type { Snippet } from "svelte";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import * as Collapsible from "#lib/registry/ui/collapsible";
  import { DOORS, type DoorId } from "../doors.ts";
  import { GROUPS, navOrder, sitePage, type SitePage } from "../sitemap.ts";

  let {
    door,
    current,
    onfollow,
  }: {
    /** The page's door, open on arrival. */
    door: DoorId | null;
    /** The page's path, marked current. */
    current: string;
    /** After a link is followed: the sheet closes. */
    onfollow: () => void;
  } = $props();

  const group = $derived(sitePage(current)?.group);
  // Which disclosures are open: the current door and group on arrival.
  const open: Record<string, boolean> = $state({});
  $effect.pre(() => {
    if (door && open[door] === undefined) open[door] = true;
    if (group && open[group] === undefined) open[group] = true;
  });
</script>

{#snippet link(p: SitePage)}
  <a
    href={p.path}
    aria-current={p.path === current ? "page" : undefined}
    onclick={onfollow}
    class="site-nav-link">{p.title}</a
  >
{/snippet}

{#snippet trigger(slot: string, isOpen: boolean, body: Snippet)}
  <Collapsible.Trigger
    data-slot={slot}
    class="flex min-h-11 w-full items-center gap-2 rounded px-3 text-start font-medium"
  >
    {@render body()}
    <CaretDown
      aria-hidden="true"
      class={["ms-auto size-4 transition-transform", isOpen && "rotate-180"]}
    />
  </Collapsible.Trigger>
{/snippet}

<!--
  The phone menu (018 decision 2): every door a disclosure, a button that
  opens its list, whose first link is the landing; Components' groups are
  disclosures too. The current door and group are open on arrival.
-->
<nav aria-label="All pages" data-slot="all-pages" class="grid gap-1 text-base">
  {#each DOORS as d (d.id)}
    {@const pages = navOrder(d.id)}
    {#snippet name()}<span class="site-dot" data-door={d.n} aria-hidden="true"
      ></span>{d.name}{/snippet}
    <Collapsible.Root bind:open={() => !!open[d.id], (v) => (open[d.id] = v)}>
      {@render trigger("door-disclosure", !!open[d.id], name)}
      <Collapsible.Content>
        <ul class="ps-3">
          <li>{@render link(pages[0])}</li>
          {#if d.id === "components"}
            {#each GROUPS as g (g.id)}
              {#snippet title()}{g.title}{/snippet}
              <li>
                <Collapsible.Root
                  bind:open={() => !!open[g.id], (v) => (open[g.id] = v)}
                >
                  {@render trigger("group-disclosure", !!open[g.id], title)}
                  <Collapsible.Content>
                    <ul class="ps-3">
                      {#each pages.filter((p) => p.group === g.id) as p (p.path)}
                        <li>{@render link(p)}</li>
                      {/each}
                    </ul>
                  </Collapsible.Content>
                </Collapsible.Root>
              </li>
            {/each}
          {:else}
            {#each pages.slice(1) as p (p.path)}<li>
                {@render link(p)}
              </li>{/each}
          {/if}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  {/each}
  {@render link(sitePage("/changelog/")!)}
</nav>
