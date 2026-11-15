<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="sign-up" files={data.files}>
  {#snippet when()}
    <p>
      Use sign up to create an account. It takes three steps: an email and a
      password, then a code sent to that email, then a page that says the
      account is ready. Each step has its own heading and page title.
    </p>
  {/snippet}
  {#snippet dos()}
    <li>
      Replace the stand-ins <code>createAccount</code>,
      <code>verifyCode</code> and <code>resendCode</code> with calls to your server.
    </li>
    <li>
      Pass <code>termsHref</code>, and <code>privacyHref</code> if you have one, so
      the consent sentence shows.
    </li>
    <li>Keep the way back from the code step to change the email.</li>
  {/snippet}
  {#snippet donts()}
    <li>Ask for the email twice.</li>
    <li>
      Set a password minimum below 15 characters, or add a
      <code>maxlength</code> or a composition rule.
    </li>
    <li>Ship the stand-in code check: it accepts only 123456.</li>
  {/snippet}
  {#snippet accessibility()}
    <li>
      One <code>h1</code> per step; each new step's heading takes focus, so a screen
      reader says where the reader now is.
    </li>
    <li>
      <code>autocomplete</code> is <code>email</code> and
      <code>new-password</code>. The password's rules are written before it and
      read with it, through <code>aria-describedby</code>. No
      <code>maxlength</code>, no composition rule; at least 15 characters.
    </li>
    <li>
      The code input takes a pasted code and <code>one-time-code</code>, and the
      email is shown again, never asked for twice.
    </li>
    <li>
      Errors as in sign in: on submit, inline and in a summary that takes focus.
      Every resend is announced: a working message comes between two results,
      and the second result is worded differently.
    </li>
    <li>
      Consent is a sentence with links, shown only when the consuming app gives
      its terms. Its links are 25.6 px tall, in body text.
    </li>
    <li>
      Below 640 px the card drops its frame and the code cells are 32 px, so six
      fit a 320 px screen with every focus indicator in full.
    </li>
  {/snippet}
</BlockPage>
