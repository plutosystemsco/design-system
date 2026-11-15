<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="settings" files={data.files}>
  {#snippet when()}
    <p>
      Use settings for a person's own account: their profile, their email
      notifications and their theme. Changes apply when they save. Deleting the
      account sits apart, below the form, and asks first in an alert dialog.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Replace the stand-ins <code>saveSettings</code> and
      <code>deleteAccount</code> with calls to your server.
    </li>
    <li>
      Pass <code>SettingsDelete</code> your own <code>requested</code> line, saying
      what your app does next.
    </li>
    <li>Apply the chosen theme in your app. The block only stores it.</li>
  {/snippet}
  {#snippet donts()}
    <li>Save a field the moment it changes. One save applies them all.</li>
    <li>Make anything sticky. It would hide the focused field.</li>
    <li>Delete the account without the confirming dialog.</li>
  {/snippet}
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
      Errors work as in the sign-in block: they show on submit, inline and in a
      summary that takes focus. "Save changes" goes busy, never disabled.
    </li>
    <li>
      "Saved" is said in words in a polite status, after "Saving…", so it is
      announced; its colour is a second cue. After "Discard changes", focus
      moves to Name and the status says "Changes discarded."
    </li>
    <li>
      Deleting the account is confirmed in an alert dialog, with focus on "Keep
      my account". Nothing is sticky, so nothing hides the focused field.
    </li>
    <li>
      The browser asks before leaving with unsaved changes. Checkboxes and
      radios are 24 px; inputs and buttons 48 px.
    </li>
  {/snippet}
</BlockPage>
