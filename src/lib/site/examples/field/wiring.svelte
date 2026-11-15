<script lang="ts" module>
  export const meta = {
    title: "Wiring",
    intro:
      "Seven invalid containers, one per control that reads the field, each with a description and an error, and two checkbox sets. A set describes its own fieldset; its checkboxes never take its ids. All of it is in the prerendered HTML.",
  };
</script>

<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as InputOTP from "#lib/registry/ui/input-otp";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
  import { Switch } from "#lib/registry/ui/switch";
  import { Textarea } from "#lib/registry/ui/textarea";

  const DESCRIPTION = "Shown to people you invite.";
  const ERROR = "This field is required.";
</script>

<div data-testid="wiring" class="grid max-w-md gap-8">
  <div data-testid="wiring-input">
    <Field.Field description={DESCRIPTION} error={ERROR}>
      <Field.Label>Display name</Field.Label>
      <Input />
    </Field.Field>
  </div>
  <div data-testid="wiring-textarea">
    <Field.Field description={DESCRIPTION} error={ERROR}>
      <Field.Label>Bio</Field.Label>
      <Textarea />
    </Field.Field>
  </div>
  <div data-testid="wiring-native-select">
    <Field.Field description={DESCRIPTION} error={ERROR}>
      <Field.Label>Region</Field.Label>
      <NativeSelect.Root>
        <NativeSelect.Option value="">Choose a region</NativeSelect.Option>
        <NativeSelect.Option value="eu">Europe</NativeSelect.Option>
      </NativeSelect.Root>
    </Field.Field>
  </div>
  <div data-testid="wiring-checkbox">
    <Field.Field
      orientation="horizontal"
      description={DESCRIPTION}
      error={ERROR}
    >
      <Checkbox />
      <Field.Label>Accept the terms</Field.Label>
    </Field.Field>
  </div>
  <div data-testid="wiring-switch">
    <Field.Field
      orientation="horizontal"
      description={DESCRIPTION}
      error={ERROR}
    >
      <Switch />
      <Field.Label>Public profile</Field.Label>
    </Field.Field>
  </div>
  <div data-testid="wiring-radio-group">
    <Field.Set description={DESCRIPTION} error={ERROR}>
      <Field.Legend>Visibility</Field.Legend>
      <RadioGroup.Root>
        <Field.Field orientation="horizontal">
          <RadioGroup.Item value="public" id="wiring-public" />
          <Field.Label for="wiring-public">Public</Field.Label>
        </Field.Field>
        <Field.Field orientation="horizontal">
          <RadioGroup.Item value="private" id="wiring-private" />
          <Field.Label for="wiring-private">Private</Field.Label>
        </Field.Field>
      </RadioGroup.Root>
    </Field.Set>
  </div>
  <div data-testid="wiring-checkbox-set-bare">
    <Field.Set description={DESCRIPTION} error="Choose at least one.">
      <Field.Legend>Notify me about</Field.Legend>
      <div class="flex gap-6">
        <Checkbox aria-label="Runs" />
        <Checkbox aria-label="Deploys" />
      </div>
    </Field.Set>
  </div>
  <div data-testid="wiring-checkbox-set-fields">
    <Field.Set description={DESCRIPTION} error="Choose at least one.">
      <Field.Legend>Email me about</Field.Legend>
      <Field.Field orientation="horizontal">
        <Checkbox />
        <Field.Label>Failed runs</Field.Label>
      </Field.Field>
      <Field.Field orientation="horizontal">
        <Checkbox />
        <Field.Label>Billing</Field.Label>
      </Field.Field>
    </Field.Set>
  </div>
  <div data-testid="wiring-input-otp">
    <Field.Field description={DESCRIPTION} error={ERROR}>
      <Field.Label>Verification code</Field.Label>
      <InputOTP.Root maxlength={6}>
        {#snippet children({ cells })}
          <InputOTP.Group>
            {#each cells.slice(0, 3) as cell, i (i)}
              <InputOTP.Slot {cell} />
            {/each}
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            {#each cells.slice(3, 6) as cell, i (i)}
              <InputOTP.Slot {cell} />
            {/each}
          </InputOTP.Group>
        {/snippet}
      </InputOTP.Root>
    </Field.Field>
  </div>
</div>
