<script lang="ts">
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
  import { Switch } from "#lib/registry/ui/switch";
  import { Textarea } from "#lib/registry/ui/textarea";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import OtpSix from "#lib/preview/otp-six.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const DESCRIPTION = "Shown to people you invite.";
  const ERROR = "This field is required.";
</script>

<ItemHeader name="field" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="A field renders its children, then its description, then its error, and wires both to the control."
>
  <div class="grid max-w-md gap-12">
    <Specimen caption="vertical" class="w-full">
      <Field.Field
        description="Lowercase letters, numbers and hyphens."
        class="w-full"
      >
        <Field.Label>Project name</Field.Label>
        <Input />
      </Field.Field>
    </Specimen>
    <Specimen caption="horizontal, with a switch" class="w-full">
      <Field.Field orientation="horizontal" class="w-full">
        <Switch />
        <Field.Label>Email me when a run fails</Field.Label>
      </Field.Field>
    </Specimen>
    <Specimen caption="a set of radios, with a legend" class="w-full">
      <Field.Set>
        <Field.Legend>Plan</Field.Legend>
        <RadioGroup.Root value="hobby">
          <Field.Field orientation="horizontal">
            <RadioGroup.Item value="hobby" id="plan-hobby" />
            <Field.Label for="plan-hobby">Hobby</Field.Label>
          </Field.Field>
          <Field.Field orientation="horizontal">
            <RadioGroup.Item value="team" id="plan-team" />
            <Field.Label for="plan-team">Team</Field.Label>
          </Field.Field>
        </RadioGroup.Root>
      </Field.Set>
    </Specimen>
    <Specimen caption="a choice card" class="w-full">
      <Field.Label for="choice-logs">
        <Field.Field id="choice-logs" orientation="horizontal">
          <Checkbox checked aria-labelledby="choice-logs-title" />
          <Field.Content>
            <Field.Title id="choice-logs-title"
              >Keep run logs for 30 days</Field.Title
            >
            <Field.Description
              >Older logs are deleted each night.</Field.Description
            >
          </Field.Content>
        </Field.Field>
      </Field.Label>
    </Specimen>
    <Specimen caption="a separator with text" class="w-full">
      <div class="grid w-full gap-6">
        <Field.Separator>or continue with</Field.Separator>
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <Field.Field error="Enter a project name.">
      <Field.Label>Invalid, with its error</Field.Label>
      <Input />
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection
  id="wiring"
  title="Wiring"
  intro="Seven invalid containers, one per control that reads the field, each with a description and an error, and two checkbox sets. A set describes its own fieldset; its checkboxes never take its ids. All of it is in the prerendered HTML."
>
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
        <OtpSix />
      </Field.Field>
    </div>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      <code>Field</code> gives its control an <code>id</code> that its label's
      <code>for</code> names, <code>aria-describedby</code> naming the
      description and the error it renders, and <code>aria-invalid</code> when it
      has an error. All of it is computed from props, so it is in the server HTML.
    </li>
    <li>
      The error is text, not a live region: errors appear on submit, and focus
      moves to an error summary or the first invalid field.
    </li>
    <li>
      A group of radios or checkboxes uses <code>FieldSet</code> and its legend.
      The set describes its own <code>&lt;fieldset&gt;</code> with its
      description and error. A radio group takes the set's wiring and is named
      by the legend; a checkbox never takes the set's ids, only its own
      <code>Field</code>'s.
    </li>
    <li>
      A choice card's label wraps its control, so the control also names itself
      with <code>aria-labelledby</code> on the card's title.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Two stops: a valid input and an invalid one, each described by its field."
>
  <div data-testid="keyboard-fixture" class="grid max-w-md gap-6">
    <Field.Field id="kb-valid" description="Lowercase letters and numbers.">
      <Field.Label>Username</Field.Label>
      <Input />
    </Field.Field>
    <Field.Field
      id="kb-invalid"
      description="At least twelve characters."
      error="Too short."
    >
      <Field.Label>Password</Field.Label>
      <Input type="password" />
    </Field.Field>
  </div>
</PreviewSection>
