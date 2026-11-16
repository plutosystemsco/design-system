<script lang="ts">
  import { tick } from "svelte";
  import { Button } from "#lib/registry/ui/button";
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import { Textarea } from "#lib/registry/ui/textarea";

  // 022t decision 10: a test surface, not a block's view. Its errors are
  // re-derived on every keystroke, as an app might do. Summary A passes
  // `attempt`; summary B, with the same errors, does not.
  let name = $state("");
  let notes = $state("");
  let submitted = $state(false);
  let attempt = $state(0);
  let a = $state<HTMLElement | null>(null);

  type Values = { name: string; notes: string };

  // Returns a new array on each call. Notes's entry is there whatever its
  // text, so typing in Notes gives a new array whose entries do not change.
  function validate(values: Values): { id: string; message: string }[] {
    const found: { id: string; message: string }[] = [];
    if (!values.name.trim())
      found.push({ id: "attempt-name", message: "Enter a name" });
    found.push({
      id: "attempt-notes",
      message: "Check your notes before you send them",
    });
    return found;
  }

  // Empty until the first submit, so neither summary is in the page at load.
  // Building `{ name, notes }` reads every field's value, Notes included, so
  // each keystroke in either field re-runs the derivation.
  const errors = $derived(submitted ? validate({ name, notes }) : []);

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    submitted = true;
    attempt += 1;
    await tick();
    a?.focus();
  }
</script>

<svelte:head><title>A summary's attempt</title></svelte:head>

<div class="mx-auto grid max-w-2xl gap-12 p-8">
  <h1 class="text-2xl font-semibold">A summary's attempt</h1>

  <form
    novalidate
    onsubmit={submit}
    class="grid max-w-sm gap-6"
    data-testid="attempt-fixture"
  >
    <ErrorSummary
      bind:ref={a}
      {errors}
      {attempt}
      data-testid="summary-a"
      title="There is a problem (A)"
    />
    <ErrorSummary
      {errors}
      data-testid="summary-b"
      title="There is a problem (B)"
    />
    <Field.Field id="attempt-name">
      <Field.Label>Name</Field.Label>
      <Input bind:value={name} autocomplete="off" />
    </Field.Field>
    <Field.Field id="attempt-notes">
      <Field.Label>Notes</Field.Label>
      <Textarea bind:value={notes} />
    </Field.Field>
    <Button type="submit">Send</Button>
  </form>
</div>
