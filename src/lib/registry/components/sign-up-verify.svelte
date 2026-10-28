<script lang="ts" module>
  export type SignUpCodeResult =
    | { ok: true }
    | { ok: false; errors?: { code?: string }; formError?: string };

  /** The house wording, for the states the app's server reports too. */
  export const MESSAGES = {
    /** When the callback throws or rejects. */
    failed: "We could not check the code. Try again.",
    /** When the resend callback throws or rejects. */
    resendFailed: "We could not send a new code. Try again.",
    codeEmpty: "Enter the 6-digit code from the email",
    codeIncomplete: "Enter all 6 digits of the code",
    codeWrong: "That code is not right. Check the email, or send a new code.",
    tooManyAttempts: "Too many attempts. Wait a while, then try again.",
  } as const;
</script>

<script lang="ts">
  import { onMount, tick } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import * as InputOTP from "#lib/registry/ui/input-otp";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";

  let {
    email,
    onsubmit,
    onresend,
    onchangeemail,
    code = $bindable(""),
    errors = $bindable({}),
    formError = $bindable(),
    busy = $bindable(false),
    focusOnMount = false,
    level = 1,
    idPrefix = "sign-up",
    title = "Check your email",
    class: className,
  }: {
    /** Shown, never asked for again. */
    email: string;
    onsubmit: (code: string) => Promise<SignUpCodeResult>;
    onresend: () => Promise<void>;
    onchangeemail: () => void;
    code?: string;
    errors?: { code?: string };
    formError?: string;
    busy?: boolean;
    /** Moves focus to the title on mount, when the step changes. */
    focusOnMount?: boolean;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    idPrefix?: string;
    title?: string;
    class?: string;
  } = $props();

  let announce = $state(false);
  let summary = $state<HTMLElement | null>(null);
  let heading = $state<HTMLElement | null>(null);
  let resending = $state(false);
  let sent = $state(0);
  let notice = $state("");

  const id = $derived(`${idPrefix}-code`);
  const links = $derived(errors.code ? [{ id, message: errors.code }] : []);

  onMount(() => {
    if (focusOnMount) heading?.focus();
  });

  async function failed() {
    announce = true;
    await tick();
    summary?.focus();
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    if (code.length < 6) {
      notice = "";
      errors = {
        code: code ? MESSAGES.codeIncomplete : MESSAGES.codeEmpty,
      };
      formError = undefined;
      return failed();
    }
    errors = {};
    formError = undefined;
    notice = "";
    busy = true;
    let result: SignUpCodeResult;
    try {
      result = await onsubmit(code);
    } catch {
      // A callback that throws keeps the code and says so.
      busy = false;
      formError = MESSAGES.failed;
      notice = MESSAGES.failed;
      return failed();
    } finally {
      busy = false;
    }
    if (result.ok) return;
    errors = result.errors ?? {};
    formError = result.formError;
    return failed();
  }

  // Each resend says it is working, then what it did, worded differently
  // after the first, so the region changes and is announced every time.
  async function resend() {
    if (resending) return;
    resending = true;
    notice = "Sending a new code…";
    try {
      await onresend();
      notice =
        sent === 0
          ? `We sent a new code to ${email}.`
          : `We sent another code to ${email}.`;
      sent++;
    } catch {
      notice = MESSAGES.resendFailed;
    } finally {
      resending = false;
    }
  }
</script>

<!--
  Sign up, the code step: the six-digit code, pasted or typed, on its own
  step. Below sm the cells are 32 px squares, so six fit a 320 px screen.
-->
<Card.Root
  class={cn(
    "max-sm:overflow-visible max-sm:border-0 max-sm:bg-transparent max-sm:py-0",
    className,
  )}
>
  <Card.Header class="max-sm:px-0">
    <Card.Title
      bind:ref={heading}
      {level}
      tabindex={-1}
      class="text-2xl tracking-section">{title}</Card.Title
    >
    <Card.Description>
      We sent a 6-digit code to {email}. Enter it below to finish creating your
      account.
    </Card.Description>
  </Card.Header>
  <Card.Content class="max-sm:px-0">
    <form
      novalidate
      data-slot="sign-up-verify"
      class="grid gap-6"
      onsubmit={submit}
    >
      <ErrorSummary
        bind:ref={summary}
        {announce}
        errors={links}
        message={formError}
      />
      <Field.Field
        {id}
        error={errors.code}
        description="You can paste the whole code."
      >
        <Field.Label>Verification code</Field.Label>
        <InputOTP.Root bind:value={code}>
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells.slice(0, 3) as cell, i (i)}
                <InputOTP.Slot {cell} class="max-sm:size-8" />
              {/each}
            </InputOTP.Group>
            <InputOTP.Separator />
            <InputOTP.Group>
              {#each cells.slice(3, 6) as cell, i (i)}
                <InputOTP.Slot {cell} class="max-sm:size-8" />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
      </Field.Field>
      <div class="flex flex-col gap-3">
        <Button type="submit" {busy} class="w-full">Verify email</Button>
        <Button
          variant="secondary"
          busy={resending}
          class="w-full"
          onclick={resend}>Send a new code</Button
        >
        <Button variant="link" class="self-start" onclick={onchangeemail}
          >Use a different email address</Button
        >
      </div>
      <Status text={busy ? "Checking the code…" : notice} />
    </form>
  </Card.Content>
</Card.Root>
