<script lang="ts">
  import { tick } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

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

  const both = [
    { id: "project-name", message: "Enter a project name" },
    { id: "owner-email", message: "Enter the owner's email address" },
  ];
</script>

<ItemHeader name="error-summary" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Rendered from props, as a page rendering a server's errors would, so none carries a role. Each link goes to a field of the form in the Keyboard section."
>
  <div class="grid max-w-prose gap-6" data-testid="summary-specimens">
    <Specimen caption="a message only" class="w-full">
      <ErrorSummary
        announce={false}
        message="That email address and password do not match an account. Check them and try again."
        class="w-full"
      />
    </Specimen>
    <Specimen caption="links only" class="w-full">
      <ErrorSummary announce={false} errors={both} class="w-full" />
    </Specimen>
    <Specimen caption="both" class="w-full">
      <ErrorSummary
        announce={false}
        message="The project was not created."
        errors={both.slice(0, 1)}
        class="w-full"
      />
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection
  id="states"
  title="States"
  intro="Announced: inserted by a failed submit with role=alert, and focused. From props: rendered with the page, announce={false}, no role; the app moves focus to it."
>
  <p class="max-w-prose text-muted-foreground">
    The Keyboard section shows the announced state; the specimens above show the
    state from props. <code>titleFor("Projects", true)</code> gives
    <code>"Error: Projects"</code> for the page's one title.
  </p>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>role="alert"</code> only when a submit in this page inserted it, never
      on content present at load.
    </li>
    <li>
      <code>tabindex="-1"</code>: the form moves focus to it after every failed
      submit, and it stays out of the Tab order.
    </li>
    <li>
      A heading, "There is a problem", so a reader moving by heading finds it
      again.
    </li>
    <li>
      Each link holds its field's inline error and goes to the field's id;
      activating it focuses the field. Each link is at least 24 px tall.
    </li>
    <li>
      <code>titleFor(title, failed)</code> prefixes "Error: " to the page's one title
      while a summary shows.
    </li>
  </ul>
</PreviewSection>

<PreviewSection id="keyboard" title="Keyboard">
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
</PreviewSection>
