<script lang="ts">
  import SignInForm, {
    type SignInResult,
  } from "#lib/registry/components/sign-in-form.svelte";

  // The button busy and the status saying so.
  async function signIn(): Promise<SignInResult> {
    return { ok: true };
  }
</script>

<svelte:head><title>Sign in</title></svelte:head>

<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">
  <SignInForm
    class="w-full max-w-sm"
    onsubmit={signIn}
    email="ada@example.com"
    busy
  />
</div>
