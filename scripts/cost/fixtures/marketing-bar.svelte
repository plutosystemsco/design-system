<script lang="ts">
  import { MarketingBar } from "#lib/components/ui/marketing-bar";
</script>

{#snippet logo()}
  <span>Kuiper</span>
{/snippet}

<MarketingBar
  {logo}
  homeLabel="Kuiper"
  links={[{ label: "Docs", href: "/" }]}
  primary={{ label: "Start", href: "/" }}
/>
<!-- The bar's skip link lands here. -->
<main id="main"></main>
