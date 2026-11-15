<script lang="ts" module>
  export const meta = {
    title: "Keyboard",
    intro:
      "Four stops: an input and its button, a password input and its toggle.",
  };
</script>

<script lang="ts">
  import * as Field from "#lib/registry/ui/field";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import { Label } from "#lib/registry/ui/label";
</script>

<div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
  <div class="grid gap-3">
    <Label for="kb-ig">Invite by email</Label>
    <InputGroup.Root>
      <InputGroup.Input id="kb-ig" type="email" />
      <InputGroup.Addon align="inline-end">
        <InputGroup.Button variant="secondary">Invite</InputGroup.Button>
      </InputGroup.Addon>
    </InputGroup.Root>
  </div>
  <Field.Field>
    <Field.Label>Password</Field.Label>
    <InputGroup.Password autocomplete="current-password" />
  </Field.Field>
</div>
