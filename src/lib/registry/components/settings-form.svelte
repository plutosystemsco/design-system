<script lang="ts" module>
  export type SettingsField = "name" | "email";
  export type SettingsValues = {
    name: string;
    email: string;
    timeZone: string;
    notifyFailures: boolean;
    notifySummary: boolean;
    theme: "system" | "light" | "dark";
  };
  export type SettingsResult =
    | { ok: true }
    | {
        ok: false;
        errors?: Partial<Record<SettingsField, string>>;
        formError?: string;
      };

  /** The house wording, for the states the app's server reports too. */
  export const MESSAGES = {
    /** When the callback throws or rejects. */
    failed: "We could not save your changes. Try again.",
    nameEmpty: "Enter your name",
    emailEmpty: "Enter your email address",
    emailFormat: "Enter an email address like name@example.com",
  } as const;

  /** A short list of IANA zones; an app passes its own. */
  export const TIME_ZONES = [
    { value: "Etc/UTC", label: "Coordinated Universal Time" },
    { value: "Europe/London", label: "London" },
    { value: "America/New_York", label: "New York" },
    { value: "Asia/Tokyo", label: "Tokyo" },
  ];

  function same(a: SettingsValues, b: SettingsValues): boolean {
    return (Object.keys(a) as (keyof SettingsValues)[]).every(
      (key) => a[key] === b[key],
    );
  }
</script>

<script lang="ts">
  import { tick } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
  import { Status } from "#lib/registry/ui/status";
  import { cn } from "#lib/utils";

  let {
    values,
    draft,
    onsave,
    errors = $bindable({}),
    formError = $bindable(),
    busy = $bindable(false),
    saved = $bindable(false),
    dirty = $bindable(false),
    timeZones = TIME_ZONES,
    idPrefix = "settings",
    class: className,
  }: {
    /** What is saved when the form mounts. */
    values: SettingsValues;
    /** The fields' starting values; default `values`. */
    draft?: SettingsValues;
    onsave: (values: SettingsValues) => Promise<SettingsResult>;
    errors?: Partial<Record<SettingsField, string>>;
    formError?: string;
    busy?: boolean;
    /** Shows "Saved". */
    saved?: boolean;
    /** Read-only to the app: the fields differ from the saved copy. */
    dirty?: boolean;
    timeZones?: { value: string; label: string }[];
    idPrefix?: string;
    class?: string;
  } = $props();

  // The saved copy is the form's own: `values` is read once, at mount, and
  // replaced here after each save.
  // svelte-ignore state_referenced_locally
  let savedCopy = $state<SettingsValues>({ ...values });
  // svelte-ignore state_referenced_locally
  let form = $state<SettingsValues>({ ...(draft ?? values) });
  let announce = $state(false);
  let notice = $state("");
  let summary = $state<HTMLElement | null>(null);
  let nameInput = $state<HTMLInputElement | null>(null);

  const changed = $derived(!same(form, savedCopy));
  const ids = $derived({
    name: `${idPrefix}-name`,
    email: `${idPrefix}-email`,
    timeZone: `${idPrefix}-time-zone`,
    failures: `${idPrefix}-notify-failures`,
    summary: `${idPrefix}-notify-summary`,
    theme: `${idPrefix}-theme`,
  });
  const links = $derived(
    (["name", "email"] as const)
      .filter((field) => errors[field])
      .map((field) => ({ id: ids[field], message: errors[field]! })),
  );
  const statusText = $derived(busy ? "Saving…" : saved ? "Saved" : notice);

  $effect(() => {
    dirty = changed;
  });
  // The first change after a save or a discard clears what the status said.
  $effect(() => {
    if (changed) {
      saved = false;
      notice = "";
    }
  });

  function validate(): Partial<Record<SettingsField, string>> {
    const email = form.email.trim();
    return {
      name: form.name.trim() ? undefined : MESSAGES.nameEmpty,
      email: !email
        ? MESSAGES.emailEmpty
        : /^[^@\s]+@[^@\s]+$/.test(email)
          ? undefined
          : MESSAGES.emailFormat,
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
    if (found.name || found.email) {
      notice = "";
      errors = found;
      formError = undefined;
      return failed();
    }
    errors = {};
    formError = undefined;
    notice = "";
    saved = false;
    const next = $state.snapshot(form);
    busy = true;
    let result: SettingsResult;
    try {
      result = await onsave(next);
    } catch {
      // A callback that throws keeps every change and says so.
      busy = false;
      formError = MESSAGES.failed;
      notice = MESSAGES.failed;
      return failed();
    } finally {
      busy = false;
    }
    if (result.ok) {
      savedCopy = next;
      saved = true;
      return;
    }
    errors = result.errors ?? {};
    formError = result.formError;
    return failed();
  }

  // Discarding unmounts the focused button, so focus moves to the first
  // field, and the status says what happened.
  async function discard() {
    form = { ...savedCopy };
    errors = {};
    formError = undefined;
    await tick();
    notice = "Changes discarded.";
    nameInput?.focus();
  }

  function beforeUnload(event: BeforeUnloadEvent) {
    if (!changed) return;
    event.preventDefault();
    event.returnValue = "";
  }

  // A legend's h2 ranks under the page's h1 at every width.
  const legend = "font-heading text-base font-bold";
  const set = "*:data-[slot=field-description]:order-first";
</script>

<svelte:window onbeforeunload={beforeUnload} />

<!--
  One column of sections, saved by one button at the bottom. Nothing here
  saves at once, so the form has no switches.
-->
<form
  novalidate
  data-slot="settings-form"
  class={cn("flex flex-col gap-12", className)}
  onsubmit={submit}
>
  <ErrorSummary
    bind:ref={summary}
    {announce}
    errors={links}
    message={formError}
  />

  <Field.Set description="How you appear to people you work with." class={set}>
    <Field.Legend><h2 class={legend}>Profile</h2></Field.Legend>
    <Field.Field id={ids.name} error={errors.name}>
      <Field.Label>Name</Field.Label>
      <Input bind:ref={nameInput} autocomplete="name" bind:value={form.name} />
    </Field.Field>
    <Field.Field
      id={ids.email}
      error={errors.email}
      description="Notices about your account go here."
    >
      <Field.Label>Email address</Field.Label>
      <Input
        type="email"
        autocomplete="email"
        spellcheck={false}
        autocapitalize="off"
        bind:value={form.email}
      />
    </Field.Field>
    <Field.Field
      id={ids.timeZone}
      description="Dates and times show in this zone."
    >
      <Field.Label>Time zone</Field.Label>
      <NativeSelect.Root bind:value={form.timeZone}>
        {#each timeZones as zone (zone.value)}
          <NativeSelect.Option value={zone.value}
            >{zone.label}</NativeSelect.Option
          >
        {/each}
      </NativeSelect.Root>
    </Field.Field>
  </Field.Set>

  <div class="groove pt-12">
    <Field.Set description="Choose what we email you about." class={set}>
      <Field.Legend><h2 class={legend}>Email notifications</h2></Field.Legend>
      <Field.Field id={ids.failures} orientation="horizontal">
        <Checkbox bind:checked={form.notifyFailures} />
        <Field.Label>When a run fails</Field.Label>
      </Field.Field>
      <Field.Field id={ids.summary} orientation="horizontal">
        <Checkbox bind:checked={form.notifySummary} />
        <Field.Label>A weekly summary</Field.Label>
      </Field.Field>
    </Field.Set>
  </div>

  <div class="groove pt-12">
    <Field.Set description="The colour scheme for this device." class={set}>
      <Field.Legend><h2 class={legend}>Theme</h2></Field.Legend>
      <RadioGroup.Root bind:value={form.theme}>
        {#each [["system", "Match the system"], ["light", "Light"], ["dark", "Dark"]] as [value, label] (value)}
          <Field.Field orientation="horizontal">
            <RadioGroup.Item {value} id="{ids.theme}-{value}" />
            <Field.Label for="{ids.theme}-{value}">{label}</Field.Label>
          </Field.Field>
        {/each}
      </RadioGroup.Root>
    </Field.Set>
  </div>

  <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
    <Button type="submit" {busy} class="w-full sm:w-auto">Save changes</Button>
    {#if changed}
      <Button variant="secondary" class="w-full sm:w-auto" onclick={discard}
        >Discard changes</Button
      >
    {/if}
    <Status
      visible
      text={statusText}
      class={cn("text-sm", statusText === "Saved" && "text-success")}
    />
  </div>
</form>
