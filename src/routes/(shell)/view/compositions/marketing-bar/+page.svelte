<script lang="ts">
  import CompositionView from "#lib/preview/composition-view.svelte";
  import { Lockup } from "#lib/registry/ui/four-dot";
  import { MarketingBar } from "#lib/registry/ui/marketing-bar";

  const SECTIONS = [
    { id: "layer", title: "The layer" },
    { id: "console", title: "Try it" },
  ];
</script>

<!-- The item page's frame: the lockup without its entrance (010 decision 10). -->
{#snippet logo()}
  <Lockup class="text-2xl" />
{/snippet}

<CompositionView title="Marketing bar">
  {#snippet before()}
    <MarketingBar
      {logo}
      homeLabel="Pluto Systems"
      links={SECTIONS.map((s) => ({ label: s.title, href: `#${s.id}` }))}
      secondary={{ label: "Read the docs", href: "/" }}
      primary={{ label: "See the source", href: "/" }}
    />
  {/snippet}
  <div class="mx-auto grid max-w-prose gap-16 px-6 py-16">
    <h1 class="text-5xl font-bold tracking-display">Marketing bar</h1>
    <p class="text-muted-foreground">
      The bar sticks to the top of the page. Scroll: these sections pass under
      its glass panel, frosted, in the page's theme. Below md its links and the
      secondary action fold into a sheet opened by Menu.
    </p>
    {#each SECTIONS as section (section.id)}
      <section
        id={section.id}
        aria-labelledby="{section.id}-title"
        class="grid gap-4"
      >
        <h2 id="{section.id}-title" class="text-2xl font-bold tracking-section">
          {section.title}
        </h2>
        {#each [1, 2, 3, 4] as n (n)}
          <p>
            A paragraph of the page, here so the bar has a page to float over.
            Focus a link below the bar with the keyboard and the page keeps it
            clear of the bar. Paragraph {n}.
          </p>
        {/each}
      </section>
    {/each}
  </div>
</CompositionView>
