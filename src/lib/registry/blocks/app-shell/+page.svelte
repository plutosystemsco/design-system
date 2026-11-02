<script lang="ts">
  import { Button } from "#lib/registry/ui/button";

  // The example page the shell wraps: one h1, and the three sections the
  // shipped links point at. Replace it with your own routes.
  const sections = [
    {
      id: "overview",
      title: "Overview",
      text: "Three projects are active this week.",
      link: { label: "Go to the home page", href: "/" },
    },
    {
      id: "activity",
      title: "Activity",
      text: "Nothing has changed since Friday.",
    },
    { id: "members", title: "Members", text: "Four people have access." },
  ];
</script>

<svelte:head><title>Projects</title></svelte:head>

<div class="flex flex-col gap-12">
  <h1
    class="font-heading text-2xl font-bold tracking-section sm:text-5xl sm:tracking-display"
  >
    Projects
  </h1>
  {#each sections as section (section.id)}
    <section id={section.id} class="groove flex flex-col gap-2 pt-12">
      <h2 class="font-heading text-base font-bold">{section.title}</h2>
      <p class="max-w-prose text-muted-foreground">{section.text}</p>
      {#if section.link}
        <Button variant="link" href={section.link.href} class="self-start">
          {section.link.label}
        </Button>
      {/if}
    </section>
  {/each}
</div>
