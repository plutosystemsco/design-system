<script lang="ts" module>
  export type SignUpField = "email" | "password";
  export type SignUpValues = { email: string; password: string };
  export type SignUpResult =
    | { ok: true }
    | {
        ok: false;
        errors?: Partial<Record<SignUpField, string>>;
        formError?: string;
      };

  /** The house wording, for the states the app's server reports too. */
  export const MESSAGES = {
    /** When the callback throws or rejects. */
    failed: "We could not create your account. Try again.",
    emailEmpty: "Enter your email address",
    emailFormat: "Enter an email address like name@example.com",
    emailUnavailable:
      "That email address cannot be used for a new account. Use a different address, or sign in if it is yours.",
    passwordEmpty: "Enter a password",
    passwordShort: (min: number) =>
      `Use at least ${min} characters for your password`,
    rules: (min: number) =>
      `Use at least ${min} characters. A few words together make a password you can remember.`,
  } as const;
</script>

<script lang="ts">
  import { onMount, tick, type Snippet } from "svelte";
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
    password = $bindable(""),
    errors = $bindable({}),
    formError = $bindable(),
    busy = $bindable(false),
    passwordMinLength = 15,
    termsHref,
    privacyHref,
    focusOnMount = false,
    title = "Create an account",
    description = "You need an email address. We send a code to it to check that it is yours.",
    level = 1,
    idPrefix = "sign-up",
    footer,
    class: className,
  }: {
    onsubmit: (values: SignUpValues) => Promise<SignUpResult>;
    email?: string;
    password?: string;
    errors?: Partial<Record<SignUpField, string>>;
    formError?: string;
    busy?: boolean;
    /** The fewest characters a password may have: 15 or more, never fewer. */
    passwordMinLength?: number;
    /** The terms of service. Without it, no consent sentence renders. */
    termsHref?: string;
    /** The privacy notice, named in the consent sentence when given. */
    privacyHref?: string;
    /** Moves focus to the title on mount, for a return from the code step. */
    focusOnMount?: boolean;
    title?: string;
    description?: string;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    idPrefix?: string;
    /** The app's own links, such as "Sign in instead". */
    footer?: Snippet;
    class?: string;
  } = $props();

  // NIST SP 800-63B-4: 15 when the password is the only factor. An app may
  // raise the floor, never lower it. No upper limit, no composition rule.
  const min = $derived(Math.max(15, passwordMinLength));

  let announce = $state(false);
  // What the status says once the callback has answered.
  let notice = $state("");
  let summary = $state<HTMLElement | null>(null);
  let heading = $state<HTMLElement | null>(null);

  const ids = $derived({
    email: `${idPrefix}-email`,
    password: `${idPrefix}-password`,
  });
  const links = $derived(
    (["email", "password"] as const)
      .filter((field) => errors[field])
      .map((field) => ({ id: ids[field], message: errors[field]! })),
  );

  onMount(() => {
    if (focusOnMount) heading?.focus();
  });

  function validate(): Partial<Record<SignUpField, string>> {
    const value = email.trim();
    return {
      email: !value
        ? MESSAGES.emailEmpty
        : /^[^@\s]+@[^@\s]+$/.test(value)
          ? undefined
          : MESSAGES.emailFormat,
      password: !password
        ? MESSAGES.passwordEmpty
        : password.length < min
          ? MESSAGES.passwordShort(min)
          : undefined,
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
    let result: SignUpResult;
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

  // inline-block: the box is the 25.6 px line, so each link meets 24 px.
  const link = "inline-block text-primary underline underline-offset-4";
</script>

<!--
  Sign up, the details step: email and a password, with the rules written
  before the field. Consent is a sentence under the button, shown only when
  the app gives its terms.
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
    <Card.Description>{description}</Card.Description>
  </Card.Header>
  <Card.Content class="max-sm:px-0">
    <form
      novalidate
      data-slot="sign-up-form"
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
          autocomplete="email"
          spellcheck={false}
          autocapitalize="off"
          bind:value={email}
        />
      </Field.Field>
      <Field.Field
        id={ids.password}
        error={errors.password}
        description={MESSAGES.rules(min)}
        class="*:data-[slot=field-description]:order-first *:data-[slot=field-label]:order-first"
      >
        <Field.Label>Create a password</Field.Label>
        <InputGroupPassword autocomplete="new-password" bind:value={password} />
      </Field.Field>
      <Button type="submit" {busy} class="w-full">Create account</Button>
      {#if termsHref}
        <p data-slot="sign-up-consent" class="text-base text-muted-foreground">
          By creating an account, you agree to the
          <a href={termsHref} class={link}>terms of service</a
          >{#if privacyHref}{" "}and the
            <a href={privacyHref} class={link}>privacy notice</a>{/if}.
        </p>
      {/if}
      <Status text={busy ? "Creating your account…" : notice} />
    </form>
  </Card.Content>
  {#if footer}
    <Card.Footer class="max-sm:px-0">{@render footer()}</Card.Footer>
  {/if}
</Card.Root>
