<script lang="ts">
  import { Button } from "#lib/registry/ui/button";
  import SignInForm, {
    MESSAGES,
    type SignInResult,
  } from "#lib/registry/components/sign-in-form.svelte";

  // The credential message, the email kept, the password emptied; and the
  // app's footer link, here to "/".
  async function signIn(): Promise<SignInResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: false, formError: MESSAGES.credentials };
  }
</script>

<svelte:head><title>Error: Sign in</title></svelte:head>

<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">
  <SignInForm
    class="w-full max-w-sm"
    onsubmit={signIn}
    email="ada@example.com"
    formError={MESSAGES.credentials}
  >
    {#snippet footer()}
      <Button variant="link" size="sm" href="/">Create an account</Button>
    {/snippet}
  </SignInForm>
</div>
