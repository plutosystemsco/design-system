<script lang="ts">
  import * as keyboard from "#lib/site/examples/accordion/keyboard.svelte";
  import * as states from "#lib/site/examples/accordion/states.svelte";
  import * as variants from "#lib/site/examples/accordion/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="accordion" examples={{ variants, states, keyboard }}>
  {#snippet when()}
    <p>
      Use an accordion for a short list of sections a reader opens one by one:
      questions and answers, or the parts of a report. Use single when one
      section at a time is enough, and multiple when readers compare.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Write each trigger as the section's heading.</li>
    <li>Keep an accordion to six sections or fewer.</li>
    <li>Open the section most people need first.</li>
  {/snippet}
  {#snippet donts()}
    <li>Hide the one thing every reader needs inside a closed section.</li>
    <li>Nest an accordion inside another.</li>
    <li>Use an accordion for a single section. Use a collapsible.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Each trigger is a button inside a heading (<code>level</code>, default 3)
      with <code>aria-expanded</code> and <code>aria-controls</code> naming its section.
    </li>
    <li>
      Each section is a <code>region</code> labelled by its trigger, so a reader can
      jump from panel to panel. Keep an accordion to six sections or fewer; past that,
      the regions clutter the landmark list.
    </li>
    <li>
      Enter and Space toggle a section; Down, Up, Home and End move among the
      triggers; each trigger is a Tab stop.
    </li>
    <li>
      The caret shows the state by shape, not colour alone, and is hidden from
      assistive technology.
    </li>
  {/snippet}
</Component>
