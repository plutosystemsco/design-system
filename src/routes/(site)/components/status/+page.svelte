<script lang="ts">
  import * as states from "#lib/site/examples/status/states.svelte";
  import * as variants from "#lib/site/examples/status/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="status" examples={{ variants, states }}>
  {#snippet when()}
    <p>
      Use a status to tell a screen reader about a change that needs no action:
      copied, saved, three results. It is polite: it waits until the reader is
      done speaking.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Mount it empty, then set its text.</li>
    <li>Keep the message short and complete in itself.</li>
    <li>Set a working message, such as "Saving…", between two results.</li>
  {/snippet}
  {#snippet donts()}
    <li>Insert a status with its text already set: it is not announced.</li>
    <li>Use it for an error that must interrupt. Use an error summary.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>role="status"</code> with <code>aria-live="polite"</code>, which
      some screen readers need although the role implies it, and
      <code>aria-atomic="true"</code>, so a change reads the whole message.
    </li>
    <li>
      Present at mount, empty. A region announces only if it was in the page
      before its text changed: mount it first, then set the text.
    </li>
    <li>
      New text replaces the old and is announced. <code>""</code> clears it silently.
      The same text twice is not announced again, so put a working message, such as
      "Saving…", between two results.
    </li>
    <li>
      Polite only. An error that must interrupt is an error summary or a
      destructive alert.
    </li>
  {/snippet}
</Component>
