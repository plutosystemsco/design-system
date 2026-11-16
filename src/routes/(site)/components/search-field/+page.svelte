<script lang="ts">
  import * as disabled from "#lib/site/examples/search-field/disabled.svelte";
  import * as doLabel from "#lib/site/examples/search-field/do-label.svelte";
  import * as doLandmark from "#lib/site/examples/search-field/do-landmark.svelte";
  import * as dontLabel from "#lib/site/examples/search-field/dont-label.svelte";
  import * as dontLandmark from "#lib/site/examples/search-field/dont-landmark.svelte";
  import * as filter from "#lib/site/examples/search-field/filter.svelte";
  import * as fromAServer from "#lib/site/examples/search-field/from-a-server.svelte";
  import * as inADialog from "#lib/site/examples/search-field/in-a-dialog.svelte";
  import * as inAField from "#lib/site/examples/search-field/in-a-field.svelte";
  import * as site from "#lib/site/examples/search-field/site.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="search-field"
  examples={{
    filter,
    "from-a-server": fromAServer,
    site,
    "in-a-field": inAField,
    "in-a-dialog": inADialog,
    disabled,
  }}
>
  {#snippet when()}
    <p>
      Use a search field to filter a list as a person types, or for the site's
      own search. To choose one of a known set as you type, a combobox is the
      part; it comes with the next batch.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Name it with a visible label. {doLabel.meta.caption}
      <div
        data-pair="label"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doLabel.default />
      </div>
    </li>
    <li>
      Wrap the site's search, and only it, in a <code>&lt;search&gt;</code>
      element. {doLandmark.meta.caption}
      <div
        data-pair="landmark"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doLandmark.default />
      </div>
    </li>
    <li>
      Pass <code>results</code>, the count for what is typed now. From a server,
      set it to <code>undefined</code> while the answer is on its way, and pass
      <code>resultsFor</code>.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Name it by its placeholder alone. {dontLabel.meta.breaks}
      <div
        data-pair="label"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontLabel.default />
      </div>
    </li>
    <li>
      Put every filter box in a search landmark. {dontLandmark.meta.breaks}
      <div
        data-pair="landmark"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontLandmark.default />
      </div>
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          An <code>&lt;input type="search"&gt;</code>, a <code>searchbox</code>,
          with its magnifier hidden from assistive technology.
        </li>
        <li>
          A Clear button named "Clear search", shown while there is text. It is
          a Tab stop, and it returns focus to the input.
        </li>
        <li>
          Escape clears a filled field and stops there, so a dialog around it
          stays open. On an empty, disabled or read-only field, or while an
          input method is composing, it passes on.
        </li>
        <li>
          A hidden status, in the page from the first render, speaks
          <code>results</code> once a pause, when typing has paused for 750 ms and
          the count is for what is typed now. It never speaks a count on every keystroke,
          or one for an older query.
        </li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          Name it with a label: a <code>Label for</code>, a <code>Field</code>,
          or <code>aria-label</code>. Never by its placeholder.
        </li>
        <li>
          Pass <code>results</code>, so a person hears what the search found.
        </li>
        <li>
          Set <code>results</code> to <code>undefined</code> while a server's
          count is on its way, and pass <code>resultsFor</code>.
        </li>
        <li>
          Wrap the site's search, and only it, in a <code>&lt;search&gt;</code> element.
        </li>
      </ul>
    </li>
  {/snippet}
</Component>
