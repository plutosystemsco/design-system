<script lang="ts">
  import * as variants from "#lib/site/examples/skeleton/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="skeleton" examples={{ variants }}>
  {#snippet when()}
    <p>
      Use a skeleton to hold the place of content that is loading, in its shape,
      so the page does not jump when it arrives.
    </p>
    <p>
      It has one state. The region it fills carries <code>aria-busy</code>
      while it loads.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Match the shape and size of the content that will replace it.</li>
    <li>Set <code>aria-busy</code> on the region while it loads.</li>
  {/snippet}
  {#snippet donts()}
    <li>Make it shimmer or pulse.</li>
    <li>Use a skeleton for an action that is running. Use a spinner.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>Hidden from assistive technology: <code>aria-hidden="true"</code>.</li>
    <li>Static, so it never loops.</li>
  {/snippet}
</Component>
