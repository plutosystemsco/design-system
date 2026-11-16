<script lang="ts">
  import * as doName from "#lib/site/examples/tag/do-name.svelte";
  import * as doRole from "#lib/site/examples/tag/do-role.svelte";
  import * as dontName from "#lib/site/examples/tag/dont-name.svelte";
  import * as dontRole from "#lib/site/examples/tag/dont-role.svelte";
  import * as fallback from "#lib/site/examples/tag/fallback.svelte";
  import * as mixed from "#lib/site/examples/tag/mixed.svelte";
  import * as pressable from "#lib/site/examples/tag/pressable.svelte";
  import * as removable from "#lib/site/examples/tag/removable.svelte";
  import * as staticTags from "#lib/site/examples/tag/static.svelte";
  import Component from "#lib/site/page/component.svelte";
</script>

<Component
  name="tag"
  examples={{ removable, pressable, mixed, fallback, static: staticTags }}
>
  {#snippet when()}
    <p>
      Use a tag for a filter a person applied and can remove, or for an option
      they turn on and off. For a status to read, use a
      <a
        href="/components/badge/"
        class="text-primary underline underline-offset-4">badge</a
      >; for a way to somewhere, use a
      <a
        href="/components/link/"
        class="text-primary underline underline-offset-4">link</a
      >.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Let the tag draw its own remove button. {doName.meta.caption}
      <div
        data-pair="name"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doName.default />
      </div>
    </li>
    <li>
      Use it for something to act on where it stands. {doRole.meta.caption}
      <div
        data-pair="role"
        data-pair-kind="do"
        class="mt-2 rounded bg-card p-4"
      >
        <doRole.default />
      </div>
    </li>
    <li>
      Keep a label to three words or fewer, and put removable tags in a
      <code>TagGroup</code>.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>
      Make a remove button of your own from a badge and an ×. {dontName.meta
        .breaks}
      <div
        data-pair="name"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontName.default />
      </div>
    </li>
    <li>
      Make a tag go somewhere. {dontRole.meta.breaks}
      <div
        data-pair="role"
        data-pair-kind="dont"
        inert
        class="mt-2 rounded bg-card p-4"
      >
        <dontRole.default />
      </div>
    </li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      <strong>What Kuiper provides.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          A <code>TagGroup</code> is a list with an explicit
          <code>role="list"</code>, named by your <code>aria-label</code>.
        </li>
        <li>
          Each removable tag has a 24 px remove button named for it, "Remove
          Design". Enter, Space, Delete and Backspace remove it.
        </li>
        <li>
          After a removal, focus moves to the next tag control, then the
          previous, then your <code>fallback</code>, then the list, whose name
          is spoken.
        </li>
        <li>
          A pressable tag is a toggle button with <code>aria-pressed</code> and a
          check while pressed. A static tag is not a Tab stop.
        </li>
      </ul>
    </li>
    <li>
      <strong>Your part.</strong>
      <ul class="mt-2 grid list-disc gap-1 ps-5">
        <li>
          Name the group, with <code>aria-label</code> or
          <code>aria-labelledby</code>.
        </li>
        <li>
          Remove the tag from your list in <code>onremove</code>, at once. If a
          server must agree, remove it now and put it back if the call fails.
        </li>
        <li>Put removable tags in a <code>TagGroup</code>.</li>
        <li>
          Give a <code>fallback</code> when an input adds the tags, so focus returns
          to it when the last one goes.
        </li>
      </ul>
    </li>
  {/snippet}
</Component>
