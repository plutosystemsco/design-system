<script lang="ts">
  import SignUpForm, {
    type SignUpField,
    type SignUpResult,
    type SignUpValues,
  } from "#lib/registry/components/sign-up-form.svelte";
  import SignUpVerify, {
    MESSAGES,
    type SignUpCodeResult,
  } from "#lib/registry/components/sign-up-verify.svelte";
  import { Button } from "#lib/registry/ui/button";
  import { titleFor } from "#lib/registry/ui/error-summary";

  let step = $state<"details" | "verify" | "done">("details");
  let email = $state("");
  let returning = $state(false);
  let errors = $state<Partial<Record<SignUpField, string>>>({});
  let formError = $state<string>();
  let codeErrors = $state<{ code?: string }>({});
  let codeFormError = $state<string>();
  let done = $state<HTMLElement | null>(null);

  const title = $derived(
    step === "details"
      ? "Create an account"
      : step === "verify"
        ? "Check your email"
        : "Your account is ready",
  );
  const failed = $derived(
    step === "details"
      ? Object.values(errors).some(Boolean) || Boolean(formError)
      : step === "verify"
        ? Boolean(codeErrors.code) || Boolean(codeFormError)
        : false,
  );

  // A stand-in for your server. Replace it.
  async function createAccount(values: SignUpValues): Promise<SignUpResult> {
    void values;
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: true };
  }

  // A stand-in for your server. Replace it. The right code is 123456.
  async function verifyCode(code: string): Promise<SignUpCodeResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return code === "123456"
      ? { ok: true }
      : { ok: false, errors: { code: MESSAGES.codeWrong } };
  }

  // A stand-in for your server. Replace it.
  async function resendCode(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  async function details(values: SignUpValues): Promise<SignUpResult> {
    const result = await createAccount(values);
    if (result.ok) step = "verify";
    return result;
  }

  async function verify(code: string): Promise<SignUpCodeResult> {
    const result = await verifyCode(code);
    if (result.ok) step = "done";
    return result;
  }

  function changeEmail() {
    returning = true;
    codeErrors = {};
    codeFormError = undefined;
    step = "details";
  }

  // The new step replaces the form under focus; its heading takes focus.
  $effect(() => {
    if (step === "done") done?.focus();
  });
</script>

<svelte:head><title>{titleFor(title, failed)}</title></svelte:head>

<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">
  {#if step === "details"}
    <SignUpForm
      class="w-full max-w-sm"
      onsubmit={details}
      focusOnMount={returning}
      bind:email
      bind:errors
      bind:formError
    />
  {:else if step === "verify"}
    <SignUpVerify
      class="w-full max-w-sm"
      {email}
      onsubmit={verify}
      onresend={resendCode}
      onchangeemail={changeEmail}
      focusOnMount
      bind:errors={codeErrors}
      bind:formError={codeFormError}
    />
  {:else}
    <div class="flex w-full max-w-sm flex-col gap-6">
      <h1
        bind:this={done}
        tabindex="-1"
        class="font-heading text-2xl font-bold tracking-section text-foreground"
      >
        Your account is ready
      </h1>
      <p class="text-muted-foreground">
        The account for {email} is ready to use.
      </p>
      <Button href="/" class="w-full">Continue</Button>
    </div>
  {/if}
</div>
