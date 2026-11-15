<script lang="ts">
  import { door } from "#lib/site/doors";
  import Command from "#lib/site/page/command.svelte";
  import Landing from "#lib/site/page/landing.svelte";
  import { componentPath, doorPages } from "#lib/site/sitemap";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
  const guides = doorPages("start");
</script>

<Landing door={door("start")}>
  {#snippet sentence()}
    <p>From an empty SvelteKit app to a first Pluto screen.</p>
  {/snippet}
  {#snippet glass()}
    <div class="grid grid-cols-[minmax(0,1fr)] gap-4">
      <div>
        <p class="mb-2 text-sm font-medium">First, the theme:</p>
        <Command
          code={data.theme.code}
          lines={data.theme.lines}
          label="Add the theme"
        />
      </div>
      <div>
        <p class="mb-2 text-sm font-medium">Then a first part:</p>
        <Command
          code={data.button.code}
          lines={data.button.lines}
          label="Add the button"
        />
      </div>
      <p class="text-sm">
        <code>-y</code> answers yes to its questions, and <code>-o</code> lets
        it update <code>src/app.css</code> and write over existing files without asking.
        Leave them off to be asked at each step.
      </p>
    </div>
  {/snippet}

  <div
    data-mode="productive"
    class="mx-auto max-w-7xl px-(--gutter-stage) pt-12 pb-20"
  >
    <div class="grid max-w-(--site-measure) gap-4">
      <h2 class="text-2xl font-semibold tracking-section">Two commands</h2>
      <p>
        The first adds the theme: every colour, size and font, as CSS variables
        and utilities in your app's stylesheet, with the three typefaces. The
        second adds a part, here the
        <a
          href={componentPath("button")}
          class="text-primary underline underline-offset-4">button</a
        >, and anything it needs that you do not have yet.
      </p>
      <p>
        Both write source files into your app. You own them from then on: they
        never reach back to this site when your app runs. Every part has its own
        page under <a
          href="/components/"
          class="text-primary underline underline-offset-4">Components</a
        >, with its command.
      </p>
    </div>
    {#if guides.length}
      <ul class="groove-b mt-12 max-w-(--site-measure)">
        {#each guides as g (g.path)}
          <li class="groove py-3">
            <a href={g.path} class="font-medium text-foreground hover:underline"
              >{g.title}</a
            >
            <p class="text-sm text-muted-foreground">{g.summary}</p>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</Landing>
