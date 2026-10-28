<script lang="ts">
  import Copy from "phosphor-svelte/lib/Copy";
  import Plus from "phosphor-svelte/lib/Plus";
  import { Button } from "#lib/registry/ui/button";
  import { Input } from "#lib/registry/ui/input";
  import * as InputGroup from "#lib/registry/ui/input-group";
  import * as InputOTP from "#lib/registry/ui/input-otp";
  import * as NativeSelect from "#lib/registry/ui/native-select";
  import * as Tooltip from "#lib/registry/ui/tooltip";
  import ItemHeader from "#lib/preview/item-header.svelte";
  import PreviewSection from "#lib/preview/preview-section.svelte";
  import Specimen from "#lib/preview/specimen.svelte";

  const variants = [
    "default",
    "secondary",
    "ghost",
    "destructive",
    "link",
  ] as const;

  let submits = $state(0);
  let busy = $state(true);
</script>

<ItemHeader name="button" />

<PreviewSection
  id="variants"
  title="Variants"
  intro="One blue default per surface. Secondary carries a visible border; ghost sits in toolbars; destructive is solid red; link is always underlined."
>
  <div class="grid gap-8">
    {#each variants as variant (variant)}
      <div class="flex flex-wrap items-end gap-6">
        <Specimen caption="{variant} · default">
          <Button {variant}>Save changes</Button>
        </Specimen>
        <Specimen caption="{variant} · sm">
          <Button {variant} size="sm">Save changes</Button>
        </Specimen>
        <Specimen caption="{variant} · icon">
          <Button {variant} size="icon" aria-label="Add"
            ><Plus aria-hidden="true" /></Button
          >
        </Specimen>
        <Specimen caption="{variant} · icon-sm">
          <Button {variant} size="icon-sm" aria-label="Add"
            ><Plus aria-hidden="true" /></Button
          >
        </Specimen>
      </div>
    {/each}
    <div class="flex flex-wrap items-end gap-6">
      <Specimen caption="link · href">
        <Button variant="link" href="/items/button/#states"
          >Read the states</Button
        >
      </Specimen>
      <Specimen caption="icon · with a tooltip">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              {#snippet child({ props })}
                <Button
                  {...props}
                  size="icon"
                  variant="secondary"
                  aria-label="Copy"
                >
                  <Copy aria-hidden="true" />
                </Button>
              {/snippet}
            </Tooltip.Trigger>
            <Tooltip.Content>Copy</Tooltip.Content>
          </Tooltip.Root>
        </Tooltip.Provider>
      </Specimen>
      <Specimen caption="default · with an icon">
        <Button><Plus aria-hidden="true" />New project</Button>
      </Specimen>
    </div>
  </div>
</PreviewSection>

<PreviewSection id="states" title="States">
  <div class="flex flex-wrap items-end gap-6">
    <Specimen caption="disabled">
      <Button disabled>Save changes</Button>
    </Specimen>
    <Specimen caption="secondary · disabled">
      <Button variant="secondary" disabled>Cancel</Button>
    </Specimen>
    <Specimen caption="busy">
      <Button busy>Signing in…</Button>
    </Specimen>
    <Specimen caption="secondary · busy">
      <Button variant="secondary" size="sm" busy>Saving</Button>
    </Specimen>
  </div>
</PreviewSection>

<PreviewSection id="accessibility" title="Accessibility">
  <ul class="grid max-w-prose list-disc gap-2 pl-6">
    <li>
      A <code>&lt;button type="button"&gt;</code> by default, or an
      <code>&lt;a&gt;</code> with <code>href</code>. Enter and Space activate
      it.
    </li>
    <li>
      An icon-only button has an <code>aria-label</code>; a tooltip, if any,
      repeats it.
    </li>
    <li>
      Busy keeps the button enabled and focused, sets
      <code>aria-busy="true"</code>, shows a spinner and ignores clicks, so a
      form is not submitted twice. Disabled leaves the tab order.
    </li>
    <li>Focus shows the 2 px ring outline. Every button is at least 32 px.</li>
    <li>
      An icon you pass into a button is decoration: give it
      <code>aria-hidden="true"</code>, because phosphor icons render
      <code>role="img"</code> with no name.
    </li>
  </ul>
</PreviewSection>

<PreviewSection
  id="heights"
  title="Heights"
  intro="Default controls are 48 px tall and small ones 32 px, so a form or a toolbar lines up. The tests measure this row."
>
  <div data-testid="heights" class="flex flex-wrap items-start gap-4">
    <Button data-testid="height-button">Continue</Button>
    <Button
      data-testid="height-icon"
      size="icon"
      variant="secondary"
      aria-label="Copy"
    >
      <Copy aria-hidden="true" />
    </Button>
    <div class="w-48">
      <Input
        data-testid="height-input"
        aria-label="Email"
        placeholder="Email"
      />
    </div>
    <div class="w-48">
      <NativeSelect.Root data-testid="height-select" aria-label="Region">
        <NativeSelect.Option value="eu">Europe</NativeSelect.Option>
        <NativeSelect.Option value="us">Americas</NativeSelect.Option>
      </NativeSelect.Root>
    </div>
    <div class="w-64">
      <InputGroup.Root data-testid="height-input-group">
        <InputGroup.Input aria-label="Search" placeholder="Search" />
        <InputGroup.Addon align="inline-end">
          <InputGroup.Text>⌘K</InputGroup.Text>
        </InputGroup.Addon>
      </InputGroup.Root>
    </div>
    <div data-testid="height-otp">
      <InputOTP.Root maxlength={6} aria-label="Code">
        {#snippet children({ cells })}
          <InputOTP.Group>
            {#each cells.slice(0, 3) as cell, i (i)}
              <InputOTP.Slot {cell} />
            {/each}
          </InputOTP.Group>
        {/snippet}
      </InputOTP.Root>
    </div>
    <Button data-testid="height-sm" size="sm" variant="secondary">Small</Button>
    <Button
      data-testid="height-icon-sm"
      size="icon-sm"
      variant="ghost"
      aria-label="Add"
    >
      <Plus aria-hidden="true" />
    </Button>
  </div>
</PreviewSection>

<PreviewSection
  id="keyboard"
  title="Keyboard"
  intro="Seven stops: default, secondary, ghost, destructive, link, an icon button and a busy submit. The disabled button between them is skipped."
>
  <form
    data-testid="keyboard-fixture"
    class="flex flex-wrap items-center gap-4"
    onsubmit={(event) => {
      event.preventDefault();
      submits += 1;
    }}
  >
    <Button>Default</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="ghost">Ghost</Button>
    <Button disabled>Disabled</Button>
    <Button variant="destructive">Delete</Button>
    <Button variant="link">Link</Button>
    <Button size="icon" variant="secondary" aria-label="Copy"
      ><Copy aria-hidden="true" /></Button
    >
    <Button type="submit" variant="secondary" {busy} data-testid="busy-button"
      >Signing in…</Button
    >
    <p class="text-sm text-muted-foreground">
      Submits: <output data-testid="submit-count">{submits}</output>
    </p>
  </form>
  <p class="mt-6 text-sm text-muted-foreground">
    The busy submit is secondary, so this surface spends one blue action, on
    Default. Outside the fixture:
    <Button
      variant="ghost"
      size="sm"
      data-testid="busy-toggle"
      onclick={() => (busy = !busy)}>{busy ? "Stop busy" : "Make busy"}</Button
    >
  </p>
</PreviewSection>
