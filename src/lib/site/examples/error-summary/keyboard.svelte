<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Submit the form empty: the summary is inserted with role alert and takes focus. Each link moves focus to its field.",
  };
</script>

<script lang="ts">
  import { tick } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";

  let name = $state("");
  let email = $state("");
  let errors = $state<{ name?: string; email?: string }>({});
  let summary = $state<HTMLElement | null>(null);

  const links = $derived(
    [
      errors.name && { id: "project-name", message: errors.name },
      errors.email && { id: "owner-email", message: errors.email },
    ].filter((e): e is { id: string; message: string } => !!e),
  );

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    errors = {
      name: name.trim() ? undefined : "Enter a project name",
      email: email.trim() ? undefined : "Enter the owner's email address",
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
  <Button type="submit">Create project</Button>
</form>
