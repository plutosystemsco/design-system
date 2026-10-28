<script lang="ts">
  import SignInForm, {
    MESSAGES,
    type SignInResult,
  } from "#lib/registry/components/sign-in-form.svelte";

  // Both fields empty after a submit, rendered from props.
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
    errors={{ email: MESSAGES.emailEmpty, password: MESSAGES.passwordEmpty }}
  />
</div>
