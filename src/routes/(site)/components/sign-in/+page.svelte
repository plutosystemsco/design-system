<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="sign-in" files={data.files}>
  {#snippet when()}
    <p>
      Use sign in where a person with an account enters their email and
      password. The block is a page holding one card. The form inside is a
      component of its own, so it can sit on another page too. Success is a
      redirect, which your app makes.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Replace the stand-in <code>signIn</code> with a call to your server.
    </li>
    <li>
      Pass your own links, such as "Forgot your password?", through
      <code>footer</code>.
    </li>
    <li>
      Use the wording in <code>MESSAGES</code> for the states your server reports.
    </li>
  {/snippet}
  {#snippet donts()}
    <li>Say which field was wrong when the email and password do not match.</li>
    <li>Block paste, or take away the way to show the password.</li>
    <li>Disable the button while it signs in. It goes busy instead.</li>
  {/snippet}
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
