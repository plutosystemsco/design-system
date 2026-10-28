<script lang="ts">
  import SignInForm, {
    MESSAGES,
    type SignInField,
    type SignInResult,
    type SignInValues,
  } from "#lib/registry/components/sign-in-form.svelte";
  import { titleFor } from "#lib/registry/ui/error-summary";

  let errors = $state<Partial<Record<SignInField, string>>>({});
  let formError = $state<string>();
  const failed = $derived(
    Object.values(errors).some(Boolean) || Boolean(formError),
  );

  // A stand-in for your server. Replace it.
  // It always refuses: success is a redirect, which is your app's (goto).
  async function signIn(values: SignInValues): Promise<SignInResult> {
    void values;
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: false, formError: MESSAGES.credentials };
  }
</script>

<svelte:head><title>{titleFor("Sign in", failed)}</title></svelte:head>

<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">
  <SignInForm
    class="w-full max-w-sm"
    onsubmit={signIn}
    bind:errors
    bind:formError
  />
</div>
