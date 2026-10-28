<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="settings" files={data.files}>
  {#snippet accessibility()}
    <li>
      One <code>h1</code>, the page's. Each section is a
      <code>fieldset</code> named by its legend, and the legend holds an
      <code>h2</code>, so the section is both a named group and a heading.
    </li>
    <li>
      Visible labels; <code>autocomplete</code> is <code>name</code> and
      <code>email</code>. Current values are shown, never asked for again.
    </li>
    <li>
      Errors as in sign in: on submit, inline and in a summary that takes focus.
      "Save changes" goes busy, never disabled.
    </li>
    <li>
      "Saved" is said in words in a polite status, after "Saving…", so it is
      announced; its colour is a second cue. After "Discard changes", focus
      moves to Name and the status says "Changes discarded."
    </li>
    <li>
      Deleting the account is confirmed in a dialog that starts on "Keep my
      account". Nothing is sticky, so nothing hides the focused field.
    </li>
    <li>
      The browser asks before leaving with unsaved changes. Checkboxes and
      radios are 24 px; inputs and buttons 48 px.
    </li>
  {/snippet}
</BlockPage>
