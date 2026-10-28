<script lang="ts">
  import SignUpVerify, {
    type SignUpCodeResult,
  } from "#lib/registry/components/sign-up-verify.svelte";

  async function verifyCode(): Promise<SignUpCodeResult> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { ok: true };
  }
  async function resendCode(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
</script>

<svelte:head><title>Check your email</title></svelte:head>

<div class="flex min-h-svh justify-center px-6 py-16 sm:items-center">
  <SignUpVerify
    class="w-full max-w-sm"
    email="ada@example.com"
    onsubmit={verifyCode}
    onresend={resendCode}
    onchangeemail={() => {}}
  />
</div>
