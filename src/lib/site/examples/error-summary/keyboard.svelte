<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Submit the form empty: the summary is inserted, its content announced as an alert, and takes focus. Each link focuses its field, and brings the field's label into view if it is not. The last one goes to the radio group's first radio, below its legend.",
  };
</script>

<script lang="ts">
  import { tick } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as RadioGroup from "#lib/registry/ui/radio-group";

  let name = $state("");
  let email = $state("");
  let visibility = $state("");
  let errors = $state<{ name?: string; email?: string; visibility?: string }>(
    {},
  );
  let summary = $state<HTMLElement | null>(null);

  const links = $derived(
    [
      errors.name && { id: "project-name", message: errors.name },
      errors.email && { id: "owner-email", message: errors.email },
      errors.visibility && {
        id: "project-visibility",
        message: errors.visibility,
      },
    ].filter((e): e is { id: string; message: string } => !!e),
  );

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    errors = {
      name: name.trim() ? undefined : "Enter a project name",
      email: email.trim() ? undefined : "Enter the owner's email address",
      visibility: visibility ? undefined : "Choose who can see the project",
    };
    if (links.length === 0) return;
    await tick();
    summary?.focus();
  }
</script>

<form
  novalidate
  onsubmit={submit}
  class="grid max-w-sm gap-6"
  data-testid="keyboard-fixture"
>
  <ErrorSummary bind:ref={summary} errors={links} />
  <Field.Field id="project-name" error={errors.name}>
    <Field.Label>Project name</Field.Label>
    <Input bind:value={name} autocomplete="off" />
  </Field.Field>
  <Field.Field id="owner-email" error={errors.email}>
    <Field.Label>Owner email</Field.Label>
    <Input bind:value={email} type="email" autocomplete="email" />
  </Field.Field>
  <Field.Set id="project-visibility" error={errors.visibility}>
    <Field.Legend variant="label">Who can see it</Field.Legend>
    <RadioGroup.Root bind:value={visibility}>
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="me" id="visibility-me" />
        <Field.Label for="visibility-me">Only me</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="team" id="visibility-team" />
        <Field.Label for="visibility-team">My team</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <RadioGroup.Item value="everyone" id="visibility-everyone" />
        <Field.Label for="visibility-everyone">Everyone</Field.Label>
      </Field.Field>
    </RadioGroup.Root>
  </Field.Set>
  <Button type="submit">Create project</Button>
</form>
