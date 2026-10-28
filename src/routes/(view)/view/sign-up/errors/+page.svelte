<script lang="ts">
  import SignUpForm, {
    MESSAGES,
    type SignUpResult,
  } from "#lib/registry/components/sign-up-form.svelte";

  // A malformed email and an 8-character password after a submit, and the
  // consent sentence with both of the app's links, here to "/".
  async function createAccount(): Promise<SignUpResult> {
    return { ok: true };
  }
</script>

<svelte:head><title>Error: Create an account</title></svelte:head>

<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">
  <SignUpForm
    class="w-full max-w-sm"
    onsubmit={createAccount}
    email="ada@"
    password="lovelace"
    errors={{
      email: MESSAGES.emailFormat,
      password: MESSAGES.passwordShort(15),
    }}
    termsHref="/"
    privacyHref="/"
  />
</div>
