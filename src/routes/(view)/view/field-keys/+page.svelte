<script lang="ts">
  import * as Accordion from "#lib/registry/ui/accordion";
  import { Checkbox } from "#lib/registry/ui/checkbox";
  import * as Field from "#lib/registry/ui/field";
  import { Input } from "#lib/registry/ui/input";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import * as InputOTP from "#lib/registry/ui/input-otp";
  import * as Item from "#lib/registry/ui/item";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import * as RadioGroup from "#lib/registry/ui/radio-group";
  import { Switch } from "#lib/registry/ui/switch";
  import { Textarea } from "#lib/registry/ui/textarea";
  import * as Tooltip from "#lib/registry/ui/tooltip";
  import {
    idOf,
    isSet,
    OLD,
    oldField,
    oldFieldSet,
    triggerIdOf,
  } from "#lib/site/test-views/field-keys/keys";
  import ReadKey from "#lib/site/test-views/field-keys/read-key.svelte";
  import SetKey from "#lib/site/test-views/field-keys/set-key.svelte";

  // 020 tests 7 and 8, decision 4: a test surface, not a block's view. Each
  // old key meets a 0.13.0 item, in both directions; the e2e test reads the
  // prerendered HTML. It goes in 0.14.0 with the old keys.
</script>

<svelte:head>
  <title>Old and new context keys</title>
</svelte:head>

{#snippet wiring(id: string)}
  <p id="{id}-description" class="text-sm text-muted-foreground">
    Described by the old field.
  </p>
  <p id="{id}-error" class="text-sm text-destructive">
    Marked by the old field.
  </p>
{/snippet}

<div class="mx-auto grid max-w-2xl gap-12 p-8">
  <h1 class="text-2xl font-semibold">Old and new context keys</h1>

  <section aria-labelledby="old-setters" class="grid gap-8">
    <h2 id="old-setters" class="text-xl font-semibold">
      A new control under an old field
    </h2>

    <SetKey key={OLD.field} value={oldField("old-input")}>
      <div data-case="input" class="grid gap-2">
        <label for="old-input">Input</label>
        <Input />
        {@render wiring("old-input")}
      </div>
    </SetKey>

    <SetKey key={OLD.field} value={oldField("old-textarea")}>
      <div data-case="textarea" class="grid gap-2">
        <label for="old-textarea">Textarea</label>
        <Textarea />
        {@render wiring("old-textarea")}
      </div>
    </SetKey>

    <SetKey key={OLD.field} value={oldField("old-checkbox")}>
      <div data-case="checkbox" class="grid gap-2">
        <label for="old-checkbox">Checkbox</label>
        <Checkbox />
        {@render wiring("old-checkbox")}
      </div>
    </SetKey>

    <SetKey key={OLD.field} value={oldField("old-switch")}>
      <div data-case="switch" class="grid gap-2">
        <label for="old-switch">Switch</label>
        <Switch />
        {@render wiring("old-switch")}
      </div>
    </SetKey>

    <SetKey key={OLD.field} value={oldField("old-native-select")}>
      <div data-case="native-select" class="grid gap-2">
        <label for="old-native-select">Native select</label>
        <NativeSelect.Root>
          <NativeSelect.Option value="a">First</NativeSelect.Option>
          <NativeSelect.Option value="b">Second</NativeSelect.Option>
        </NativeSelect.Root>
        {@render wiring("old-native-select")}
      </div>
    </SetKey>

    <SetKey key={OLD.field} value={oldField("old-input-otp")}>
      <div data-case="input-otp" class="grid gap-2">
        <label for="old-input-otp">Code</label>
        <InputOTP.Root maxlength={3}>
          {#snippet children({ cells })}
            <InputOTP.Group>
              {#each cells as cell, i (i)}
                <InputOTP.Slot {cell} />
              {/each}
            </InputOTP.Group>
          {/snippet}
        </InputOTP.Root>
        {@render wiring("old-input-otp")}
      </div>
    </SetKey>

    <SetKey key={OLD.field} value={oldField("old-input-group-password")}>
      <div data-case="input-group-password" class="grid gap-2">
        <label for="old-input-group-password">Password</label>
        <InputGroup.Password autocomplete="current-password" />
      </div>
    </SetKey>

    <SetKey key={OLD.fieldSet} value={oldFieldSet("old-radio-group")}>
      <div data-case="radio-group" class="grid gap-2">
        <span id="old-radio-group-legend">Plan</span>
        <RadioGroup.Root value="a">
          <div class="flex items-center gap-2">
            <RadioGroup.Item value="a" id="old-radio-a" />
            <label for="old-radio-a">Hobby</label>
          </div>
          <div class="flex items-center gap-2">
            <RadioGroup.Item value="b" id="old-radio-b" />
            <label for="old-radio-b">Team</label>
          </div>
        </RadioGroup.Root>
        {@render wiring("old-radio-group")}
      </div>
    </SetKey>
  </section>

  <section aria-labelledby="new-setters" class="grid gap-8">
    <h2 id="new-setters" class="text-xl font-semibold">
      An old reader under a new item
    </h2>

    <Field.Field id="new-field">
      <Field.Label>Name</Field.Label>
      <Input />
      <ReadKey key={OLD.field} testid="reads-field" found={idOf} />
      <ReadKey key={OLD.fieldLabel} testid="reads-field-label" found={idOf} />
    </Field.Field>

    <Field.Set id="new-set">
      <Field.Legend>Size</Field.Legend>
      <RadioGroup.Root value="s">
        <div class="flex items-center gap-2">
          <RadioGroup.Item value="s" id="new-size-s" />
          <label for="new-size-s">Small</label>
        </div>
      </RadioGroup.Root>
      <ReadKey key={OLD.fieldSet} testid="reads-field-set" found={idOf} />
    </Field.Set>

    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>Help</Tooltip.Trigger>
        <Tooltip.Content>More about this page</Tooltip.Content>
        <ReadKey key={OLD.tooltip} testid="reads-tooltip" found={isSet} />
      </Tooltip.Root>
    </Tooltip.Provider>

    <Item.Group>
      <Item.Root>
        <Item.Content>
          <Item.Title>An item in a group</Item.Title>
          <ReadKey
            key={OLD.itemGroup}
            testid="reads-item-group"
            found={isSet}
          />
        </Item.Content>
      </Item.Root>
    </Item.Group>

    <Accordion.Root type="single">
      <Accordion.Item value="one">
        <Accordion.Trigger>One question</Accordion.Trigger>
        <Accordion.Content>Its answer.</Accordion.Content>
        <ReadKey
          key={OLD.accordionItem}
          testid="reads-accordion-item"
          found={triggerIdOf}
        />
      </Accordion.Item>
    </Accordion.Root>
  </section>
</div>
