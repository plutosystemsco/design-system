<script lang="ts" module>
  export type SignInField = "email" | "password";
  export type SignInValues = { email: string; password: string };
  export type SignInResult =
    | { ok: true }
    | {
        ok: false;
        errors?: Partial<Record<SignInField, string>>;
        formError?: string;
      };

  /** The house wording, for the states the app's server reports too. */
  export const MESSAGES = {
    /** When the callback throws or rejects. */
    failed: "We could not sign you in. Try again.",
    emailEmpty: "Enter your email address",
    emailFormat: "Enter an email address like name@example.com",
    passwordEmpty: "Enter your password",
    credentials:
      "That email address and password do not match an account. Check them and try again.",
    tooManyAttempts: "Too many attempts. Wait a while, then try again.",
  } as const;
</script>

<script lang="ts">
  import { tick, type Snippet } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import * as Card from "#lib/registry/ui/card";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import { InputGroupPassword } from "#lib/registry/ui/input-group";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";

  let {
    onsubmit,
    email = $bindable(""),
    errors = $bindable({}),
    formError = $bindable(),
    busy = $bindable(false),
    title = "Sign in",
    description = "Use the email address and password for your account.",
    level = 1,
    idPrefix = "sign-in",
    footer,
    class: className,
  }: {
    onsubmit: (values: SignInValues) => Promise<SignInResult>;
    email?: string;
    errors?: Partial<Record<SignInField, string>>;
    formError?: string;
    busy?: boolean;
    title?: string;
    description?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    idPrefix?: string;
    /** The app's own links, such as "Create an account" or "Forgot your password?". */
    footer?: Snippet;
    class?: string;
  } = $props();

  // Never pre-filled, and emptied when the server refuses the credentials.
  let password = $state("");
  // role="alert" only on a summary a submit in this page inserted.
  let announce = $state(false);
  // What the status says once the callback has answered.
  let notice = $state("");
  let summary = $state<HTMLElement | null>(null);

  const ids = $derived({
    email: `${idPrefix}-email`,
    password: `${idPrefix}-password`,
  });
  const links = $derived(
    (["email", "password"] as const)
      .filter((field) => errors[field])
      .map((field) => ({ id: ids[field], message: errors[field]! })),
  );

  function validate(): Partial<Record<SignInField, string>> {
    const value = email.trim();
    return {
      email: !value
        ? MESSAGES.emailEmpty
        : /^[^@\s]+@[^@\s]+$/.test(value)
          ? undefined
          : MESSAGES.emailFormat,
      password: password ? undefined : MESSAGES.passwordEmpty,
    };
  }

  async function failed() {
    announce = true;
    await tick();
    summary?.focus();
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy) return;
    const found = validate();
    if (found.email || found.password) {
      errors = found;
      formError = undefined;
      notice = "";
      return failed();
    }
    errors = {};
    formError = undefined;
    notice = "";
    busy = true;
    let result: SignInResult;
    try {
      result = await onsubmit({ email: email.trim(), password });
    } catch {
      // A callback that throws keeps what was typed and says so.
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
    if (formError) password = "";
    return failed();
  }
</script>

<!--
  Sign in: email and password in one step. Errors show on submit, never while
  typing; a failed submit puts a summary first in the form and moves focus to
  it. Below sm the card drops its frame, so every control's focus indicator
  shows in full inside the page's gutter.
-->
<Card.Root
  class={cn(
    "max-sm:overflow-visible max-sm:border-0 max-sm:bg-transparent max-sm:py-0",
    className,
  )}
>
  <Card.Header class="max-sm:px-0">
    <Card.Title {level} class="text-2xl tracking-section">{title}</Card.Title>
    <Card.Description>{description}</Card.Description>
  </Card.Header>
  <Card.Content class="max-sm:px-0">
    <form
      novalidate
      data-slot="sign-in-form"
      class="grid gap-6"
      onsubmit={submit}
    >
      <ErrorSummary
        bind:ref={summary}
        {announce}
        errors={links}
        message={formError}
      />
      <Field.Field id={ids.email} error={errors.email}>
        <Field.Label>Email address</Field.Label>
        <Input
          type="email"
          autocomplete="username"
          spellcheck={false}
          autocapitalize="off"
          bind:value={email}
        />
      </Field.Field>
      <Field.Field id={ids.password} error={errors.password}>
        <Field.Label>Password</Field.Label>
        <InputGroupPassword
          autocomplete="current-password"
          bind:value={password}
        />
      </Field.Field>
      <Button type="submit" {busy} class="w-full">Sign in</Button>
      <Status text={busy ? "Signing in…" : notice} />
    </form>
  </Card.Content>
  {#if footer}
    <Card.Footer class="max-sm:px-0">{@render footer()}</Card.Footer>
  {/if}
</Card.Root>
