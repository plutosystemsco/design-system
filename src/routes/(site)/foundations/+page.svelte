<script lang="ts">
  import { door } from "#lib/site/doors";
  import Landing from "#lib/site/page/landing.svelte";
  import { doorPages } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const pages = doorPages("foundations");
</script>

<Landing door={door("foundations")}>
  {#snippet sentence()}
    <p>One token file. Every colour and size comes from it.</p>
  {/snippet}
  {#snippet glass()}
    <dl class="grid grid-cols-3 gap-4">
      <div>
        <dt class="text-sm text-muted-foreground">Theme roles</dt>
        <dd class="font-heading text-2xl font-semibold tabular-nums">
          {data.roles}
        </dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Primitives</dt>
        <dd class="font-heading text-2xl font-semibold tabular-nums">
          {data.primitives}
        </dd>
      </div>
      <div>
        <dt class="text-sm text-muted-foreground">Radius</dt>
        <dd class="font-heading text-2xl font-semibold tabular-nums">
          {data.radius} px
        </dd>
      </div>
    </dl>
  {/snippet}

  <div
    data-mode="productive"
    class="mx-auto max-w-7xl px-(--gutter-stage) pt-12 pb-20"
  >
    <div class="grid max-w-(--site-measure) gap-4">
      <h2 class="text-2xl font-semibold tracking-section">Roles, not values</h2>
      <p>
        A part never names a colour. It names a role, such as the page's
        background, a card, the primary action or the focus ring, and the theme
        gives each role its value.
      </p>
      <p>
        Every role has a light value and a dark one, so one part reads right in
        both themes. Change a role in the theme, and every part that uses it
        follows.
      </p>
    </div>
    {#if pages.length}
      <ul class="groove-b mt-12 max-w-(--site-measure)">
        {#each pages as p (p.path)}
          <li class="groove py-3">
            <a href={p.path} class="font-medium text-foreground hover:underline"
              >{p.title}</a
            >
            <p class="text-sm text-muted-foreground">{p.summary}</p>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</Landing>
