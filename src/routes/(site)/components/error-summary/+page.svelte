<script lang="ts">
  import * as keyboard from "#lib/site/examples/error-summary/keyboard.svelte";
  import * as variants from "#lib/site/examples/error-summary/variants.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component name="error-summary" examples={{ variants, keyboard }}>
  {#snippet when()}
    <p>
      Use an error summary at the top of a form that failed to submit. It lists
      every problem, and each link goes to the field that needs fixing.
    </p>
    <p>
      It has two states. Announced: inserted by a failed submit, its content
      carrying <code>role="alert"</code>, and focused, as the Keyboard example
      shows. From props: rendered with the page,
      <code>announce={"{false}"}</code>, no role, as the variants show; the
      consuming app moves focus to it.
    </p>
    <p>
      <code>titleFor("Projects", true)</code> gives
      <code>"Error: Projects"</code> for the page's one title.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>Move focus to the summary after every failed submit.</li>
    <li>Use each field's inline error as its link's text.</li>
    <li>Prefix the page's title with "Error: " while the summary shows.</li>
  {/snippet}
  {#snippet donts()}
    <li>Give a summary that is there at load the alert role.</li>
    <li>List an error without a link to its field.</li>
    <li>Use it for a message that needs no fixing. Use a status.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <code>role="alert"</code> is on the summary's content, not on the root
      that takes focus, and only when a submit in this page inserted it, never
      on content present at load. Do not pass <code>role</code> to the summary.
    </li>
    <li>
      The root has <code>tabindex="-1"</code>, no role and no name: the form
      moves focus to it after every failed submit, and it stays out of the Tab
      order. The heading is read first.
    </li>
    <li>
      A heading, "There is a problem", so a reader moving by heading finds it
      again.
    </li>
    <li>
      Each link holds its field's inline error and goes to the field's id;
      activating it focuses the field. If the field or its label is out of view
      or covered, it first brings the label to the top of the page, or a radio
      or checkbox's legend. No hash joins the address. A page with a sticky
      header declares it, with <code>data-sticky-bar</code> or its own
      <code>scroll-padding-top</code>, so the label stops below it. Each link is
      at least 24 px tall.
    </li>
    <li>
      A link to a radio group's id focuses its checked radio, or its first. Link
      a checkbox question to its first checkbox.
    </li>
    <li>Not yet heard with a screen reader. NVDA and JAWS are not tested.</li>
    <li>
      <code>titleFor(title, failed)</code> prefixes "Error: " to the page's one title
      while a summary shows.
    </li>
  {/snippet}
</Component>
