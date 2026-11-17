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
    <li>
      Move focus to the summary, and raise <code>attempt</code>, after every
      failed submit.
    </li>
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
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          <code>role="alert"</code> is on the summary's content, not on the root that
          takes focus, and only when a submit in this page inserted it, never on content
          present at load.
        </li>
        <li>
          The root has <code>tabindex="-1"</code>, no role and no name, and
          stays out of the Tab order. The heading is read first.
        </li>
        <li>
          A heading, "There is a problem", so a reader moving by heading finds
          it again.
        </li>
        <li>
          Each link holds its field's inline error and goes to the field's id;
          activating it focuses the field. If the field or its label is out of
          view or covered, it first brings the label to the top of the page, or
          a radio or checkbox's legend. No hash joins the address. Each link is
          at least 24 px tall.
        </li>
        <li>
          A link to a radio group's id focuses its checked radio, or its first.
        </li>
        <li>
          Each new <code>attempt</code> renders the content anew, so its alert
          is announced again on an unchanged submit. With <code>attempt</code> unchanged,
          nothing re-renders, however often the errors are re-derived.
        </li>
        <li>Heard with VoiceOver on macOS. NVDA and JAWS are not tested.</li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>Move focus to the summary's root after every failed submit.</li>
        <li>
          Give the summary its own row, as wide as the form. A long word wraps
          inside it; squeezed into a narrow column beside something wide, its
          words break letter by letter.
        </li>
        <li>
          On each failed submit, raise <code>attempt</code> by one, in the same update
          that sets the errors, then move focus. Never raise it while the person types.
        </li>
        <li>
          With <code>announce={"{false}"}</code>, a new <code>attempt</code> renders
          the content again in silence. Raise it only on a failed submit, never while
          focus is inside the summary: a link focused there is lost.
        </li>
        <li>
          Pass <code>announce={"{false}"}</code> for a summary in the page at
          load. Do not pass <code>role</code> to the summary.
        </li>
        <li>
          A page with a sticky header declares it, with
          <code>data-sticky-bar</code> or its own
          <code>scroll-padding-top</code>, so the label stops below it.
        </li>
        <li>Link a checkbox question to its first checkbox.</li>
        <li>
          Use <code>titleFor(title, failed)</code> for the page's one title: it prefixes
          "Error: " while a summary shows.
        </li>
      </ul>
    </li>
  {/snippet}
</Component>
