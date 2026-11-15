<script lang="ts" module>
  export const meta = {
    title: "Variants",
    intro:
      "A message only, links only, or both. Rendered from props, as a page rendering a server's errors would, so none carries a role. Each link goes to its field below.",
  };
</script>

<script lang="ts">
  import { ErrorSummary } from "#lib/registry/ui/error-summary";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";

  const both = [
    { id: "summary-project", message: "Enter a project name" },
    { id: "summary-owner", message: "Enter the owner's email address" },
  ];
</script>

<div class="grid max-w-prose gap-6" data-testid="summary-specimens">
  <ErrorSummary
    announce={false}
    message="That email address and password do not match an account. Check them and try again."
    class="w-full"
  />
  <ErrorSummary announce={false} errors={both} class="w-full" />
  <ErrorSummary
    announce={false}
    message="The project was not created."
    errors={both.slice(0, 1)}
    class="w-full"
  />
  <Field.Field>
    <Field.Label for="summary-project">Project name</Field.Label>
    <Input id="summary-project" aria-invalid="true" />
  </Field.Field>
  <Field.Field>
    <Field.Label for="summary-owner">Owner's email address</Field.Label>
    <Input id="summary-owner" type="email" aria-invalid="true" />
  </Field.Field>
</div>
