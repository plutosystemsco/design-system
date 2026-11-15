<script lang="ts">
  import CompositionPage from "#lib/preview/composition-page.svelte";
</script>

<CompositionPage name="marketing-footer">
  {#snippet when()}
    <p>
      Use the marketing footer to close an expressive page. It holds the logo,
      groups of links and the build's facts.
    </p>
    <ul class="grid list-disc gap-2 ps-6">
      <li>
        Pass the <code>logo</code> snippet (it renders for
        <code>"footer"</code>),
        <code>appName</code> and the <code>groups</code> of links. The build
        facts follow the app shell footer's rules: <code>commit</code>,
        <code>builtAt</code>, <code>docId</code> and <code>sourceHref</code>,
        each row only when its value is given.
      </li>
      <li>
        Place it on the canvas: its links are controls. It is expressive, so in
        the dark theme its mark shows the four colours, lifted, as the bar's
        does.
      </li>
    </ul>
  {/snippet}
  {#snippet dos()}
    <li>Pass the bar's logo snippet, so the footer shows the same logo.</li>
    <li>
      Give each group a short title. The title names the group's navigation.
    </li>
    <li>
      Pass only build facts that are true. Each row shows only when its value is
      given.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Place it on a colour field. Its links are controls.</li>
    <li>Let the footer's logo play an entrance. Only the bar's may.</li>
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
