<script lang="ts">
  import { MarketingFooter } from "#lib/components/ui/marketing-footer";
</script>

{#snippet logo()}
  <span>Kuiper</span>
{/snippet}

<MarketingFooter
  {logo}
  appName="Kuiper"
  groups={[{ title: "Docs", links: [{ label: "Start", href: "/" }] }]}
/>
