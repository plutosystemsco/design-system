<script lang="ts">
  import HeroFeatures from "#lib/registry/components/hero-features.svelte";
  import HeroSection from "#lib/registry/components/hero-section.svelte";

  const features = [
    {
      title: "One source for every colour and size.",
      description:
        "Each colour, space and radius comes from one token file, checked for contrast in light and dark.",
    },
    {
      title: "Source, not a package.",
      description:
        "An app installs a component once and owns the copy. Nothing reaches back to the registry at run time.",
    },
    {
      title: "Built for the keyboard.",
      description:
        "Every component works by keyboard, and tests check each one's focus order and its focus style.",
    },
  ];
</script>

<svelte:head><title>Components you copy in and own</title></svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:py-24">
  <HeroSection
    eyebrow="pluto systems · design system"
    title="Components you copy in and own"
    description="Tokens, styles and Svelte components for Pluto Systems apps. One command copies a component's source into your project, and from then on it is yours to change."
    action={{ label: "Browse the components", href: "/" }}
    secondary={{ label: "See what is included", href: "#hero-features" }}
  />
  <HeroFeatures id="hero-features" title="What is included" {features} />
</div>
