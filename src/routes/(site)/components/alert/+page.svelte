<script lang="ts">
  import * as roles from "#lib/site/examples/alert/roles.svelte";
  import * as states from "#lib/site/examples/alert/states.svelte";
  import * as variants from "#lib/site/examples/alert/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="alert" examples={{ variants, states, roles }}>
  {#snippet when()}
    <p>
      Use an alert to say something about the page or the task that a reader
      should not miss: a failed run, a saved change, a coming outage. It sits in
      the flow of the page and does not interrupt.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Say what happened in the title: "The run failed".</li>
    <li>Pick the variant by what happened, not by the colour wanted.</li>
    <li>
      Pass <code>role={"{null}"}</code> to an alert that is on the page when it loads.
      Its role is for an alert inserted later.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Place an alert inside a muted or accent inset, a tinted panel. Its tint
      fails contrast there. Put it on the page or a plain panel.
    </li>
    <li>Tell the state by colour or icon alone.</li>
    <li>Use an alert to ask for a choice. Use an alert dialog.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      Destructive renders <code>role="alert"</code>, announced when it is
      inserted. Success and caution render <code>role="status"</code>. Default
      renders none. Pass another <code>role</code>, or
      <code>role={"{null}"}</code> for none.
    </li>
    <li>
      It takes <code>tabindex</code> and binds <code>ref</code>, so an error
      summary can take focus after a failed submit.
    </li>
    <li>The title says the state in words; colour and icon are second cues.</li>
  {/snippet}
</Component>
