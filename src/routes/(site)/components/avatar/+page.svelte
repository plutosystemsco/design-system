<script lang="ts">
  import * as states from "#lib/site/examples/avatar/states.svelte";
  import * as variants from "#lib/site/examples/avatar/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="avatar" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use an avatar to show who a person is, next to their name or their work.
      When there is no image, it shows their initials.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Show the person's name beside the avatar, or in its image's alt text.
    </li>
    <li>Use two initials in the fallback.</li>
    <li>Use a group with a count when there are more people than room.</li>
  {/snippet}
  {#snippet donts()}
    <li>Make the avatar round: it keeps the case radius.</li>
    <li>Use an avatar for a product or a project. Use an icon.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>The image needs <code>alt</code> from the consuming app.</li>
    <li>
      The fallback's initials are text. This page shows no image, because the
      site ships no image file.
    </li>
  {/snippet}
</Component>
