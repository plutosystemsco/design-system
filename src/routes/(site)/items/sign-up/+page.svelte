<script lang="ts">
  import BlockPage from "#lib/preview/block-page.svelte";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<BlockPage name="sign-up" files={data.files}>
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
      Consent is a sentence with links, shown only when the app gives its terms.
      Its links are 25.6 px tall, in body text.
    </li>
    <li>
      Below 640 px the card drops its frame and the code cells are 32 px, so six
      fit a 320 px screen with every focus indicator in full.
    </li>
  {/snippet}
</BlockPage>
