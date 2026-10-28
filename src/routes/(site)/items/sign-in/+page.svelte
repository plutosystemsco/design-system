<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="sign-in" files={data.files}>
  {#snippet accessibility()}
    <li>One <code>h1</code>, the card's title.</li>
    <li>
      Visible labels; <code>autocomplete</code> is <code>username</code> and
      <code>current-password</code>, so password managers fill both. Paste is
      never blocked, and the password can be shown.
    </li>
    <li>
      Errors show on submit, in words, inline and in a summary first in the
      form. The summary takes focus; each of its links focuses its field.
    </li>
    <li>
      A wrong email or password is one message that names neither field, and the
      password is emptied.
    </li>
    <li>
      The button goes busy, not disabled, and keeps focus; a hidden status says
      "Signing in…".
    </li>
    <li>
      Below 640 px the card drops its frame, so every focus indicator shows in
      full inside the page's gutter. Inputs and buttons are 48 px tall.
    </li>
  {/snippet}
</BlockPage>
