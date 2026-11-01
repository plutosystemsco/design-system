<script lang="ts">
  import ArrowRight from "phosphor-svelte/lib/ArrowRight";
  import MagnifyingGlass from "phosphor-svelte/lib/MagnifyingGlass";
  import * as Field from "#lib/registry/ui/field";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import { Label } from "#lib/registry/ui/label";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";
</script>

<ItemHeader name="input-group" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="Addons sit inline at the start or end, or as a block above or below. The group takes the input recipe and draws one focus ring around itself."
>
  <div class="grid max-w-md gap-8">
    <Specimen caption="inline-start text, inline-end button" class="w-full">
      <div class="grid w-full gap-3">
        <Label for="ig-search">Search runs</Label>
        <InputGroup.Root>
          <InputGroup.Addon>
            <MagnifyingGlass aria-hidden="true" />
          </InputGroup.Addon>
          <InputGroup.Input id="ig-search" placeholder="Run id or branch" />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Button size="icon-sm" aria-label="Search">
              <ArrowRight aria-hidden="true" />
            </InputGroup.Button>
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>
    </Specimen>
    <Specimen caption="inline-end text" class="w-full">
      <div class="grid w-full gap-3">
        <Label for="ig-domain">Subdomain</Label>
        <InputGroup.Root>
          <InputGroup.Input id="ig-domain" value="pluto-sandbox" />
          <InputGroup.Addon align="inline-end">
            <InputGroup.Text>.example.com</InputGroup.Text>
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>
    </Specimen>
    <Specimen caption="textarea with a block-end addon" class="w-full">
      <div class="grid w-full gap-3">
        <Label for="ig-message">Message</Label>
        <InputGroup.Root>
          <InputGroup.Textarea
            id="ig-message"
            placeholder="Ask about this run"
          />
          <InputGroup.Addon align="block-end">
            <InputGroup.Text>Enter to send</InputGroup.Text>
            <InputGroup.Button variant="default" class="ml-auto"
              >Send</InputGroup.Button
            >
          </InputGroup.Addon>
        </InputGroup.Root>
      </div>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="grid max-w-md gap-8">
    <Field.Field>
      <Field.Label>Password, hidden</Field.Label>
      <InputGroup.Password autocomplete="current-password" />
    </Field.Field>
    <Field.Field>
      <Field.Label>Password, shown</Field.Label>
      <InputGroup.Password
        autocomplete="new-password"
        value="correct horse"
        shown
      />
    </Field.Field>
    <Field.Field error="Enter a subdomain.">
      <Field.Label>Invalid, with its error</Field.Label>
      <InputGroup.Root>
        <InputGroup.Input />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>.example.com</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup.Root>
    </Field.Field>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      The text control drops its own focus ring; the group draws it, around the
      addons too. A button inside keeps its own ring.
    </li>
    <li>
      Invalid turns the group's border red; the error is wired by the
      <code>Field</code>.
    </li>
    <li>
      The password toggle's visible word, Show or Hide, is in its name ("Show
      password"); it names the input with <code>aria-controls</code>. The input
      never blocks paste; <code>autocomplete</code> is the consuming app's.
    </li>
    <li>
      An icon you pass into an addon or a button is decoration: give it
      <code>aria-hidden="true"</code>, because phosphor icons render
      <code>role="img"</code> with no name.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Four stops: an input and its button, a password input and its toggle."
>
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
</PreviewSection>
