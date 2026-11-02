<script lang="ts">
  import HeroFeatures from "#lib/registry/components/hero-features.svelte";
  import HeroSection from "#lib/registry/components/hero-section.svelte";

  const features = [
    {
      title: "One heading.",
      description: "The page's only h1, 28 px on a phone and 44 px from sm.",
    },
    {
      title: "One action.",
      description:
        "A primary link named by where it goes, and an optional second link beside it.",
    },
    {
      title: "Three short claims.",
      description: "Each a title and one sentence your product can prove.",
    },
  ];
</script>

<svelte:head><title>Say what your product does in one line</title></svelte:head>

<div class="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16 sm:py-24">
  <HeroSection
    eyebrow="sandbox"
    title="Say what your product does in one line"
    description="The opening of a product's home page: one heading, one sentence and one action. Replace these words with your own."
    action={{ label: "Go to the home page", href: "/" }}
    secondary={{ label: "See what the page holds", href: "#hero-features" }}
  />
  <HeroFeatures id="hero-features" title="What the page holds" {features} />
</div>
