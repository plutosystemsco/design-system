<script lang="ts">
  import * as states from "#lib/site/examples/separator/states.svelte";
  import * as variants from "#lib/site/examples/separator/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="separator" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a separator to divide groups of content that sit close together: the
      sections of a menu, or the links in a toolbar. Most separators only
      decorate.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Leave it decorative when spacing or headings already divide the content.
    </li>
    <li>Use the vertical one between short inline items.</li>
  {/snippet}
  {#snippet donts()}
    <li>Use a separator where white space alone would do.</li>
    <li>Stack separators to draw a heavier line.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Decorative by default: <code>role="none"</code>, hidden from assistive
      technology.
    </li>
    <li>
      Pass <code>decorative={"{false}"}</code> for a separator that means
      something; it then renders <code>role="separator"</code> with its orientation.
    </li>
  {/snippet}
</Component>
