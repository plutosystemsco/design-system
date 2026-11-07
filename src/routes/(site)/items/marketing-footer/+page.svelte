<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="marketing-footer">
  {#snippet usage()}
    <li>
      Pass the <code>logo</code> snippet (it renders for <code>"footer"</code>),
      <code>appName</code> and the <code>groups</code> of links. The build facts
      follow the app shell footer's rules: <code>commit</code>,
      <code>builtAt</code>, <code>docId</code> and <code>sourceHref</code>, each
      row only when its value is given.
    </li>
    <li>
      Place it on the canvas: its links are controls. It is expressive, so in
      the dark theme its mark shows the four colours, lifted, as the bar's does.
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      The contentinfo. Each group is a navigation landmark named by its title,
      an
      <code>h2</code> in mono furniture.
    </li>
    <li>
      The logo is not a link, since the bar's is; it is named by
      <code>appName</code>.
    </li>
  {/snippet}
</CompositionPage>
